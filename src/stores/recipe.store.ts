/**
 * stores/recipe.store.ts — Master Data Resep (Pinia)
 *
 * Server-side paginated store following the ingredient.store.ts pattern.
 * Replaces the old resep.store.ts (client-side dummy data).
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getRecipes as apiGetAll,
  getRecipe as apiGetOne,
  createRecipe as apiCreate,
  updateRecipe as apiUpdate,
  deleteRecipe as apiDelete,
  getRecipeDropdown as apiGetDropdown,
} from '@/api/recipe.api'
import type { Recipe, RecipeForm, RecipeDropdownItem } from '@/types/recipe'

export const useRecipeStore = defineStore('recipe', () => {
  // ── State ──────────────────────────────────────────────────
  const recipes = ref<Recipe[]>([])
  const selectedRecipe = ref<Recipe | null>(null)
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

  // Dropdown state (non-paginated, untuk MenuPlanningView)
  const recipeDropdown = ref<RecipeDropdownItem[]>([])
  const isLoadingDropdown = ref(false)

  // ── Getters ────────────────────────────────────────────────
  const totalRecipes = computed(() => pagination.value.total)

  const avgCalorie = computed(() => {
    if (recipes.value.length === 0) return 0
    return Math.round(
      recipes.value.reduce((s, r) => s + r.totals.calorie, 0) / recipes.value.length,
    )
  })

  const avgProtein = computed(() => {
    if (recipes.value.length === 0) return '0.0'
    return (
      recipes.value.reduce((s, r) => s + r.totals.protein, 0) / recipes.value.length
    ).toFixed(1)
  })

  // ── Actions ────────────────────────────────────────────────

  async function fetchRecipes(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const res = await apiGetAll({
        page: filters.value.page,
        per_page: filters.value.per_page,
        search: filters.value.search || undefined,
      })
      recipes.value = res.data
      pagination.value = {
        currentPage: res.meta.current_page,
        lastPage: res.meta.last_page,
        perPage: res.meta.per_page,
        total: res.meta.total,
      }
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat data resep.'
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
      recipes.value = res.data
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

  async function fetchRecipeDetail(id: number): Promise<Recipe | null> {
    try {
      const recipe = await apiGetOne(id)
      selectedRecipe.value = recipe
      return recipe
    } catch {
      return null
    }
  }

  /** Fetch all recipes for dropdown (non-paginated) */
  async function fetchRecipeDropdown(): Promise<void> {
    isLoadingDropdown.value = true
    try {
      recipeDropdown.value = await apiGetDropdown()
    } catch (err: unknown) {
      // Tidak overwrite error state utama — log saja
      console.error('Failed to load recipe dropdown', err)
    } finally {
      isLoadingDropdown.value = false
    }
  }

  async function createRecipe(payload: RecipeForm): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiCreate(payload)
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menambahkan resep.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateRecipe(
    id: number,
    payload: RecipeForm,
  ): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiUpdate(id, payload)
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memperbarui resep.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  async function deleteRecipe(id: number): Promise<boolean> {
    isSubmitting.value = true
    error.value = null

    try {
      await apiDelete(id)
      await silentRefresh()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menghapus resep.'
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
    fetchRecipes()
  }

  function resetState(): void {
    recipes.value = []
    selectedRecipe.value = null
    isLoading.value = false
    isSubmitting.value = false
    error.value = null
    filters.value = { search: '', page: 1, per_page: 10 }
  }

  return {
    // State
    recipes,
    selectedRecipe,
    isLoading,
    isSubmitting,
    error,
    filters,
    pagination,
    recipeDropdown,
    isLoadingDropdown,

    // Getters
    totalRecipes,
    avgCalorie,
    avgProtein,

    // Actions
    fetchRecipes,
    fetchRecipeDetail,
    fetchRecipeDropdown,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    setFilter,
    resetState,
  }
})
