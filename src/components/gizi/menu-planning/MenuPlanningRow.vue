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
        :tabindex="0"
        @keydown.enter="$emit('open-menu-modal', index)"
      >
        <template v-if="recipe">
          <div class="menu-selected-content">
            <span class="material-symbols-outlined menu-icon">restaurant</span>
            <span class="menu-name">{{ recipe.name }}</span>
          </div>
          <button
            v-if="canUpdate"
            type="button"
            class="btn-clear"
            @click.stop="onClearMenu"
            aria-label="Hapus Pilihan"
          >
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
        <BaseBadge variant="info" :text="`${formatNum(recipe.totals?.calorie ?? 0)} kcal`" />
        <BaseBadge variant="success" :text="`${formatDec(recipe.totals?.protein ?? 0)}g protein`" />
        <BaseBadge variant="warning" :text="`${formatDec(recipe.totals?.carbohydrate ?? 0)}g karbo`" />
        <BaseBadge variant="danger" :text="`${formatDec(recipe.totals?.fat ?? 0)}g lemak`" />
      </div>
      <div v-else class="text-muted text-sm empty-nutrition">Belum ada menu</div>
    </td>

    <!-- Status Anti-Bosan -->
    <td class="menu-planning__anti-bosan-col text-center">
      <BaseBadge v-if="item.recipeId" :variant="isRepeated ? 'danger' : 'success'" :text="isRepeated ? 'Repetisi' : 'OK'" />
      <span v-else>-</span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { EditableDayItem } from '@/types/menu-planning'
import type { RecipeDropdownItem } from '@/types/recipe'
import { formatNum, formatDec } from '@/utils/format'

const props = defineProps<{
  item: EditableDayItem
  index: number
  isRepeated: boolean
  recipes: RecipeDropdownItem[]
  canUpdate: boolean
}>()

const emit = defineEmits<{
  (e: 'update-menu', dayIndex: number, recipeId: number | null): void
  (e: 'open-menu-modal', index: number): void
}>()

/**
 * Lookup the recipe from the dropdown list by recipeId.
 * Uses the recipes prop (passed from parent) instead of the old resep.store.
 */
const recipe = computed(() => {
  if (props.item.recipeId === null) return null
  return props.recipes.find(r => r.id === props.item.recipeId) ?? null
})

const onClearMenu = () => {
  emit('update-menu', props.index, null)
}
</script>
