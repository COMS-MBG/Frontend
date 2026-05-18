/**
 * stores/ingredient.store.ts — Master Bahan Baku (Pinia)
 *
 * Server-side paginated store following the employee.store.ts pattern.
 * Replaces the old bahan.store.ts (client-side dummy data).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getIngredients as apiGetAll,
  createIngredient as apiCreate,
  updateIngredient as apiUpdate,
  deleteIngredient as apiDelete,
} from '@/api/ingredient.api'
import type { Ingredient, IngredientForm } from '@/types/ingredient'

export const useIngredientStore = defineStore('ingredient', () => {
  // ── State ──────────────────────────────────────────────────
  const ingredients = ref<Ingredient[]>([])
  const selectedIngredient = ref<Ingredient | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const filters = ref({
    search: '',
    page: 1,
    per_page: 10,
  })

  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  })

  // ── Getters ────────────────────────────────────────────────
  const totalIngredients = computed(() => pagination.value.total)

  const avgCalorie = computed(() => {
    if (ingredients.value.length === 0) return 0
    return Math.round(
      ingredients.value.reduce((s, i) => s + i.calorie, 0) / ingredients.value.length,
    )
  })

  const avgProtein = computed(() => {
    if (ingredients.value.length === 0) return '0.0'
    return (
      ingredients.value.reduce((s, i) => s + i.protein, 0) / ingredients.value.length
    ).toFixed(1)
  })

  // ── Actions ────────────────────────────────────────────────

  async function fetchIngredients(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const res = await apiGetAll({
        page: filters.value.page,
        per_page: filters.value.per_page,
        search: filters.value.search || undefined,
      })
      ingredients.value = res.data
      pagination.value = {
        currentPage: res.meta.current_page,
        lastPage: res.meta.last_page,
        perPage: res.meta.per_page,
        total: res.meta.total,
      }
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat data bahan baku.'
    } finally {
      isLoading.value = false
    }
  }

  /** Silent refresh — re-fetches without triggering skeleton loader */
  async function silentRefresh(): Promise<void> {
    try {
      const res = await apiGetAll({
        page: filters.value.page,
        per_page: filters.value.per_page,
        search: filters.value.search || undefined,
      })
      ingredients.value = res.data
      pagination.value = {
        currentPage: res.meta.current_page,
        lastPage: res.meta.last_page,
        perPage: res.meta.per_page,
        total: res.meta.total,
      }
    } catch {
      // Silent — don't override existing error
    }
  }

  async function createIngredient(payload: IngredientForm): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiCreate(payload)
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menambahkan bahan baku.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateIngredient(
    id: number,
    payload: IngredientForm,
  ): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiUpdate(id, payload)
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memperbarui bahan baku.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteIngredient(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiDelete(id)
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menghapus bahan baku.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function setFilter(key: 'search' | 'page' | 'per_page', value: string | number): void {
    if (key === 'page') {
      filters.value.page = value as number
    } else if (key === 'per_page') {
      filters.value.per_page = value as number
      filters.value.page = 1
    } else {
      filters.value[key] = value as string
      filters.value.page = 1
    }
    fetchIngredients()
  }

  function resetState(): void {
    ingredients.value = []
    selectedIngredient.value = null
    isLoading.value = false
    isSubmitting.value = false
    error.value = null
    filters.value = { search: '', page: 1, per_page: 10 }
  }

  return {
    // State
    ingredients,
    selectedIngredient,
    isLoading,
    isSubmitting,
    error,
    filters,
    pagination,

    // Getters
    totalIngredients,
    avgCalorie,
    avgProtein,

    // Actions
    fetchIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,
    setFilter,
    resetState,
  }
})
