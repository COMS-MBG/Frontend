<template>
  <tr class="menu-planning__row">
    <!-- Hari & Tanggal -->
    <td class="menu-planning__day-col">
      <strong>{{ item.dayName }}</strong>
      <small>{{ item.date }}</small>
    </td>

    <!-- Pilih Menu -->
    <td class="menu-planning__menu-col">
      <div 
        class="menu-selector"
        :class="{ 
          'is-empty': !recipe, 
          'is-selected': !!recipe,
          'is-repeated': isRepeated
        }"
        @click="$emit('open-menu-modal', index)"
        role="button"
        tabindex="0"
        @keydown.enter="$emit('open-menu-modal', index)"
      >
        <template v-if="recipe">
          <div class="menu-selected-content">
            <span class="material-symbols-outlined menu-icon">restaurant</span>
            <span class="menu-name">{{ recipe.nama }}</span>
          </div>
          <button type="button" class="btn-clear" @click.stop="onClearMenu" aria-label="Hapus Pilihan">
            <span class="material-symbols-outlined">close</span>
          </button>
        </template>
        <template v-else>
          <span class="material-symbols-outlined menu-icon-add">add_circle</span>
          <span class="menu-placeholder">Klik untuk memilih menu...</span>
        </template>
      </div>
      <div v-if="isRepeated" class="menu-warning-text">
        <span class="material-symbols-outlined">warning</span> Terdapat pengulangan menu
      </div>
    </td>

    <!-- Ringkasan Gizi -->
    <td class="menu-planning__nutrition-col text-center">
      <div v-if="recipe" class="nutrition-badges">
        <BaseBadge variant="info" :text="`${formatNum(recipe.kalori)} kcal`" />
        <BaseBadge variant="success" :text="`${formatDec(recipe.protein)}g protein`" />
        <BaseBadge variant="warning" :text="`${formatDec(recipe.karbohidrat)}g karbo`" />
        <BaseBadge variant="danger" :text="`${formatDec(recipe.lemak)}g lemak`" />
      </div>
      <div v-else class="text-muted text-sm empty-nutrition">Belum ada menu</div>
    </td>

    <!-- Status Anti-Bosan -->
    <td class="menu-planning__anti-bosan-col text-center">
      <BaseBadge v-if="item.menuId" :variant="isRepeated ? 'danger' : 'success'" :text="isRepeated ? 'Repetisi' : 'OK'" />
      <span v-else>-</span>
    </td>

    <!-- Status Publikasi -->
    <td class="menu-planning__status-col text-center">
      <MenuStatusDropdown 
        :model-value="item.status"
        @update:model-value="(val) => $emit('update-status', index, val)"
      />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import MenuStatusDropdown from './MenuStatusDropdown.vue'
import type { MenuDayItem, StatusPublikasi } from '@/types/menu-planning'
import type { SelectOption } from '@/types/form'
import { useResepStore } from '@/stores/resep.store'
import { formatNum, formatDec } from '@/utils/format'

const props = defineProps<{
  item: MenuDayItem
  index: number
  isRepeated: boolean
  menuOptions: SelectOption[]
}>()

const emit = defineEmits<{
  (e: 'update-menu', dayIndex: number, menuId: number | null): void
  (e: 'update-status', dayIndex: number, status: StatusPublikasi): void
  (e: 'open-menu-modal', index: number): void
}>()

const resepStore = useResepStore()

const recipe = computed(() => {
  if (props.item.menuId === null) return null
  return resepStore.getById(props.item.menuId)
})

const onClearMenu = () => {
  emit('update-menu', props.index, null)
}
</script>


