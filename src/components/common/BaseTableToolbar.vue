<template>
  <div class="base-toolbar">
    <!-- ── LEFT GROUP: Search ────────────────── -->
    <div class="base-toolbar__left">
      <slot name="left-prepend"></slot>
      
      <div v-if="showSearch" class="base-toolbar__search">
        <span class="material-symbols-outlined base-toolbar__search-icon">search</span>
        <input
          :id="searchId"
          ref="searchInputRef"
          type="text"
          class="base-toolbar__search-input"
          :placeholder="searchPlaceholder"
          :value="searchValue"
          @input="onSearchInput"
        />
        <button
          v-if="searchValue"
          class="base-toolbar__search-clear"
          aria-label="Hapus pencarian"
          @click="onClearSearch"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <slot name="left-append"></slot>
    </div>

    <!-- ── RIGHT GROUP: Filter + Actions + Per Page + Add ────────────────── -->
    <div class="base-toolbar__right">
      <slot name="right-prepend"></slot>

      <div v-if="showFilter" class="base-toolbar__filter">
        <slot name="filter">
          <AppSelect
            :model-value="filterValue"
            :options="filterOptions"
            :placeholder="filterPlaceholder"
            @update:model-value="onFilterChange"
          />
        </slot>
      </div>
      
      <slot name="actions"></slot>

      <button
        v-if="showImport"
        class="btn-secondary btn-with-icon"
        aria-label="Import CSV"
        @click="$emit('import')"
      >
        <span class="material-symbols-outlined">upload_file</span>
        {{ importLabel }}
      </button>
      <button
        v-if="showExport"
        class="btn-secondary btn-with-icon"
        aria-label="Export CSV"
        @click="$emit('export')"
      >
        <span class="material-symbols-outlined">download</span>
        {{ exportLabel }}
      </button>

      <!-- ── PER PAGE (FAR RIGHT) ── -->
      <div v-if="showPerPage" class="base-toolbar__per-page">
        <span class="per-page-label">Show:</span>
        <div class="per-page-select">
          <AppSelect
            :model-value="perPageValue"
            :options="perPageOptions"
            @update:model-value="onPerPageChange"
          />
        </div>
      </div>

      <!-- ── ADD BUTTON (FAR RIGHT) ── -->
      <button
        v-if="showAdd"
        class="btn-primary btn-with-icon base-toolbar__btn-add"
        aria-label="Tambah Data"
        @click="$emit('add')"
      >
        <span class="material-symbols-outlined">add</span>
        {{ addLabel }}
      </button>

      <slot name="right-append"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { SelectOption } from '@/types/form'

let toolbarIdCounter = 0

const props = withDefaults(defineProps<{
  /** Search input value (v-model compatible) */
  searchValue?: string
  /** Placeholder for search input */
  searchPlaceholder?: string
  /** Filter dropdown value */
  filterValue?: string | number | null
  /** Filter dropdown options */
  filterOptions?: SelectOption[]
  /** Filter dropdown placeholder */
  filterPlaceholder?: string
  /** Toggle visibility of search input */
  showSearch?: boolean
  /** Toggle visibility of filter dropdown */
  showFilter?: boolean
  /** Toggle visibility of import button */
  showImport?: boolean
  /** Toggle visibility of export button */
  showExport?: boolean
  /** Toggle visibility of show-per-page dropdown */
  showPerPage?: boolean
  /** Toggle visibility of add button */
  showAdd?: boolean
  /** Label for add button */
  addLabel?: string
  /** Label for import button */
  importLabel?: string
  /** Label for export button */
  exportLabel?: string
  /** Current value for per-page dropdown */
  perPageValue?: number
  /** Options for per-page dropdown */
  perPageOptions?: SelectOption[]
}>(), {
  searchValue: '',
  searchPlaceholder: 'Cari...',
  filterValue: null,
  filterOptions: () => [],
  filterPlaceholder: 'Filter',
  showSearch: true,
  showFilter: true,
  showImport: true,
  showExport: true,
  showPerPage: false,
  showAdd: false,
  addLabel: 'Tambah',
  importLabel: 'Import CSV',
  exportLabel: 'Export CSV',
  perPageValue: 10,
  perPageOptions: () => [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
  ],
})

