<template>
  <div class="menu-planning__table-wrapper">
    <table class="menu-planning__table">
      <thead>
        <tr>
          <th>Hari & Tanggal</th>
          <th>Pilih Menu</th>
          <th class="text-center">Ringkasan Gizi</th>
          <th class="text-center">Status Anti-Bosan</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loading">
          <tr v-for="idx in 4" :key="idx" class="menu-planning__row">
            <!-- Hari & Tanggal -->
            <td class="menu-planning__day-col">
              <div class="skeleton-shimmer skeleton-day-title"></div>
              <div class="skeleton-shimmer skeleton-day-date"></div>
            </td>

            <!-- Pilih Menu -->
            <td class="menu-planning__menu-col">
              <div class="skeleton-shimmer skeleton-menu-selector"></div>
            </td>

            <!-- Ringkasan Gizi -->
            <td class="menu-planning__nutrition-col is-loading">
              <div class="skeleton-shimmer skeleton-nutrition-badge" v-for="i in 4" :key="i"></div>
            </td>

            <!-- Status Anti-Bosan -->
            <td class="menu-planning__anti-bosan-col text-center">
              <div class="skeleton-shimmer skeleton-anti-bosan"></div>
            </td>
          </tr>
        </template>
        <template v-else>
          <MenuPlanningRow
            v-for="(day, idx) in days"
            :key="idx"
            :item="day"
            :index="idx"
            :is-repeated="!!repeatedStatusMap[idx]"
            :recipes="recipes"
            :can-update="canUpdate"
            @update-menu="onUpdateMenu"
            @open-menu-modal="$emit('open-menu-modal', idx)"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import MenuPlanningRow from './MenuPlanningRow.vue'
import type { EditableDayItem } from '@/types/menu-planning'
import type { RecipeDropdownItem } from '@/types/recipe'
import { useAntiBosanChecker } from '@/composables/useAntiBosanChecker'

defineProps<{
  days: EditableDayItem[]
  recipes: RecipeDropdownItem[]
  canUpdate: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update-menu', dayIndex: number, recipeId: number | null): void
  (e: 'open-menu-modal', dayIndex: number): void
}>()

const { repeatedStatusMap } = useAntiBosanChecker()

const onUpdateMenu = (idx: number, recipeId: number | null) => {
  emit('update-menu', idx, recipeId)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  border-radius: $radius-sm;
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-day-title {
  width: 70px;
  height: 16px;
  margin-bottom: 6px;
}

.skeleton-day-date {
  width: 90px;
  height: 12px;
}

.skeleton-menu-selector {
  width: 100%;
  max-width: 280px;
  height: 40px;
  margin: 0 auto;
  border-radius: $radius-md;
}

.menu-planning__nutrition-col.is-loading {
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  max-width: 170px;
  margin: 0 auto;
  width: 100%;
}

.skeleton-nutrition-badge {
  width: 100%;
  height: 22px;
  border-radius: $radius-sm;
}

.skeleton-anti-bosan {
  width: 48px;
  height: 22px;
  margin: 0 auto;
  border-radius: $radius-sm;
}
</style>
