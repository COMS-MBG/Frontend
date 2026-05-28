/**
 * stores/menuPlanning.store.ts — Perencanaan Menu (Pinia)
 *
 * Server-side integrated store following the recipe.store.ts pattern.
 * Manages menu list, current menu editing state, and editable day items.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getMenus as apiGetAll,
  getMenu as apiGetOne,
  createMenu as apiCreate,
  updateMenu as apiUpdate,
  deleteMenu as apiDelete,
} from '@/api/menu.api'
import type { Menu, EditableDayItem } from '@/types/menu-planning'
import { DAY_NAMES } from '@/types/menu-planning'
import { buildEditDays, computeDateForDay, buildMenuPayload } from '@/utils/menuPlanningHelpers'

export const useMenuPlanningStore = defineStore('menuPlanning', () => {
  // ── State ──────────────────────────────────────────────────
  const menus = ref<Menu[]>([])
  const currentMenu = ref<Menu | null>(null)
  const editDays = ref<EditableDayItem[]>([])

  const isLoading = ref(false)
  const isSaving = ref(false)
  const isFetching = ref(false)
  const error = ref<string | null>(null)
  const isDirty = ref(false)

  const filters = ref({
    search: '',
    status: '',
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
  const days = computed(() => editDays.value)

  const currentStatus = computed(() => currentMenu.value?.status ?? null)
  const currentStatusLabel = computed(() => currentMenu.value?.status_label ?? '')
  const currentWeekLabel = computed(() => currentMenu.value?.week_range_label ?? '')
  const totalMenus = computed(() => pagination.value.total)

  // ── Actions ────────────────────────────────────────────────

  /**
   * Fetch paginated list of all menu plans.
   */
  async function fetchMenus(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const res = await apiGetAll({
        page: filters.value.page,
        per_page: filters.value.per_page,
        search: filters.value.search || undefined,
        status: filters.value.status || undefined,
      })
      menus.value = res.data
      pagination.value = {
        currentPage: res.meta.current_page,
        lastPage: res.meta.last_page,
        perPage: res.meta.per_page,
        total: res.meta.total,
      }
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat daftar menu.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch detail of a single menu and populate editDays from response.
   */
  async function fetchMenuDetail(id: number): Promise<Menu | null> {
    isFetching.value = true
    error.value = null

    try {
      const menu = await apiGetOne(id)
      currentMenu.value = menu
      editDays.value = buildEditDays(menu)
      isDirty.value = false
      return menu
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal memuat detail menu.'
      return null
    } finally {
      isFetching.value = false
    }
  }

  // computeDateForDay is now in utils/menuPlanningHelpers.ts

  /**
   * Initialize empty 4-day editing state for a new menu.
   */
  function initNewWeek(weekStart: string): void {
    currentMenu.value = null
    const result: EditableDayItem[] = []

    for (let dow = 1; dow <= 4; dow++) {
      result.push({
        dayOfWeek: dow,
        dayName: DAY_NAMES[dow] || '',
        date: computeDateForDay(weekStart, dow),
        recipeId: null,
      })
    }

    editDays.value = result
    isDirty.value = false
  }

  /**
   * Set the recipe for a specific day index (0-based).
   */
  function setDayRecipe(dayIndex: number, recipeId: number | null): void {
    const item = editDays.value[dayIndex]
    if (item) {
      item.recipeId = recipeId
      isDirty.value = true
    }
  }

  /**
   * Clear the recipe for a specific day index.
   */
  function clearDayRecipe(dayIndex: number): void {
    setDayRecipe(dayIndex, null)
  }

  // buildPayload is now buildMenuPayload in utils/menuPlanningHelpers.ts

  async function saveMenu(name: string, notes?: string): Promise<boolean> {
    isSaving.value = true
    error.value = null

    try {
      const payload = buildMenuPayload(editDays.value, name, notes)
      let savedMenu: Menu

      if (currentMenu.value?.id) {
        const res = await apiUpdate(currentMenu.value.id, payload)
        savedMenu = res.data
      } else {
        const res = await apiCreate(payload)
        savedMenu = res.data
      }

      // Refresh the list silently while keeping the old badge state
      await fetchMenus()

      // Now that all async operations are finished, apply the new menu state to FE
      currentMenu.value = savedMenu
      isDirty.value = false
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menyimpan menu.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function deleteMenu(id: number): Promise<boolean> {
    isSaving.value = true
    error.value = null

    try {
      await apiDelete(id)
      
      // Refresh the list silently while keeping the old FE state displayed
      await fetchMenus()
      return true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Gagal menghapus menu.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  function setFilter(key: 'search' | 'status' | 'page' | 'per_page', value: string | number): void {
    if (key === 'page') {
      filters.value.page = value as number
    } else if (key === 'per_page') {
      filters.value.per_page = value as number
      filters.value.page = 1
    } else {
      filters.value[key] = value as string
      filters.value.page = 1
    }
    fetchMenus()
  }

  function resetState(): void {
    menus.value = []
    currentMenu.value = null
    editDays.value = []
    isLoading.value = false
    isSaving.value = false
    isFetching.value = false
    error.value = null
    isDirty.value = false
    filters.value = { search: '', status: '', page: 1, per_page: 10 }
  }

  return {
    // State
    menus,
    currentMenu,
    editDays,
    isLoading,
    isSaving,
    isFetching,
    error,
    isDirty,
    filters,
    pagination,

    // Getters
    days,
    currentStatus,
    currentStatusLabel,
    currentWeekLabel,
    totalMenus,

    // Actions
    fetchMenus,
    fetchMenuDetail,
    initNewWeek,
    setDayRecipe,
    clearDayRecipe,
    saveMenu,
    deleteMenu,
    setFilter,
    resetState,
  }
})
