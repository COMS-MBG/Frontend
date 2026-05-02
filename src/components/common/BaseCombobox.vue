<template>
  <div class="base-combobox" ref="comboboxRef">
    <!-- Input Trigger -->
    <div
      class="combobox-input-wrapper"
      :class="{ 'is-open': isOpen, 'is-invalid': !!error, 'is-selected': !!selectedLabel }"
    >
      <span class="material-symbols-outlined combobox-icon-left">search</span>
      <input
        ref="inputRef"
        type="text"
        class="combobox-input"
        :placeholder="selectedLabel || placeholder"
        :value="query"
        :aria-expanded="isOpen"
        :aria-invalid="!!error"
        autocomplete="off"
        @focus="onFocus"
        @input="onInput"
        @keydown.down.prevent="moveHighlight(1)"
        @keydown.up.prevent="moveHighlight(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="close"
        @keydown.tab="close"
      />
      <button
        v-if="modelValue !== null && modelValue !== '' && modelValue !== undefined"
        type="button"
        class="combobox-clear-btn"
        @click.stop="clearSelection"
        tabindex="-1"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
      <span
        class="material-symbols-outlined combobox-chevron"
        :class="{ 'is-open': isOpen }"
        @click="toggleDropdown"
      >
        expand_more
      </span>
    </div>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="combobox-dropdown">
        <div v-if="filteredOptions.length === 0" class="combobox-empty">
          <span class="material-symbols-outlined">search_off</span>
          <span>Tidak ada hasil untuk "<strong>{{ query }}</strong>"</span>
        </div>
        <ul v-else class="combobox-list" ref="listRef" role="listbox">
          <li
            v-for="(opt, i) in filteredOptions"
            :key="opt.value"
            class="combobox-option"
            :class="{
              'is-highlighted': i === highlightedIndex,
              'is-selected': opt.value === modelValue,
            }"
            role="option"
            :aria-selected="opt.value === modelValue"
            @mousedown.prevent="selectOption(opt)"
            @mouseover="highlightedIndex = i"
          >
            <span class="option-label">{{ opt.label }}</span>
            <span v-if="opt.value === modelValue" class="material-symbols-outlined option-check">
              check
            </span>
          </li>
        </ul>
      </div>
    </Transition>

    <!-- Error message -->
    <p v-if="error" class="combobox-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { SelectOption } from '@/types/form'

/** @deprecated Use SelectOption from '@/types/form' instead */
export type ComboboxOption = SelectOption

const props = defineProps<{
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number | null): void
}>()

const comboboxRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const query = ref('')
const highlightedIndex = ref(-1)

// Derive label of currently selected value
const selectedLabel = computed(() => {
  if (props.modelValue === null || props.modelValue === '' || props.modelValue === undefined) return ''
  const found = props.options.find((o) => o.value === props.modelValue)
  return found ? found.label : ''
})

// Filter options based on query
const filteredOptions = computed(() => {
  if (!query.value) return props.options
  const q = query.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

function onFocus() {
  query.value = ''
  isOpen.value = true
  highlightedIndex.value = -1
}

function onInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value
  isOpen.value = true
  highlightedIndex.value = 0
}

function toggleDropdown() {
  if (isOpen.value) {
    close()
  } else {
    inputRef.value?.focus()
  }
}

function close() {
  isOpen.value = false
  query.value = ''
  highlightedIndex.value = -1
}

function selectOption(opt: ComboboxOption) {
  emit('update:modelValue', opt.value)
  close()
}

function clearSelection() {
  emit('update:modelValue', null)
  query.value = ''
  inputRef.value?.focus()
}

function moveHighlight(dir: 1 | -1) {
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  const max = filteredOptions.value.length - 1
  highlightedIndex.value = Math.max(0, Math.min(max, highlightedIndex.value + dir))

  // Scroll highlighted item into view
  if (listRef.value) {
    const items = listRef.value.querySelectorAll('.combobox-option')
    items[highlightedIndex.value]?.scrollIntoView({ block: 'nearest' })
  }
}

function selectHighlighted() {
  const selected = filteredOptions.value[highlightedIndex.value]
  if (selected) {
    selectOption(selected)
  }
}

// Close on outside click
function onClickOutside(e: MouseEvent) {
  if (comboboxRef.value && !comboboxRef.value.contains(e.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

// Reset highlight when filtered list changes
watch(filteredOptions, () => {
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
})
</script>

<style scoped lang="scss">
.base-combobox {
  position: relative;
  width: 100%;
}

/* ── Input Wrapper ── */
.combobox-input-wrapper {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: 0 $space-3;
  height: 40px;
  background-color: $color-bg-surface;
  border: 1.5px solid $color-border;
  border-radius: $radius-md;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: text;

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

.combobox-icon-left {
  font-size: 1.1rem;
  color: $color-text-muted;
  flex-shrink: 0;
}

.combobox-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: $font-body;
  font-size: $text-sm;
  color: $color-text-primary;
  outline: none;
  min-width: 0;

  &::placeholder {
    color: $color-text-muted;
  }
}

.combobox-clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  color: $color-text-muted;
  cursor: pointer;
  border-radius: $radius-sm;
  transition: color 0.15s;
  flex-shrink: 0;

  &:hover { color: $color-danger; }

  .material-symbols-outlined {
    font-size: 1rem;
  }
}

.combobox-chevron {
  font-size: 1.2rem;
  color: $color-text-muted;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
    color: $color-primary;
  }
}

/* ── Dropdown ── */
.combobox-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: $color-bg-surface;
  border: 1.5px solid $color-border;
  border-radius: $radius-md;
  box-shadow: $shadow-lg;
  z-index: 1000;
  overflow: hidden;
}

.combobox-list {
  list-style: none;
  margin: 0;
  padding: $space-1;
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

.combobox-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-2 $space-3;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: background-color 0.1s;
  font-size: $text-sm;
  color: $color-text-primary;

  &.is-highlighted {
    background-color: $color-bg-subtle;
  }

  &.is-selected {
    color: $color-primary;
    font-weight: 600;
    background-color: $color-primary-subtle;
  }
}

.option-check {
  font-size: 1rem;
  color: $color-primary;
}

.combobox-empty {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  color: $color-text-muted;
  font-size: $text-sm;

  .material-symbols-outlined {
    font-size: 1.2rem;
  }
}

/* ── Error ── */
.combobox-error {
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
