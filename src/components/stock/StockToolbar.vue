<template>
  <div class="stock-toolbar">
    <div class="stock-toolbar__left">
      <div class="stock-toolbar__search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          id="stock-search"
          type="text"
          class="search-input"
          placeholder="Cari bahan baku..."
          :value="searchValue"
          @input="onInput"
        />
      </div>

      <div class="stock-toolbar__filter">
        <AppSelect
          :model-value="statusFilter"
          :options="statusOptions"
          placeholder="Semua Status"
          @update:model-value="(val) => $emit('update:statusFilter', String(val ?? 'all'))"
        />
      </div>
    </div>

    <div class="stock-toolbar__actions">
      <slot name="actions" />

      <button
        v-if="canCreate"
        id="stock-add-btn"
        class="btn-primary"
        @click="$emit('add')"
      >
        <span class="material-symbols-outlined">add</span>
        Ajukan Stok
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/types/form'

const props = defineProps<{
  searchValue: string
  canCreate: boolean
  statusFilter: string
}>()

const emit = defineEmits<{
  (e: 'update:searchValue', val: string): void
  (e: 'update:statusFilter', val: string): void
  (e: 'add'): void
}>()

const localSearch = ref(props.searchValue)
const debouncedSearch = useDebounce(localSearch, 350)

watch(debouncedSearch, (val) => {
  emit('update:searchValue', val)
})

watch(() => props.searchValue, (val) => {
  if (val !== localSearch.value) localSearch.value = val
})

function onInput(event: Event) {
  localSearch.value = (event.target as HTMLInputElement).value
}

const statusOptions: SelectOption[] = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Tersedia', value: 'available' },
  { label: 'Stok Rendah', value: 'low' },
  { label: 'Habis', value: 'empty' },
]
</script>

<style scoped lang="scss">
.stock-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  flex-wrap: wrap;

  &__left {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex: 1;
    min-width: 220px;
    max-width: 550px;
  }

  &__search {
    position: relative;
    flex: 1;
    min-width: 200px;

    .search-icon {
      position: absolute;
      left: $space-3;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.15rem;
      color: $color-text-faint;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: $space-2-5 $space-3 $space-2-5 2.25rem;
      border: 1px solid $color-border;
      border-radius: $radius-md;
      font-size: $text-sm;
      font-family: $font-body;
      color: $color-text-primary;
      background-color: $color-bg-surface;
      transition: border-color $transition-fast, box-shadow $transition-fast;
      outline: none;

      &::placeholder { color: $color-text-faint; }

      &:focus {
        border-color: $color-primary;
        box-shadow: 0 0 0 3px $color-primary-muted;
      }
    }
  }

  &__filter {
    width: 160px;
    flex-shrink: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-2-5;
    flex-shrink: 0;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
  padding: $space-2-5 $space-4;
  border: none;
  border-radius: $radius-md;
  background-color: $color-primary;
  color: $color-text-inverse;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  font-family: $font-body;
  transition: background-color $transition-fast, box-shadow $transition-fast;

  &:hover { background-color: $color-primary-dark; box-shadow: $shadow-primary; }

  .material-symbols-outlined { font-size: 1.1rem; }
}

@include mobile {
  .stock-toolbar {
    &__left {
      width: 100%;
      max-width: none;
      flex-direction: column;
      align-items: stretch;
      gap: $space-2;
    }
    &__filter {
      width: 100%;
    }
  }
}
</style>
