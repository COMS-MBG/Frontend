<template>
  <div class="pagination">
    <span class="pagination__info">
      Menampilkan <strong>{{ from }}–{{ to }}</strong> dari <strong>{{ total }}</strong> {{ itemLabel }}
    </span>

    <div class="pagination__controls">
      <button
        class="pg-btn"
        :disabled="modelValue === 1"
        @click="goTo(1)"
        aria-label="Halaman pertama"
      >
        <span class="material-symbols-outlined">keyboard_double_arrow_left</span>
      </button>

      <button
        class="pg-btn"
        :disabled="modelValue === 1"
        @click="goTo(modelValue - 1)"
        aria-label="Halaman sebelumnya"
      >
        <span class="material-symbols-outlined">chevron_left</span>
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="pg-btn"
        :class="{ 'pg-btn--active': page === modelValue }"
        :aria-current="page === modelValue ? 'page' : undefined"
        @click="goTo(page)"
      >{{ page }}</button>

      <button
        class="pg-btn"
        :disabled="modelValue === totalPages"
        @click="goTo(modelValue + 1)"
        aria-label="Halaman berikutnya"
      >
        <span class="material-symbols-outlined">chevron_right</span>
      </button>

      <button
        class="pg-btn"
        :disabled="modelValue === totalPages"
        @click="goTo(totalPages)"
        aria-label="Halaman terakhir"
      >
        <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  total: number
  perPage: number
  itemLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const from = computed(() => {
  if (props.total === 0) return 0
  return (props.modelValue - 1) * props.perPage + 1
})

const to = computed(() => {
  if (props.total === 0) return 0
  return Math.min(props.modelValue * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 3
  let start = Math.max(1, props.modelValue - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function goTo(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:modelValue', page)
  }
}
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: $font-body;

  &__info {
    font-size: $text-sm;
    color: $color-text-secondary;
    font-weight: 500;
    
    strong {
      color: $color-text-primary;
      font-weight: 700;
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: $color-bg-subtle;
    padding: 0.25rem;
    border-radius: $radius-md;
    border: 1px solid $color-border-light;
  }
}

.pg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border: none;
  border-radius: $radius-sm;
  background: transparent;
  color: $color-text-secondary;
  font-size: $text-sm;
  font-weight: 600;
  font-family: $font-body;
  cursor: pointer;
  transition: all $transition-fast;
  user-select: none;

  .material-symbols-outlined {
    font-size: 1.1rem;
  }

  &:hover:not(:disabled):not(.pg-btn--active) {
    background-color: $color-bg-surface;
    color: $color-primary;
    box-shadow: $shadow-sm;
  }

  &--active {
    background-color: $color-primary;
    color: $color-text-inverse;
    box-shadow: $shadow-sm;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }
}

@include mobile {
  .pagination {
    flex-direction: column;
    gap: $space-3;
  }
}
</style>
