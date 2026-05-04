<template>
  <div class="employee-toolbar">
    <div class="employee-toolbar__left">
      <BaseInput
        v-model="localSearch"
        placeholder="Cari nama, NRP, atau departemen..."
        @update:model-value="$emit('update:search', $event)"
      />
      <AppSelect
        :model-value="localFilter"
        :options="filterOptions"
        placeholder="Semua Role"
        @update:model-value="onFilterChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/types/form'

const props = defineProps<{
  search: string
  filter: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string | number | null): void
  (e: 'update:filter', value: string): void
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
  { label: 'Semua Role', value: 'all' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Operator', value: 'Operator' },
  { label: 'Viewer', value: 'Viewer' },
]
</script>

<style scoped lang="scss">
.employee-toolbar {
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

    .app-select {
      max-width: 200px;
    }
  }
}

@include tablet {
  .employee-toolbar {
    flex-direction: column;
    align-items: stretch;

    &__left {
      flex-direction: column;

      .base-input-wrapper,
      .app-select {
        max-width: none;
      }
    }
  }
}
</style>