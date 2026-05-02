import { reactive, ref, computed, watch } from 'vue'
import { resepSchema, mapResepErrors } from '@/validation/resep.schema'
import type { BahanItemData, ResepFormErrors, NutritionResult, NutritionStat } from '@/types/gizi'

// ── Debounce utility (no external dep needed) ──────────────
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: any[]) => {
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
 */
export function useResepForm() {
  // ── Form State (user input only) ─────────────────────────
  const formState = reactive({
    namaResep: '',
    bahanList: [createEmptyBahan()] as BahanItemData[],
  })

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
  function loadRecipe(id: string | string[]) {
    formState.namaResep = 'Nasi Ayam Sayur (Edit Mode)'
    formState.bahanList = [
      { id: '1', bahanId: 'ayam', gram: 200 },
      { id: '2', bahanId: 'bayam', gram: 100 },
    ]
    calculate()
  }

  // ── Reset form ───────────────────────────────────────────
  function resetForm() {
    formState.namaResep = ''
    formState.bahanList = [createEmptyBahan()]
    nutritionResult.value = createEmptyResult()
    errors.value = {}
  }

  return {
    formState,
    nutritionResult,
    errors,
    validateForm,
    addBahan,
    removeBahan,
    calculate,
    loadRecipe,
    resetForm,
  }
}
