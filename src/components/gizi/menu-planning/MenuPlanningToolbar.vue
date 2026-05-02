<template>
  <div class="menu-planning__toolbar">
    <div 
      class="custom-week-selector" 
      :class="{ 'is-open': isOpen }"
      tabindex="0"
      @blur="closeSelector"
    >
      <div class="selector-trigger" @click="toggleSelector">
        <div class="icon-wrapper">
          <span v-if="menuStore.isFetching" class="material-symbols-outlined icon-calendar is-spinning">sync</span>
          <span v-else class="material-symbols-outlined icon-calendar">calendar_month</span>
        </div>
        <div class="selector-content">
          <span class="label">Periode Menu</span>
          <span class="value">{{ currentLabel }}</span>
        </div>
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'

const menuStore = useMenuPlanningStore()
const isOpen = ref(false)

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
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.menu-planning__toolbar {
  .custom-week-selector {
    position: relative;
    display: inline-block;
    outline: none;
    user-select: none;

    .selector-trigger {
      display: flex;
      align-items: center;
      gap: $space-3;
      padding: $space-2 $space-4;
      background-color: $color-bg-surface;
      border: 1px solid $color-border;
      border-radius: $radius-lg;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 250px;

      &:hover {
        border-color: $color-primary;
        box-shadow: 0 4px 12px rgba($color-primary, 0.05);

        .icon-wrapper {
          background-color: rgba($color-primary, 0.1);
          color: $color-primary;
        }
      }

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: $radius-md;
        background-color: $color-bg-subtle;
        color: $color-text-muted;
        transition: all 0.2s ease;

        .icon-calendar {
          font-size: 1.2rem;
        }

        .is-spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      }

      .selector-content {
        display: flex;
        flex-direction: column;
        flex: 1;

        .label {
          font-size: 0.7rem;
          color: $color-text-muted;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .value {
          font-size: $text-sm;
          color: $color-text-primary;
          font-weight: 600;
        }
      }

      .icon-chevron {
        color: $color-text-muted;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }

    &.is-open {
      .selector-trigger {
        border-color: $color-primary;
        box-shadow: 0 0 0 3px rgba($color-primary, 0.1);

        .icon-wrapper {
          background-color: $color-primary;
          color: white;
        }

        .icon-chevron {
          transform: rotate(180deg);
        }
      }
    }

    .selector-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 100%;
      min-width: 280px;
      background-color: $color-bg-surface;
      border: 1px solid $color-border;
      border-radius: $radius-lg;
      box-shadow: $shadow-lg;
      z-index: 50;
      overflow: hidden;

      .menu-header {
        padding: $space-3 $space-4;
        font-size: 0.75rem;
        font-weight: 600;
        color: $color-text-muted;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid $color-border;
        background-color: $color-bg-subtle;
      }

      .menu-list {
        padding: $space-2;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: $space-3;
          border-radius: $radius-md;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background-color: $color-bg-subtle;
          }

          &.is-active {
            background-color: rgba($color-primary, 0.05);
            color: $color-primary;

            .item-content {
              font-weight: 600;
              
              .icon-date {
                color: $color-primary;
              }
            }
          }

          .item-content {
            display: flex;
            align-items: center;
            gap: $space-3;
            color: $color-text-primary;
            font-size: $text-sm;

            .icon-date {
              font-size: 1.1rem;
              color: $color-text-muted;
            }
          }

          .icon-check {
            font-size: 1.1rem;
            color: $color-primary;
          }
        }
      }
    }

    .fade-slide-enter-active,
    .fade-slide-leave-active {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-slide-enter-from,
    .fade-slide-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
}
</style>
