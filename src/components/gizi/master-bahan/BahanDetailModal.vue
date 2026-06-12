<template>
  <BaseModal
    v-model="isOpenModel"
    title="Detail Bahan Baku"
    size="lg"
    @close="onClose"
  >
    <div class="bahan-detail" v-if="ingredient">

      <!-- ── Informasi Dasar ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">nutrition</span>
          Informasi Dasar
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Nama Bahan</span>
            <span class="detail-item__value">{{ ingredient.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Berat Acuan</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ formatDec(ingredient.serving_weight) }} gram
            </span>
          </div>
          <div class="detail-item detail-item--full" v-if="ingredient.description">
            <span class="detail-item__label">Deskripsi</span>
            <span class="detail-item__value">{{ ingredient.description }}</span>
          </div>
        </div>
      </section>

      <!-- ── Kandungan Nutrisi ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">monitoring</span>
          Kandungan Nutrisi
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Kalori</span>
            <span class="detail-item__value detail-item__value--hero">
              {{ formatNum(Math.round(ingredient.calorie)) }} <small>kcal</small>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Protein</span>
            <span class="detail-item__value detail-item__value--highlight detail-item__value--protein">
              {{ formatDec(ingredient.protein) }} g
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Karbohidrat</span>
            <span class="detail-item__value detail-item__value--highlight detail-item__value--karbo">
              {{ formatDec(ingredient.carbohydrate) }} g
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Lemak</span>
            <span class="detail-item__value detail-item__value--highlight detail-item__value--lemak">
              {{ formatDec(ingredient.fat) }} g
            </span>
          </div>
        </div>
      </section>

      <!-- ── Nutrisi Per Gram ── -->
      <section class="detail-section" v-if="ingredient.nutrition_per_gram">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">calculate</span>
          Nutrisi Per Gram
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Kalori / gram</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ ingredient.nutrition_per_gram.calorie }} kcal
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Protein / gram</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ ingredient.nutrition_per_gram.protein }} g
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Karbohidrat / gram</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ ingredient.nutrition_per_gram.carbohydrate }} g
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Lemak / gram</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ ingredient.nutrition_per_gram.fat }} g
            </span>
          </div>
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
            <span class="detail-item__value">{{ formatDate(ingredient.created_at) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Terakhir Diperbarui</span>
            <span class="detail-item__value">{{ formatDate(ingredient.updated_at) }}</span>
          </div>
        </div>
      </section>

    </div>

    <!-- Loading state -->
    <div v-else class="detail-loading">
      <span class="material-symbols-outlined detail-loading__icon">progress_activity</span>
      <p>Memuat data bahan baku...</p>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Tutup</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { Ingredient } from '@/types/ingredient'
import { formatNum, formatDec } from '@/utils/format'

const props = defineProps<{
  isOpen: boolean
  ingredient: Ingredient | null
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
.bahan-detail {
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
