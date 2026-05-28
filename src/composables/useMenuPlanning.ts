import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'
import { useAuth } from '@/composables/useAuth'

/**
 * Composable wrapper for the menu planning store.
 * Provides reactive state, actions, and RBAC-driven permission checks.
 */
export function useMenuPlanning() {
  const store = useMenuPlanningStore()
  const { checkPermission } = useAuth()

  const {
    menus, currentMenu, editDays,
    isLoading, isSaving, isFetching,
    error, isDirty, filters, pagination,
  } = storeToRefs(store)

  const days = computed(() => store.days)
  const currentStatus = computed(() => store.currentStatus)
  const currentStatusLabel = computed(() => store.currentStatusLabel)
  const currentWeekLabel = computed(() => store.currentWeekLabel)
  const totalMenus = computed(() => store.totalMenus)

  // RBAC permission checks
  const canCreate = computed(() => checkPermission('menus.create'))
  const canUpdate = computed(() => checkPermission('menus.update'))
  const canDelete = computed(() => checkPermission('menus.delete'))

  function fetchMenus() { return store.fetchMenus() }
  function fetchMenuDetail(id: number) { return store.fetchMenuDetail(id) }
  function initNewWeek(weekStart: string) { store.initNewWeek(weekStart) }
  function setDayRecipe(dayIndex: number, recipeId: number | null) { store.setDayRecipe(dayIndex, recipeId) }
  function clearDayRecipe(dayIndex: number) { store.clearDayRecipe(dayIndex) }
  function saveMenu(name: string, notes?: string) { return store.saveMenu(name, notes) }
  function deleteMenu(id: number) { return store.deleteMenu(id) }
  function setFilter(key: 'search' | 'status' | 'page' | 'per_page', value: string | number) { store.setFilter(key, value) }
  function resetState() { store.resetState() }

  return {
    // State
    menus, currentMenu, editDays,
    isLoading, isSaving, isFetching,
    error, isDirty, filters, pagination,

    // Getters
    days, currentStatus, currentStatusLabel, currentWeekLabel, totalMenus,

    // Permissions
    canCreate, canUpdate, canDelete,

    // Actions
    fetchMenus, fetchMenuDetail, initNewWeek,
    setDayRecipe, clearDayRecipe,
    saveMenu, deleteMenu, setFilter, resetState,
  }
}
