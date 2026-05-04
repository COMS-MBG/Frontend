<template>
  <div class="base-filter-date-wrapper">
    <VueDatePicker 
      :model-value="modelValue" 
      @update:model-value="onUpdate"
      :enable-time-picker="false"
      position="right"
      hide-input-icon
      hide-offset-dates
      :month-change-on-scroll="false"
      prevent-min-max-navigation
      calendar-cell-class-name="custom-cell"
      menu-class-name="custom-menu"
      :auto-apply="true"
    >
      <template #trigger>
        <div class="base-filter-date__inner" :class="{ 'is-active': modelValue }">
          <span class="material-symbols-outlined icon">calendar_month</span>
          
          <div class="date-display">
            <span v-if="!modelValue" class="placeholder">{{ placeholder }}</span>
            <span v-else class="value">{{ formattedDate }}</span>
          </div>
          
          <span class="material-symbols-outlined chevron">expand_more</span>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Filter Tanggal'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onUpdate = (date: Date | null) => {
  if (!date) {
    emit('update:modelValue', '')
    return
  }
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  emit('update:modelValue', `${yyyy}-${mm}-${dd}`)
}

const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue)
  if (isNaN(d.getTime())) return props.modelValue
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
})

function formatInternalDate(date: Date | Date[] | string | null): string {
  if (!date) return 'Pilih Tanggal'
  const d = Array.isArray(date) ? date[0] : (typeof date === 'string' ? new Date(date) : date)
  if (!d || isNaN(d.getTime())) return 'Pilih Tanggal'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd} / ${mm} / ${yyyy}`
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.base-filter-date-wrapper {
  display: inline-block;
  min-width: 180px;

  /* Style override for VueDatePicker to match our theme */
  :deep(.dp__theme_light) {
    --dp-background-color: #{$color-bg-surface};
    --dp-text-color: #{$color-text-primary};
    --dp-hover-color: #{$color-bg-subtle};
    --dp-hover-text-color: #{$color-text-primary};
    --dp-hover-icon-color: #{$color-text-primary};
    --dp-primary-color: #{$color-primary};
    --dp-primary-disabled-color: #e2e8f0;
    --dp-primary-text-color: #ffffff;
    --dp-secondary-color: #64748b;
    --dp-border-color: #{$color-border};
    --dp-menu-border-color: #{$color-border};
    --dp-border-color-hover: #{$color-primary};
    --dp-disabled-color: #f1f5f9;
    --dp-scroll-bar-background: #f1f5f9;
    --dp-scroll-bar-color: #94a3b8;
    --dp-success-color: #10b981;
    --dp-success-color-disabled: #6ee7b7;
    --dp-icon-color: #64748b;
    --dp-danger-color: #ef4444;
    --dp-marker-color: #ef4444;
    --dp-tooltip-color: #ffffff;
    --dp-disabled-color-text: #94a3b8;
    --dp-highlight-color: rgb(37 99 235 / 10%);
    --dp-range-between-dates-background-color: rgb(37 99 235 / 10%);
    --dp-range-between-dates-text-color: #{$color-text-primary};
    --dp-range-between-border-color: rgb(37 99 235 / 10%);
    --dp-font-family: #{$font-body};
    --dp-border-radius: #{$radius-md};
  }

  :deep(.custom-menu) {
    border-radius: 12px !important;
    padding: 8px;
    border: none !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
    font-family: #{$font-body};
  }

  :deep(.custom-cell) {
    width: 36px !important;
    height: 36px !important;
    border-radius: 50% !important; /* Circle hover effect */
    margin: 2px auto;
    font-weight: 500;
    transition: all 0.2s;
  }

  :deep(.dp__active_date) {
    background-color: $color-primary !important;
    color: white !important;
    border-radius: 50% !important;
    border: none !important;
  }

  :deep(.dp__calendar_header_item) {
    font-weight: 600;
    color: $color-text-muted;
    font-size: 0.75rem;
  }

  :deep(.dp__today) {
    border: 1px solid $color-primary;
  }

  :deep(.dp__month_year_row) {
    margin-bottom: 12px;
  }

  :deep(.dp__inner_nav) {
    border: 1px solid $color-border;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: $color-bg-subtle;
    }
  }
}

.base-filter-date__inner {
  display: flex;
  align-items: center;
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  height: 40px;

  &:hover {
    border-color: $color-primary;
  }

  &.is-active {
    background-color: $color-primary-subtle;
    border-color: $color-primary-subtle;
    
    .icon, .chevron, .value {
      color: $color-primary;
      font-weight: 600;
    }
  }

  .icon {
    font-size: 1.25rem;
    color: $color-text-muted;
    margin-right: $space-2;
  }

  .chevron {
    font-size: 1.25rem;
    color: $color-text-muted;
    margin-left: auto;
  }

  .date-display {
    flex: 1;
    font-family: $font-body;
    font-size: $text-sm;
    margin-right: $space-2;
    white-space: nowrap;

    .placeholder {
      color: $color-text-muted;
    }

    .value {
      color: $color-text-primary;
    }
  }
}
</style>
