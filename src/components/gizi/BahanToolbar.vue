<template>
  <div class="bahan-toolbar">
    <div class="bahan-toolbar__left">
      <BaseInput
        v-model="localSearch"
        placeholder="Cari bahan baku..."
        @update:model-value="$emit('update:search', $event)"
      />
      <BaseSelect
        :model-value="localFilter"
        :options="filterOptions"
        placeholder="Semua Kategori"
        @update:model-value="onFilterChange"
      />
    </div>

    <div class="bahan-toolbar__right">
      <button
        class="btn-secondary btn-with-icon"
        aria-label="Import CSV"
        @click="$emit('import')"
      >
        <span class="material-symbols-outlined">upload_file</span>
        Import CSV
      </button>
      <button
        class="btn-secondary btn-with-icon"
        aria-label="Export CSV"
        @click="$emit('export')"
      >
        <span class="material-symbols-outlined">download</span>
        Export CSV
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import type { SelectOption } from '@/types/form'

const props = defineProps<{
  search: string
  filter: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string | number | null): void
  (e: 'update:filter', value: string): void
  (e: 'import'): void
  (e: 'export'): void
}>()

const localSearch = ref(props.search)
const localFilter = ref<string | number | null>(props.filter)

watch(() => props.search, (v) => { localSearch.value = v })
watch(() => props.filter, (v) => { localFilter.value = v })

function onFilterChange(val: string | number | null) {
  localFilter.value = val
  emit('update:filter', String(val ?? 'all'))
}

const filterOptions: SelectOption[] = [
  { label: 'Semua Kategori', value: 'all' },
  { label: 'Protein', value: 'protein' },
  { label: 'Karbohidrat', value: 'karbo' },
  { label: 'Lemak', value: 'lemak' },
  { label: 'Serat', value: 'serat' },
  { label: 'Lainnya', value: 'lainnya' },
]
</script>

<style scoped lang="scss">
.bahan-toolbar {
  display: flex;
  align-items: center;
  gap: $space-3;
  flex-wrap: wrap;

  &__left {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex: 1;
    min-width: 0;

    .base-input-wrapper {
      max-width: 280px;
    }

    .base-select-wrapper {
      max-width: 200px;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;
  }
}

.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  white-space: nowrap;
  padding: $space-2 $space-3;
  border-radius: $radius-md;
  font-family: $font-body;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid $color-border;
  background-color: $color-bg-subtle;
  color: $color-text-primary;

  .material-symbols-outlined {
    font-size: 1.1rem;
  }

  &:hover {
    background-color: $color-border;
  }
}

@include tablet {
  .bahan-toolbar {
    flex-direction: column;
    align-items: stretch;

    &__left {
      flex-direction: column;

      .base-input-wrapper,
      .base-select-wrapper {
        max-width: none;
      }
    }

    &__right {
      justify-content: flex-end;
    }
  }
}

@include mobile {
  .bahan-toolbar__right {
    flex-direction: column;

    .btn-with-icon {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
