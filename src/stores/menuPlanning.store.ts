import { defineStore } from 'pinia'
import type { WeeklyMenu, StatusPublikasi } from '@/types/menu-planning'

export const useMenuPlanningStore = defineStore('menuPlanning', {
  state: () => ({
    week: null as WeeklyMenu | null,
    selectedWeek: 'w3-apr-2026', // Add global selectedWeek state
    isDirty: false,
    isSaving: false,
    isFetching: false,
  }),

  getters: {
    days: (state) => state.week?.items ?? [],
  },

  actions: {
    setWeek(data: WeeklyMenu) {
      this.week = data
      this.isDirty = false
    },

    setSelectedWeek(weekValue: string) {
      if (this.isDirty) {
        // Normally, you would prompt the user here or handle dirty state in a navigation guard
        console.warn('Navigating away with unsaved changes')
      }
      this.selectedWeek = weekValue
      this.fetchWeek(weekValue)
    },

    setMenu(dayIndex: number, menuId: number | null) {
      if (!this.week) return
      const item = this.week.items[dayIndex]
      if (item) item.menuId = menuId
      this.isDirty = true
    },

    setStatus(dayIndex: number, status: StatusPublikasi) {
      if (!this.week) return
      const item = this.week.items[dayIndex]
      if (item) item.status = status
      this.isDirty = true
    },

    resetChanges() {
      this.isDirty = false
    },

    async fetchWeek(weekValue: string) {
      this.isFetching = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In a real app, you would fetch data for `weekValue`. Here we just mock.
      this.setWeek({
        weekStart: '2026-04-20',
        items: [
          { date: '20 Apr 2026', dayName: 'Senin', menuId: 1, status: 'draft' },
          { date: '21 Apr 2026', dayName: 'Selasa', menuId: 1, status: 'draft' },
          { date: '22 Apr 2026', dayName: 'Rabu', menuId: null, status: 'draft' },
          { date: '23 Apr 2026', dayName: 'Kamis', menuId: null, status: 'draft' },
          { date: '24 Apr 2026', dayName: 'Jumat', menuId: null, status: 'draft' },
        ]
      })
      this.isFetching = false
    },

    async saveWeek() {
      this.isSaving = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      this.isDirty = false
      this.isSaving = false
      return true
    }
  }
})
