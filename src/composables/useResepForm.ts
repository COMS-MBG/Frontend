import { reactive, ref, computed, watch } from 'vue'
import { resepSchema, mapResepErrors } from '@/validation/resep.schema'
import { useResepStore } from '@/stores/resep.store'
import { useBahanStore } from '@/stores/bahan.store'
import type { BahanItemData, ResepFormErrors, NutritionResult, NutritionStat } from '@/types/gizi'
import type { ResepItem } from '@/types/resep'
import type { SelectOption } from '@/types/form'

// ── Debounce utility (no external dep needed) ──────────────
function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

// ── Default empty nutrition result ─────────────────────────
function createEmptyResult(): NutritionResult {
  return {
    calories: 0,
    protein: { val: 0, percent: 0 },
    karbo: { val: 0, percent: 0 },
    lemak: { val: 0, percent: 0 },
    stats: [
      { label: 'Serat', value: 0, unit: 'g', icon: 'eco', status: '', variant: 'default' },
      { label: 'Natrium', value: 0, unit: 'mg', icon: 'water_drop', status: '', variant: 'default' },
      { label: 'Vit. C', value: 0, unit: 'mg', icon: 'nutrition', status: '', variant: 'default' },
      { label: 'Kalsium', value: 0, unit: 'mg', icon: 'vaccines', status: '', variant: 'default' },
    ],
  }
}

// ── Default empty bahan row ────────────────────────────────
function createEmptyBahan(): BahanItemData {
  return { id: Date.now().toString(), bahanId: '', gram: 0 }
}

/**
 * Composable for the Recipe Form — owns form state, validation, and nutrition result.
 * Keeps the View clean from business logic.
 *
 * Connected to `useResepStore` for save/update operations and
 * `useBahanStore` for bahan option list.
 */
export function useResepForm() {
  const resepStore = useResepStore()
  const bahanStore = useBahanStore()

  // ── Form State (user input only) ─────────────────────────
  const formState = reactive({
    namaResep: '',
    bahanList: [createEmptyBahan()] as BahanItemData[],
  })

  /** Editing mode flag — set when loading an existing recipe. */
  const editingId = ref<number | null>(null)

  // ── Bahan Options (derived from store) ────────────────────
  const bahanOptions = computed<SelectOption[]>(() =>
    bahanStore.items.map(b => ({ label: b.nama, value: b.id })),
  )

  // ── Nutrition Result (calculated output, separate concern) 
  const nutritionResult = ref<NutritionResult>(createEmptyResult())

  // ── Typed Errors ─────────────────────────────────────────
  const errors = ref<ResepFormErrors>({})

  // ── Validation ───────────────────────────────────────────
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
    return true
  }

  // ── Debounced watcher — only watches form fields, not nutritionResult
  const formData = computed(() => ({
    nama: formState.namaResep,
    bahanList: formState.bahanList,
  }))

  const debouncedValidate = debounce(validateForm, 300)

  watch(formData, () => {
    debouncedValidate()
  }, { deep: true })

  // ── Bahan CRUD ───────────────────────────────────────────
  function addBahan() {
    formState.bahanList.push(createEmptyBahan())
  }

  function removeBahan(index: number) {
    formState.bahanList.splice(index, 1)
  }

  // ── Calculate (dummy — replace with real API call) ───────
  function calculate() {
    nutritionResult.value = {
      calories: 342,
      protein: { val: 18.4, percent: 22 },
      karbo: { val: 42.1, percent: 48 },
      lemak: { val: 11.5, percent: 30 },
      stats: [
        { label: 'Serat', value: 5.2, unit: 'g', icon: 'eco', status: '+12% Daily Target', variant: 'success' },
        { label: 'Natrium', value: 420, unit: 'mg', icon: 'water_drop', status: 'High Sodium Alert', variant: 'danger' },
        { label: 'Vit. C', value: 24, unit: 'mg', icon: 'nutrition', status: 'Excellent Source', variant: 'warning' },
        { label: 'Kalsium', value: 85, unit: 'mg', icon: 'vaccines', status: 'Moderate', variant: 'default' },
      ],
    }
  }

  // ── Load existing recipe (edit mode) ─────────────────────
  function loadRecipe(id: number): void {
    const recipe = resepStore.getById(id)
    if (!recipe) return

    editingId.value = recipe.id
    formState.namaResep = recipe.nama
    formState.bahanList = recipe.bahanList.map(b => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      bahanId: b.bahanId,
      gram: b.gram,
    }))
    calculate()
  }

  // ── Save recipe to store ─────────────────────────────────
  function saveRecipe(): boolean {
    if (!validateForm()) return false

    const bahanList = formState.bahanList.map(b => ({
      bahanId: Number(b.bahanId),
      gram: Number(b.gram),
    }))

    if (editingId.value !== null) {
      // Update existing
      const existing = resepStore.getById(editingId.value)
      if (existing) {
        resepStore.updateItem({
          ...existing,
          nama: formState.namaResep,
          bahanList,
          kalori: nutritionResult.value.calories,
          protein: nutritionResult.value.protein.val,
          karbohidrat: nutritionResult.value.karbo.val,
          lemak: nutritionResult.value.lemak.val,
        })
      }
    } else {
      // Add new
      const newId = Date.now()
      const newRecipe: ResepItem = {
        id: newId,
        nama: formState.namaResep,
        bahanList,
        status: 'Sesuai Standar',
        statusVariant: 'success',
        kalori: nutritionResult.value.calories,
        protein: nutritionResult.value.protein.val,
        karbohidrat: nutritionResult.value.karbo.val,
        lemak: nutritionResult.value.lemak.val,
      }
      resepStore.addItem(newRecipe)
    }

    return true
  }

  // ── Reset form ───────────────────────────────────────────
  function resetForm() {
    editingId.value = null
    formState.namaResep = ''
    formState.bahanList = [createEmptyBahan()]
    nutritionResult.value = createEmptyResult()
    errors.value = {}
  }

  return {
    formState,
    editingId,
    bahanOptions,
    nutritionResult,
    errors,
    validateForm,
    addBahan,
    removeBahan,
    calculate,
    loadRecipe,
    saveRecipe,
    resetForm,
  }
}
