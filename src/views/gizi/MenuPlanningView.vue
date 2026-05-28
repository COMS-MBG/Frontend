<template>
  <div class="menu-planning">
    <PageHeader
      title="Perencanaan & Penjadwalan Menu"
      subtitle="Kelola menu mingguan dan distribusi gizi"
      :breadcrumb="['Manajemen Gizi', 'Perencanaan Menu']"
    >
      <template #actions>
        <!-- Actions moved to MenuPlanningToolbar for unified UI -->
      </template>
    </PageHeader>

    <MenuNutritionSummary />

    <div class="menu-planning__controls">
      <MenuPlanningToolbar
        :menus="menus"
        :current-menu="currentMenu"
        :is-saving="isSaving"
        :is-fetching="isFetching"
        :is-dirty="isDirty"
        :current-status="currentStatus"
        :current-status-label="currentStatusLabel"
        :can-create="canCreate"
        :can-update="canUpdate"
        :can-delete="canDelete"
        @select-menu="onSelectMenu"
        @save="onSaveAll"
        @new-week="onNewWeek"
        @delete="onOpenDeleteModal"
      />
    </div>

    <MenuPlanningTable
      :days="days"
      :recipes="recipeDropdown"
      :can-update="canUpdate"
      :loading="isPageInit || isFetching"
      @update-menu="onUpdateMenu"
      @open-menu-modal="onOpenMenuModal"
    />

    <MenuSelectionModal
      :is-open="isModalOpen"
      :recipes="recipeDropdown"
      @close="isModalOpen = false"
      @select="onModalSelect"
    />

    <ResultModal
      v-model="isResultOpen"
      :headline="resultHeadline"
      :message="resultMessage"
      :variant="resultVariant"
    />

    <ConfirmDeleteModal
      v-model="isDeleteOpen"
      :item-name="currentMenu?.week_range_label || currentMenu?.name || 'Perencanaan Menu'"
      :is-submitting="isSaving"
      @confirm="onDeleteConfirm"
    />

    <ConfirmBosanModal
      v-model="isBosanOpen"
      :is-submitting="isSaving"
      @confirm="onSaveConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import MenuPlanningToolbar from '@/components/gizi/menu-planning/MenuPlanningToolbar.vue'
import MenuNutritionSummary from '@/components/gizi/menu-planning/MenuNutritionSummary.vue'
import MenuPlanningTable from '@/components/gizi/menu-planning/MenuPlanningTable.vue'
import MenuSelectionModal from '@/components/gizi/menu-planning/MenuSelectionModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ConfirmBosanModal from '@/components/gizi/menu-planning/ConfirmBosanModal.vue'
import { useMenuPlanning } from '@/composables/useMenuPlanning'
import { useRecipe } from '@/composables/useRecipe'
import { useAntiBosanChecker } from '@/composables/useAntiBosanChecker'
import type { Menu } from '@/types/menu-planning'
import type { RecipeDropdownItem } from '@/types/recipe'
import { storeToRefs } from 'pinia'
import { useRecipeStore } from '@/stores/recipe.store'
import { useToast } from '@/composables/useToast'

const {
  menus, currentMenu,
  days, currentStatus, currentStatusLabel,
  isSaving, isFetching, isDirty,
  canCreate, canUpdate, canDelete,
  fetchMenus, fetchMenuDetail, initNewWeek,
  setDayRecipe, saveMenu, deleteMenu, resetState,
} = useMenuPlanning()

const { fetchRecipeDropdown } = useRecipe()
const { hasRepetition } = useAntiBosanChecker()
const recipeStore = useRecipeStore()
const { recipeDropdown } = storeToRefs(recipeStore)
const toast = useToast()
const isPageInit = ref(true)

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(async () => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  try {
    // Fetch recipe dropdown and all menus in parallel to speed up initial load
    await Promise.all([
      fetchRecipeDropdown(),
      fetchMenus()
    ])

    // Auto-load the first menu if available
    const firstMenu = menus.value[0]
    if (firstMenu) {
      await fetchMenuDetail(firstMenu.id)
    }
  } finally {
    isPageInit.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

onBeforeRouteLeave((to, from, next) => {
  if (isDirty.value) {
    const confirmLeave = confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?')
    if (confirmLeave) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})



const isModalOpen = ref(false)
const selectedDayIndex = ref<number | null>(null)

// Result modal states
const isResultOpen = ref(false)
const resultHeadline = ref('')
const resultMessage = ref('')
const resultVariant = ref<'success' | 'error'>('success')

// Delete modal state
const isDeleteOpen = ref(false)

// Warning Anti-Bosan modal state
const isBosanOpen = ref(false)

function onSelectMenu(menu: Menu) {
  fetchMenuDetail(menu.id)
}

function onOpenMenuModal(dayIndex: number) {
  if (!canUpdate.value) {
    toast.error('Anda tidak memiliki hak akses (menus.update) untuk merencanakan menu.')
    return
  }
  selectedDayIndex.value = dayIndex
  isModalOpen.value = true
}

function onModalSelect(recipeId: number) {
  if (selectedDayIndex.value !== null) {
    setDayRecipe(selectedDayIndex.value, recipeId)
  }
}

function onUpdateMenu(dayIndex: number, recipeId: number | null) {
  setDayRecipe(dayIndex, recipeId)
}

function onNewWeek(weekStart: string) {
  initNewWeek(weekStart)
}

function onSaveAll() {
  if (hasRepetition.value) {
    isBosanOpen.value = true
  } else {
    executeSave()
  }
}

async function onSaveConfirm() {
  isBosanOpen.value = false
  await executeSave()
}

async function executeSave() {
  // Use current menu name or generate new one based on the menu week start date
  const weekStart = days.value[0]?.date
  const name = currentMenu.value?.name || (weekStart ? `Menu Minggu ${weekStart}` : `Menu Minggu ${new Date().toISOString().slice(0, 10)}`)
  const notes = currentMenu.value?.notes || undefined
  
  const success = await saveMenu(name, notes)
  if (success) {
    resultVariant.value = 'success'
    resultHeadline.value = 'Berhasil Menyimpan'
    resultMessage.value = 'Perencanaan menu gizi telah berhasil disimpan.'
    isResultOpen.value = true
  } else {
    resultVariant.value = 'error'
    resultHeadline.value = 'Gagal Menyimpan'
    resultMessage.value = 'Gagal menyimpan perencanaan menu gizi. Silakan coba kembali.'
    isResultOpen.value = true
  }
}

function onOpenDeleteModal() {
  isDeleteOpen.value = true
}

async function onDeleteConfirm() {
  if (!currentMenu.value) return
  
  const deletedId = currentMenu.value.id
  const success = await deleteMenu(deletedId)
  isDeleteOpen.value = false
  
  if (success) {
    resultVariant.value = 'success'
    resultHeadline.value = 'Berhasil Menghapus'
    resultMessage.value = 'Perencanaan menu gizi telah berhasil dihapus.'
    isResultOpen.value = true

    // Check if there is a menu left in the list
    const firstMenu = menus.value[0]
    if (firstMenu) {
      // Fetch detail of the next menu in the background (non-blocking)
      fetchMenuDetail(firstMenu.id)
    } else {
      // If no menus left, clear the store state
      resetState()
    }
  } else {
    resultVariant.value = 'error'
    resultHeadline.value = 'Gagal Menghapus'
    resultMessage.value = 'Gagal menghapus perencanaan menu gizi. Silakan coba kembali.'
    isResultOpen.value = true
  }
}
</script>

<style scoped lang="scss">
// Ensure to pull in the specific styles if not globally provided,
// or rely on the main.scss import which should include it.
</style>
