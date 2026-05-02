<template>
  <div class="menu-planning__table-wrapper">
    <table class="menu-planning__table">
      <thead>
        <tr>
          <th>Hari & Tanggal</th>
          <th>Pilih Menu</th>
          <th class="text-center">Ringkasan Gizi</th>
          <th class="text-center">Status Anti-Bosan</th>
          <th class="text-center">Status Publikasi</th>
        </tr>
      </thead>
      <tbody>
        <MenuPlanningRow
          v-for="(day, idx) in days"
          :key="idx"
          :item="day"
          :index="idx"
          :is-repeated="!!repeatedStatusMap[idx]"
          :menu-options="menuOptions"
          @update-menu="onUpdateMenu"
          @update-status="onUpdateStatus"
          @open-menu-modal="$emit('open-menu-modal', idx)"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import MenuPlanningRow from './MenuPlanningRow.vue'
import type { MenuDayItem, StatusPublikasi } from '@/types/menu-planning'
import type { SelectOption } from '@/types/form'
import { useAntiBosanChecker } from '@/composables/useAntiBosanChecker'

defineProps<{
  days: MenuDayItem[]
  menuOptions: SelectOption[]
}>()

const emit = defineEmits<{
  (e: 'update-menu', dayIndex: number, menuId: number | null): void
  (e: 'update-status', dayIndex: number, status: StatusPublikasi): void
  (e: 'open-menu-modal', dayIndex: number): void
}>()

const { repeatedStatusMap } = useAntiBosanChecker()

const onUpdateMenu = (idx: number, menuId: number | null) => {
  emit('update-menu', idx, menuId)
}

const onUpdateStatus = (idx: number, status: StatusPublikasi) => {
  emit('update-status', idx, status)
}
</script>
