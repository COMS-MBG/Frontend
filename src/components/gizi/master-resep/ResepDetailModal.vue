<template>
  <BaseModal
    v-model="isOpenModel"
    title="Detail Resep"
    size="lg"
    @close="onClose"
  >
    <div class="resep-detail" v-if="recipe">

      <!-- ── Informasi Dasar ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">restaurant</span>
          Informasi Dasar
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Nama Resep</span>
            <span class="detail-item__value">{{ recipe.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Total Berat</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ formatDec(recipe.totals.weight) }} gram
            </span>
          </div>
          <div class="detail-item detail-item--full" v-if="recipe.description">
            <span class="detail-item__label">Deskripsi</span>
            <span class="detail-item__value">{{ recipe.description }}</span>
          </div>
        </div>
      </section>

      <!-- ── Total Nutrisi ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">monitoring</span>
          Total Nutrisi
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Kalori</span>
            <span class="detail-item__value detail-item__value--hero">
              {{ formatNum(Math.round(recipe.totals.calorie)) }} <small>kcal</small>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Protein</span>
            <span class="detail-item__value detail-item__value--highlight detail-item__value--protein">
              {{ formatDec(recipe.totals.protein) }} g
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Karbohidrat</span>
            <span class="detail-item__value detail-item__value--highlight detail-item__value--karbo">
              {{ formatDec(recipe.totals.carbohydrate) }} g
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Lemak</span>
            <span class="detail-item__value detail-item__value--highlight detail-item__value--lemak">
              {{ formatDec(recipe.totals.fat) }} g
            </span>
          </div>
        </div>
      </section>

      <!-- ── Daftar Bahan ── -->
      <section class="detail-section" v-if="recipe.ingredients && recipe.ingredients.length > 0">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">format_list_bulleted</span>
          Daftar Bahan ({{ recipe.ingredients.length }})
        </h4>
        <div class="ingredient-table-wrap">
          <table class="ingredient-table">
            <thead>
              <tr>
                <th class="th-left">Bahan</th>
                <th>Berat</th>
                <th>Kalori</th>
                <th>Protein</th>
                <th>Karbo</th>
                <th>Lemak</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ing in recipe.ingredients" :key="ing.id">
                <td class="td-left">{{ ing.ingredient?.name ?? '-' }}</td>
                <td>{{ formatDec(ing.weight_used) }} g</td>
                <td>{{ formatNum(Math.round(ing.contribution.calorie)) }}</td>
                <td>{{ formatDec(ing.contribution.protein) }}</td>
                <td>{{ formatDec(ing.contribution.carbohydrate) }}</td>
                <td>{{ formatDec(ing.contribution.fat) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── Metadata ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">schedule</span>
          Informasi Sistem
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Dibuat</span>
            <span class="detail-item__value">{{ formatDate(recipe.created_at) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Terakhir Diperbarui</span>
            <span class="detail-item__value">{{ formatDate(recipe.updated_at) }}</span>
          </div>
        </div>
      </section>

    </div>

    <!-- Loading state -->
    <div v-else class="detail-loading">
      <span class="material-symbols-outlined detail-loading__icon">progress_activity</span>
      <p>Memuat data resep...</p>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Tutup</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { Recipe } from '@/types/recipe'
import { formatNum, formatDec } from '@/utils/format'

const props = defineProps<{
  isOpen: boolean
  recipe: Recipe | null
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'close'): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

function formatDate(isoStr?: string | null): string {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function onClose() {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.resep-detail {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

// ── Section ──
.detail-section {
  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-text-secondary;
    margin: 0 0 $space-3;
    padding-bottom: $space-2;
    border-bottom: 1px solid $color-border-light;

    .material-symbols-outlined {
      font-size: 1.1rem;
      color: $color-primary;
    }
  }
}

// ── Grid ──
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3 $space-5;
}

// ── Item ──
.detail-item {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &--full {
    grid-column: 1 / -1;
  }

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__value {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-primary;

    &--mono {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.05em;
    }

    &--hero {
      font-size: $text-2xl;
      font-weight: 800;
      color: $color-primary;

      small {
        font-size: $text-sm;
        font-weight: 500;
        color: $color-text-muted;
      }
    }

    &--highlight {
      font-size: $text-lg;
      font-weight: 700;
    }

    &--protein { color: $color-info; }
    &--karbo { color: $color-warning; }
    &--lemak { color: $color-danger; }
  }
}

// ── Ingredient Table ──
.ingredient-table-wrap {
  overflow-x: auto;
  border-radius: $radius-md;
  border: 1px solid $color-border-light;
}

.ingredient-table {
  width: 100%;
  border-collapse: collapse;
  font-size: $text-sm;

  thead tr {
    background: $color-bg-subtle;
  }

  th, td {
    padding: $space-2 $space-3;
    text-align: center;
    white-space: nowrap;
  }

  th {
    font-size: $text-xs;
    font-weight: 700;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .th-left, .td-left {
    text-align: left;
  }

  td {
    color: $color-text-secondary;
    font-variant-numeric: tabular-nums;
  }

  tbody tr {
    border-top: 1px solid $color-border-light;

    &:hover {
      background-color: $color-bg-subtle;
    }
  }
}

// ── Loading ──
.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10;
  gap: $space-3;
  color: $color-text-muted;

  &__icon {
    font-size: 2rem;
    animation: spin 1s linear infinite;
  }

  p {
    margin: 0;
    font-size: $text-sm;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@include mobile {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
