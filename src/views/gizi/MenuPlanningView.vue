<template>
  <div class="menu-planning">
    <PageHeader
      title="Perencanaan & Penjadwalan Menu"
      subtitle="Kelola menu mingguan dan distribusi gizi"
      :breadcrumb="['Manajemen Gizi', 'Perencanaan Menu']"
    >
      <template #actions>
        <button class="btn-secondary btn-with-icon" @click="onCopyLastWeek" aria-label="Salin Jadwal Minggu Lalu" :disabled="menuStore.isSaving">
          <span class="material-symbols-outlined">content_copy</span>
          Salin Minggu Lalu
        </button>
        <button class="btn-primary btn-with-icon" @click="onSaveAll" aria-label="Simpan Semua Perubahan" :disabled="menuStore.isSaving || !menuStore.isDirty">
          <span v-if="menuStore.isSaving" class="material-symbols-outlined is-spinning" style="animation: spin 1s linear infinite;">sync</span>
          <span v-else class="material-symbols-outlined">save</span>
          {{ menuStore.isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan' }}
        </button>
      </template>
    </PageHeader>

    <MenuNutritionSummary />

    <div class="menu-planning__controls">
      <MenuPlanningToolbar />
    </div>

    <MenuPlanningTable
      :days="menuStore.days"
      :menu-options="resepOptions"
      @update-menu="onUpdateMenu"
      @update-status="onUpdateStatus"
      @open-menu-modal="onOpenMenuModal"
    />

    <MenuSelectionModal
      :is-open="isModalOpen"
      @close="isModalOpen = false"
      @select="onModalSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import MenuPlanningToolbar from '@/components/gizi/menu-planning/MenuPlanningToolbar.vue'
import MenuNutritionSummary from '@/components/gizi/menu-planning/MenuNutritionSummary.vue'
import MenuPlanningTable from '@/components/gizi/menu-planning/MenuPlanningTable.vue'
import MenuSelectionModal from '@/components/gizi/menu-planning/MenuSelectionModal.vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'
import { useResepStore } from '@/stores/resep.store'
import type { StatusPublikasi, MenuDayItem } from '@/types/menu-planning'
import { resepDummy } from '@/data/resep.dummy'

const menuStore = useMenuPlanningStore()
const resepStore = useResepStore()

onMounted(() => {
  // Ensure we have recipes loaded
  if (resepStore.items.length === 0) {
    resepStore.setItems(resepDummy)
  }

  // Set default week if none exists
  if (!menuStore.week) {
    menuStore.setWeek({
      weekStart: '2026-04-20',
      items: [
        { date: '20 Apr 2026', dayName: 'Senin', menuId: 1, status: 'draft' },
        { date: '21 Apr 2026', dayName: 'Selasa', menuId: 1, status: 'draft' },
        { date: '22 Apr 2026', dayName: 'Rabu', menuId: null, status: 'draft' },
        { date: '23 Apr 2026', dayName: 'Kamis', menuId: null, status: 'draft' },
        { date: '24 Apr 2026', dayName: 'Jumat', menuId: null, status: 'draft' },
      ]
    })
  }
})

const resepOptions = computed(() => {
  return resepStore.items.map(r => ({
    value: r.id,
    label: r.nama
  }))
})

const isModalOpen = ref(false)
const selectedDayIndex = ref<number | null>(null)

function onOpenMenuModal(dayIndex: number) {
  selectedDayIndex.value = dayIndex
  isModalOpen.value = true
}

function onModalSelect(menuId: number) {
  if (selectedDayIndex.value !== null) {
    menuStore.setMenu(selectedDayIndex.value, menuId)
  }
}

function onUpdateMenu(dayIndex: number, menuId: number | null) {
  menuStore.setMenu(dayIndex, menuId)
}

function onUpdateStatus(dayIndex: number, status: StatusPublikasi) {
  menuStore.setStatus(dayIndex, status)
}

function onCopyLastWeek() {
  // TODO: implement actual copy logic
  console.log('Salin minggu lalu')
}

async function onSaveAll() {
  await menuStore.saveWeek()
}
</script>

<style scoped lang="scss">
// Ensure to pull in the specific styles if not globally provided,
// or rely on the main.scss import which should include it.
</style>
