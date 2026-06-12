<script setup lang="ts">
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import BaseFilterDate from '@/components/common/BaseFilterDate.vue'

defineProps<{
  dateRange: string[]
  perPage: number
}>()

defineEmits<{
  (e: 'update:dateRange', dateRange: string[]): void
  (e: 'update:per-page', perPage: number): void
}>()
</script>

<template>
  <BaseTableToolbar
    :show-search="false"
    :show-filter="false"
    :show-import="false"
    :show-export="false"
    :show-add="false"
    :show-per-page="true"
    :per-page-value="perPage"
    @update:per-page-value="perPage => $emit('update:per-page', perPage)"
    class="delivery-history__toolbar"
  >
    <template #left-append>
      <div class="delivery-history__date-filters">
        <div class="date-filter-field">
          <span class="date-filter-label">Periode</span>
          <BaseFilterDate
            :model-value="dateRange"
            @update:model-value="val => $emit('update:dateRange', val)"
            :range="true"
            placeholder="Rentang Tanggal"
            class="date-picker-range"
          />
        </div>
      </div>
    </template>
  </BaseTableToolbar>
</template>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;
@use '@/assets/styles/abstracts/mixins' as *;

.delivery-history__toolbar {
  padding: 0;
  margin-bottom: $space-4;
  background-color: transparent;
  border: none;
}

.delivery-history__date-filters {
  display: flex;
  align-items: center;
  gap: $space-4;
  flex-wrap: wrap;
  width: 100%;
}

.date-filter-field {
  display: flex;
  align-items: center;
  gap: $space-2;
  width: 100%;

  .date-filter-label {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .date-picker-range {
    width: 250px;
  }
}

@include mobile {
  .delivery-history__date-filters {
    flex-direction: column;
    align-items: stretch;
    gap: $space-3;
  }

  .date-filter-field {
    width: 100%;
    
    .date-picker-range {
      flex: 1;
      width: 100%;
    }
  }
}
</style>
