<template>
  <BaseTableToolbar
    :show-search="false"
    :show-filter="false"
    :show-per-page="false"
    :show-import="false"
    :show-export="false"
    :show-add="true"
    add-label="Simpan Semua Perubahan"
    @add="onSave"
  >
    <!-- CUSTOM WEEK SELECTOR -->
    <template #right-prepend>
      <div class="toolbar__group">
        <div 
          class="custom-week-selector" 
          :class="{ 'is-open': isOpen }"
          tabindex="0"
          @blur="closeSelector"
        >
          <div class="selector-trigger" @click="toggleSelector">
            <span v-if="menuStore.isFetching" class="material-symbols-outlined icon-calendar is-spinning">sync</span>
            <span v-else class="material-symbols-outlined icon-calendar">event_note</span>
            <span class="value">{{ currentLabel }}</span>
            <span class="material-symbols-outlined icon-chevron">expand_more</span>
          </div>

          <Transition name="fade-slide">
            <div v-if="isOpen" class="selector-menu">
              <div class="menu-header">Pilih Minggu Perencanaan</div>
              <div class="menu-list">
                <div 
                  v-for="opt in weekOptions" 
                  :key="opt.value"
                  class="menu-item"
                  :class="{ 'is-active': menuStore.selectedWeek === opt.value }"
                  @click.stop="selectWeek(opt.value)"
                >
                  <div class="item-content">
                    <span class="material-symbols-outlined icon-date">event_note</span>
                    <span class="item-label">{{ opt.label }}</span>
                  </div>
                  <span v-if="menuStore.selectedWeek === opt.value" class="material-symbols-outlined icon-check">check_circle</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <!-- CUSTOM COPY BUTTON -->
    <template #actions>
      <button 
        class="btn-secondary btn-with-icon" 
        @click="onCopy" 
        :disabled="menuStore.isSaving || isCopying"
      >
        <span v-if="isCopying" class="material-symbols-outlined is-spinning">sync</span>
        <span v-else class="material-symbols-outlined">content_copy</span>
        {{ isCopying ? 'Menyalin...' : 'Salin Minggu Lalu' }}
      </button>
    </template>
  </BaseTableToolbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'

const emit = defineEmits<{
  (e: 'copy'): void
  (e: 'save'): void
}>()

const menuStore = useMenuPlanningStore()
const isOpen = ref(false)
const isCopying = ref(false)

const weekOptions = [
  { value: 'w2-apr-2026', label: 'Minggu 2, April 2026' },
  { value: 'w3-apr-2026', label: 'Minggu 3, April 2026' },
  { value: 'w4-apr-2026', label: 'Minggu 4, April 2026' },
]

const currentLabel = computed(() => {
  return weekOptions.find(opt => opt.value === menuStore.selectedWeek)?.label || 'Pilih Minggu'
})

const toggleSelector = () => {
  isOpen.value = !isOpen.value
}

const closeSelector = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

const selectWeek = (val: string) => {
  menuStore.setSelectedWeek(val)
  isOpen.value = false
}

async function onCopy() {
  if (isCopying.value) return
  isCopying.value = true
  try {
    emit('copy')
    // Simulating copy delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 800))
  } finally {
    isCopying.value = false
  }
}

function onSave() {
  emit('save')
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.toolbar__group {
  display: flex;
  align-items: center;
  gap: $space-3;
}

/* ── Custom Week Selector (Dropdown) ── */
.custom-week-selector {
  position: relative;
  width: 260px;
  max-width: 100%;
  font-family: $font-body;
  outline: none; /* remove focus outline for div */

  .selector-trigger {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: 0 $space-4;
    height: 2.5rem; /* h-10 */
    background: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-fast;
    user-select: none;

    &:hover {
      border-color: $color-primary;
    }

    .icon-calendar {
      color: $color-primary;
      font-size: 1.15rem;
    }

    .value {
      flex: 1;
      font-size: $text-sm;
      font-weight: 500;
      color: $color-text-primary;
    }

    .icon-chevron {
      color: $color-text-muted;
      font-size: 1.25rem;
      transition: transform $transition-fast;
    }
  }

  &.is-open .selector-trigger {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-subtle;

    .icon-chevron {
      transform: rotate(180deg);
    }
  }

  .selector-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    box-shadow: $shadow-lg;
    z-index: 100;
    overflow: hidden;

    .menu-header {
      padding: $space-3 $space-4;
      font-size: 0.75rem;
      font-weight: 700;
      color: $color-text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    .menu-list {
      max-height: 250px;
      overflow-y: auto;
      scrollbar-width: thin;
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $space-3 $space-4;
      cursor: pointer;
      transition: background $transition-fast;

      &:hover {
        background: $color-bg-subtle;
      }

      &.is-active {
        background: $color-primary-subtle;
        
        .item-label {
          color: $color-primary;
          font-weight: 600;
        }

        .icon-date {
          color: $color-primary;
        }
      }

      .item-content {
        display: flex;
        align-items: center;
        gap: $space-2;
      }

      .icon-date {
        font-size: 1.15rem;
        color: $color-text-muted;
      }

      .item-label {
        font-size: $text-sm;
        color: $color-text-primary;
      }

      .icon-check {
        font-size: 1.15rem;
        color: $color-primary;
      }
    }
  }
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.is-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
