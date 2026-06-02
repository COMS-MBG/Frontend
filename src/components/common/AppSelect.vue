<template>
  <div class="app-select" ref="selectRef">
    <!-- Label (Optional) -->
    <label v-if="label" class="app-select-label">{{ label }}</label>

    <!-- Trigger -->
    <div
      class="app-select-trigger"
      :class="{ 'is-open': isOpen, 'is-invalid': !!error }"
      @click="toggleDropdown"
      tabindex="0"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.down.prevent="moveHighlight(1)"
      @keydown.up.prevent="moveHighlight(-1)"
      @keydown.escape="close"
    >
      <span class="trigger-label">{{ selectedLabel || placeholder }}</span>
      <span class="material-symbols-outlined trigger-icon" :class="{ 'is-open': isOpen }">
        expand_more
      </span>
    </div>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="app-select-dropdown">
        <ul class="app-select-list" ref="listRef" role="listbox">
          <li
            v-for="(opt, i) in options"
            :key="opt.value"
            class="app-select-option"
            :class="{
              'is-highlighted': i === highlightedIndex,
              'is-selected': opt.value === modelValue,
            }"
            role="option"
            :aria-selected="opt.value === modelValue"
            @mousedown.prevent="selectOption(opt)"
            @mouseover="highlightedIndex = i"
          >
            {{ opt.label }}
          </li>
        </ul>
      </div>
    </Transition>
    
    <p v-if="error && !isInFormGroup" class="app-select-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import type { SelectOption } from '@/types/form'

const isInFormGroup = inject('isInFormGroup', false)

const props = defineProps<{
  modelValue: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number | null): void
}>()

const selectRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)

const selectedLabel = computed(() => {
  if (props.modelValue === null || props.modelValue === '' || props.modelValue === undefined) return ''
  const found = props.options.find((o) => o.value === props.modelValue)
  return found ? found.label : ''
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    const index = props.options.findIndex(o => o.value === props.modelValue)
    highlightedIndex.value = index !== -1 ? index : 0
  }
}

function close() {
  isOpen.value = false
  highlightedIndex.value = -1
}

function selectOption(opt: SelectOption) {
  emit('update:modelValue', opt.value)
  close()
}

function moveHighlight(dir: 1 | -1) {
  if (!isOpen.value) {
    isOpen.value = true
    const index = props.options.findIndex(o => o.value === props.modelValue)
    highlightedIndex.value = index !== -1 ? index : 0
    return
  }
  const max = props.options.length - 1
  highlightedIndex.value = Math.max(0, Math.min(max, highlightedIndex.value + dir))

  if (listRef.value) {
    const items = listRef.value.querySelectorAll('.app-select-option')
    items[highlightedIndex.value]?.scrollIntoView({ block: 'nearest' })
  }
}

function onClickOutside(e: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped lang="scss">
.app-select {
  position: relative;
  width: 100%;
}

.app-select-label {
  display: block;
  margin-bottom: $space-1;
  font-family: $font-body;
  font-size: $text-sm;
  font-weight: 500;
  color: $color-text-primary;
}

/* ── Trigger ── */
.app-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;
  padding: $space-2 $space-3;
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: $color-primary;
  }

  &.is-open {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
  }

  &.is-invalid {
    border-color: $color-danger;
    &.is-open {
      box-shadow: 0 0 0 3px rgba($color-danger, 0.1);
    }
  }
}

.trigger-label {
  font-family: $font-body;
  font-size: $text-sm;
  color: $color-text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trigger-icon {
  font-size: 1.2rem;
  color: $color-text-muted;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
    color: $color-primary;
  }
}

/* ── Dropdown ── */
.app-select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  box-shadow: $shadow-lg;
  z-index: 1000;
  overflow: hidden;
}

.app-select-list {
  list-style: none;
  margin: 0;
  padding: 0; /* Removing padding to match the image exactly (full width blue bg) */
  max-height: 220px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: $color-border;
    border-radius: 2px;
  }
}

.app-select-option {
  display: flex;
  align-items: center;
  padding: $space-2 $space-3;
  cursor: pointer;
  font-size: $text-sm;
  color: $color-text-primary;
  transition: background-color 0.1s, color 0.1s;

  &:hover, &.is-highlighted {
    background-color: $color-bg-subtle;
  }

  &.is-selected {
    background-color: $color-primary;
    color: #ffffff;
    font-weight: 500;
    
    /* When selected, hovering shouldn't change the color to subtle bg */
    &:hover, &.is-highlighted {
      background-color: $color-primary-dark;
    }
  }
}

/* ── Error ── */
.app-select-error {
  margin: $space-1 0 0;
  font-size: $text-xs;
  color: $color-danger;
}

/* ── Dropdown Transition ── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>