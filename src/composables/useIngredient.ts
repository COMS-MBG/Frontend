import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useIngredientStore } from '@/stores/ingredient.store'
import { useAuth } from '@/composables/useAuth'
import type { IngredientForm } from '@/types/ingredient'

/**
 * Composable wrapper for the ingredient store.
 * Provides reactive state, actions, and RBAC-driven permission checks.
 */
export function useIngredient() {
  const store = useIngredientStore()
  const { checkPermission } = useAuth()

  const {
    ingredients, selectedIngredient, pagination,
    isLoading, isSubmitting, error, filters,
  } = storeToRefs(store)

  const totalIngredients = computed(() => store.totalIngredients)
  const avgCalorie = computed(() => store.avgCalorie)
  const avgProtein = computed(() => store.avgProtein)

  // RBAC permission checks
  const canCreate = computed(() => checkPermission('ingredients.create'))
  const canUpdate = computed(() => checkPermission('ingredients.update'))
  const canDelete = computed(() => checkPermission('ingredients.delete'))

  function fetchIngredients() { return store.fetchIngredients() }
  function createIngredient(payload: IngredientForm) { return store.createIngredient(payload) }
  function updateIngredient(id: number, payload: IngredientForm) { return store.updateIngredient(id, payload) }
  function deleteIngredient(id: number) { return store.deleteIngredient(id) }
  function setFilter(key: 'search' | 'page' | 'per_page', value: string | number) { store.setFilter(key, value) }
  function resetState() { store.resetState() }

  return {
    ingredients, selectedIngredient, pagination,
    isLoading, isSubmitting, error, filters,
    totalIngredients, avgCalorie, avgProtein,
    canCreate, canUpdate, canDelete,
    fetchIngredients, createIngredient, updateIngredient,
    deleteIngredient, setFilter, resetState,
  }
}