const emit = defineEmits<{
  (e: 'update:searchValue', value: string): void
  (e: 'update:filterValue', value: string | number | null): void
  (e: 'update:perPageValue', value: number): void
  (e: 'import'): void
  (e: 'export'): void
  (e: 'add'): void
}>()

const searchId = computed(() => `toolbar-search-${++toolbarIdCounter}`)

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:searchValue', target.value)
}

function onClearSearch() {
  emit('update:searchValue', '')
}

function onFilterChange(val: string | number | null) {
  emit('update:filterValue', val)
}

function onPerPageChange(val: string | number | null) {
  if (typeof val === 'number') {
    emit('update:perPageValue', val)
  }
}
</script>

<style scoped lang="scss">
// ════════════════════════════════════════════════════════════════
// COMPONENT: BaseTableToolbar
// Reusable horizontal toolbar with left (inputs) + right (actions)
// ════════════════════════════════════════════════════════════════

.base-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
  padding: $space-3 $space-4;
  flex-wrap: wrap;

  // ── Left group: search ──
  &__left {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
  }

  &__per-page {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;

    .per-page-label {
      font-size: $text-sm;
      color: $color-text-secondary;
    }

    .per-page-select {
      width: 72px;
      :deep(.app-select-trigger) {
        height: 2.5rem;
      }
    }
  }

  &__btn-add {
    margin-left: $space-4; // Memberikan jarak ekstra antara 'Show' dan tombol 'Tambah'
  }

  // ── Right group: action buttons ──
  &__right {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-shrink: 0;
  }

  // ── Search input with icon ──
  &__search {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 280px;
    width: 100%;
  }

  &__search-icon {
    position: absolute;
    left: $space-3;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.15rem;
    color: $color-text-muted;
    pointer-events: none;
    z-index: 1;
  }

  &__search-input {
    width: 100%;
    height: 2.5rem; // h-10 equivalent — consistent with buttons
    padding: $space-2 $space-8 $space-2 2.25rem;
    font-family: $font-body;
    font-size: $text-sm;
    color: $color-text-primary;
    background-color: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    transition: all $transition-base;

    &::placeholder {
      color: $color-text-muted;
    }

    &:hover {
      border-color: $color-primary;
    }

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  &__search-clear {
    position: absolute;
    right: $space-2;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: none;
    border-radius: $radius-sm;
    background: transparent;
    color: $color-text-muted;
    cursor: pointer;
    transition: all $transition-fast;

    .material-symbols-outlined {
      font-size: 1rem;
    }

    &:hover {
      background: $color-bg-subtle;
      color: $color-text-primary;
    }
  }

  // ── Filter dropdown ──
  &__filter {
    width: 200px;
    flex-shrink: 0;

    // Match height with search input
    :deep(.app-select-trigger) {
      height: 2.5rem;
    }
  }
}

// ── Consistent button height ──
.base-toolbar .btn-with-icon {
  height: 2.5rem;
  padding-top: 0;
  padding-bottom: 0;
  display: inline-flex;
  align-items: center;
}

// ════════════════════════════════════════
// RESPONSIVE: Tablet (≤ 1024px)
// ════════════════════════════════════════
@include tablet {
  .base-toolbar {
    flex-direction: column;
    align-items: stretch;

    &__search {
      max-width: none;
    }

    &__filter {
      width: 100%;
    }

    &__right {
      justify-content: flex-end;
    }
  }
}

// ════════════════════════════════════════
// RESPONSIVE: Mobile (≤ 640px)
// ════════════════════════════════════════
@include mobile {
  .base-toolbar__right {
    flex-direction: column;

    .btn-with-icon {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
