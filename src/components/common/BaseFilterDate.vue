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
      :range="range"
    >
      <template #trigger>
        <div class="base-filter-date__inner" :class="{ 'is-active': modelValue && (!Array.isArray(modelValue) || modelValue.length > 0) }">
          <span class="material-symbols-outlined icon">calendar_month</span>
          
          <div class="date-display">
            <span v-if="!formattedDate" class="placeholder">{{ placeholder }}</span>
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

const props = withDefaults(defineProps<{
  modelValue: string | string[]
  placeholder?: string
  range?: boolean
}>(), {
  placeholder: 'Filter Tanggal',
  range: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const onUpdate = (date: Date | Date[] | null) => {
  if (!date) {
    emit('update:modelValue', props.range ? [] : '')
    return
  }
  
  if (Array.isArray(date)) {
    const dates = date.map(d => {
      if (!d) return ''
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    })
    emit('update:modelValue', dates)
  } else {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    emit('update:modelValue', `${yyyy}-${mm}-${dd}`)
  }
}

const formattedDate = computed(() => {
  if (!props.modelValue || (Array.isArray(props.modelValue) && props.modelValue.length === 0)) return ''
  
  if (Array.isArray(props.modelValue)) {
    const start = props.modelValue[0] ? new Date(props.modelValue[0]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    const end = props.modelValue[1] ? new Date(props.modelValue[1]).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    if (start && end) return `${start} - ${end}`
    if (start) return `${start} - ...`
    return ''
  }
  
  const d = new Date(props.modelValue)
  if (isNaN(d.getTime())) return props.modelValue as string
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
  width: 100%;
}

.base-filter-date__inner {
  display: flex;
  align-items: center;
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  transition: all $transition-fast;
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
