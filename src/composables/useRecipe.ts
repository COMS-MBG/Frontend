import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecipeStore } from '@/stores/recipe.store'
import { useAuth } from '@/composables/useAuth'
import type { RecipeForm } from '@/types/recipe'

/**
 * Composable wrapper for the recipe store.
 * Provides reactive state, actions, and RBAC-driven permission checks.
 */
export function useRecipe() {
  const store = useRecipeStore()
  const { checkPermission } = useAuth()

  const {
    recipes, selectedRecipe, pagination,
    isLoading, isSubmitting, error, filters,
    recipeDropdown, isLoadingDropdown,
  } = storeToRefs(store)

  const totalRecipes = computed(() => store.totalRecipes)
  const avgCalorie = computed(() => store.avgCalorie)
  const avgProtein = computed(() => store.avgProtein)

  // RBAC permission checks
  const canCreate = computed(() => checkPermission('recipes.create'))
  const canUpdate = computed(() => checkPermission('recipes.update'))
  const canDelete = computed(() => checkPermission('recipes.delete'))

  function fetchRecipes() { return store.fetchRecipes() }
  function fetchRecipeDetail(id: number) { return store.fetchRecipeDetail(id) }
  function fetchRecipeDropdown() { return store.fetchRecipeDropdown() }
  function createRecipe(payload: RecipeForm) { return store.createRecipe(payload) }
  function updateRecipe(id: number, payload: RecipeForm) { return store.updateRecipe(id, payload) }
  function deleteRecipe(id: number) { return store.deleteRecipe(id) }
  function setFilter(key: 'search' | 'page' | 'per_page', value: string | number) { store.setFilter(key, value) }
  function resetState() { store.resetState() }

  return {
    recipes, selectedRecipe, pagination,
    isLoading, isSubmitting, error, filters,
    recipeDropdown, isLoadingDropdown,
    totalRecipes, avgCalorie, avgProtein,
    canCreate, canUpdate, canDelete,
    fetchRecipes, fetchRecipeDetail, fetchRecipeDropdown, createRecipe, updateRecipe,
    deleteRecipe, setFilter, resetState,
  }
}
