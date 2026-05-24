import { reactive, ref, computed, watch } from 'vue'
import { useIngredientStore } from '@/stores/ingredient.store'
import { getIngredientDropdown } from '@/api/ingredient.api'
import { createRecipe, updateRecipe, getRecipe } from '@/api/recipe.api'
import { resepSchema } from '@/validation/recipe.schema'
import { calculateNutrition } from '@/utils/nutritionCalculator'
import { debounce, createEmptyBahan, createEmptyResult, mapResepErrors } from '@/utils/resepFormHelpers'
import type { Ingredient } from '@/types/ingredient'
import type { RecipeForm, Recipe } from '@/types/recipe'
import type { SelectOption } from '@/types/form'
import type { BahanItemData, ResepFormErrors, NutritionResult } from '@/types/gizi'

// ── Konstanta batas kalori (sesuai backend RecipeRequest.php) ──
const CALORIE_MIN = 2000
const CALORIE_MAX = 2700

/**
 * Composable for the Recipe Form — owns form state, validation, and nutrition result.
 *
 * CALCULATION FORMULA (matches backend Ingredient::calculateNutritionFor exactly):
 *   ratio = weight_used / serving_weight
 *   nutrient = base_nutrient × ratio (rounded to 2 decimal places)
 *
 * Connected to Ingredient API for dropdown and Recipe API for save/update.
 */
export function useResepForm() {
  const ingredientStore = useIngredientStore()

  // ── Ingredient lookup cache (full data for calculation) ────
  const ingredientCache = ref<Ingredient[]>([])
  const isLoadingIngredients = ref(false)

  /** Fetch all ingredients for dropdown + calculation data */
  async function loadIngredients(): Promise<void> {
    isLoadingIngredients.value = true
    try {
      const data = await getIngredientDropdown()
      ingredientCache.value = data
    } catch {
      // Fallback: use store data if available
      if (ingredientStore.ingredients.length > 0) {
        ingredientCache.value = ingredientStore.ingredients
      }
    } finally {
      isLoadingIngredients.value = false
    }
  }

  // ── Form State ────────────────────────────────────────────
  const formState = reactive({
    namaResep: '',
    bahanList: [createEmptyBahan()] as BahanItemData[],
  })

  const editingId = ref<number | null>(null)
  const isSaving = ref(false)
  const isLoadingRecipe = ref(false)
  const saveError = ref<string | null>(null)

  // ── Bahan Options (derived from cache) ────────────────────
  const bahanOptions = computed<SelectOption[]>(() =>
    ingredientCache.value.map(b => ({ label: b.name, value: b.id })),
  )

  // ── Nutrition Result (calculated output) ──────────────────
  const nutritionResult = ref<NutritionResult>(createEmptyResult())

  // ── Typed Errors ──────────────────────────────────────────
  const errors = ref<ResepFormErrors>({})

  // ── Validation ────────────────────────────────────────────
  function validateForm(): boolean {
    const result = resepSchema.safeParse({
      nama: formState.namaResep,
      bahanList: formState.bahanList,
    })

    if (!result.success) {
      errors.value = mapResepErrors(result.error)
      return false
    }

    errors.value = {}

    // Validasi batas kalori (sinkron dengan backend RecipeRequest.php)
    const totalCalorie = nutritionResult.value.calories
    if (totalCalorie > 0 && (totalCalorie < CALORIE_MIN || totalCalorie > CALORIE_MAX)) {
      saveError.value = `Total kalori resep ${totalCalorie.toFixed(2)} kkal tidak memenuhi target (${CALORIE_MIN}–${CALORIE_MAX} kkal). Tambah atau kurangi bahan untuk menyesuaikan.`
      return false
    }

    return true
  }

  // ── Debounced validation ──────────────────────────────────
  const formData = computed(() => ({
    nama: formState.namaResep,
    bahanList: formState.bahanList,
  }))

  const debouncedValidate = debounce(validateForm, 300)

  watch(formData, () => {
    debouncedValidate()
  }, { deep: true })

  // ── Bahan CRUD ────────────────────────────────────────────
  function addBahan() {
    formState.bahanList.push(createEmptyBahan())
  }

  function removeBahan(index: number) {
    formState.bahanList.splice(index, 1)
    calculate() // Recalculate after removal
  }

  // ── CLIENT-SIDE NUTRITION CALCULATION ─────────────────────
  // Delegates to pure utility: nutritionCalculator.ts
  function calculate() {
    nutritionResult.value = calculateNutrition(
      formState.bahanList,
      ingredientCache.value,
    )
  }

  // ── Load existing recipe (edit mode) ──────────────────────
  async function loadRecipe(id: number): Promise<void> {
    isLoadingRecipe.value = true
    try {
      const recipe = await getRecipe(id)
      if (!recipe) return

      editingId.value = recipe.id
      formState.namaResep = recipe.name

      // Map backend ingredients to form bahan items
      formState.bahanList = recipe.ingredients.map(ri => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        bahanId: ri.ingredient?.id ?? '',
        gram: ri.weight_used,
      }))

      calculate()
    } catch {
      // If recipe not found, keep form empty
    } finally {
      isLoadingRecipe.value = false
    }
  }

  // ── Save recipe to backend API ────────────────────────────
  async function saveRecipe(): Promise<boolean> {
    if (!validateForm()) return false

    isSaving.value = true
    saveError.value = null

    // Build API payload (matches RecipeRequest validation)
    const payload: RecipeForm = {
      name: formState.namaResep,
      ingredients: formState.bahanList
        .filter(b => b.bahanId && Number(b.gram) > 0)
        .map(b => ({
          ingredient_id: Number(b.bahanId),
          weight_used: Number(b.gram),
        })),
    }

    try {
      if (editingId.value !== null) {
        await updateRecipe(editingId.value, payload)
      } else {
        await createRecipe(payload)
      }
      return true
    } catch (err: unknown) {
      // Extract detailed validation errors from Axios 422 response
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }
        if (axiosErr.response?.status === 422 && axiosErr.response.data?.errors) {
          // Flatten all validation error messages
          const allErrors = Object.values(axiosErr.response.data.errors).flat()
          saveError.value = allErrors.join('\n')
        } else if (axiosErr.response?.data?.message) {
          saveError.value = axiosErr.response.data.message
        } else {
          saveError.value = 'Gagal menyimpan resep.'
        }
      } else {
        saveError.value = err instanceof Error ? err.message : 'Gagal menyimpan resep.'
      }
      return false
    } finally {
      isSaving.value = false
    }
  }

  // ── Reset form ────────────────────────────────────────────
  function resetForm() {
    editingId.value = null
    formState.namaResep = ''
    formState.bahanList = [createEmptyBahan()]
    nutritionResult.value = createEmptyResult()
    errors.value = {}
    saveError.value = null
  }

  return {
    formState,
    editingId,
    bahanOptions,
    nutritionResult,
    errors,
    isSaving,
    isLoadingRecipe,
    saveError,
    isLoadingIngredients,
    validateForm,
    addBahan,
    removeBahan,
    calculate,
    loadRecipe,
    saveRecipe,
    resetForm,
    loadIngredients,
    ingredientCache,
  }
}
