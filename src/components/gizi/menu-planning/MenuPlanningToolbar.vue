<template>
  <BaseTableToolbar
    :show-search="false"
    :show-filter="false"
    :show-per-page="false"
    :show-import="false"
    :show-export="false"
    :show-add="canUpdate"
    add-label="Simpan Semua Perubahan"
    :add-loading="isSaving"
    :add-disabled="!isDirty"
    :add-pulsing="isDirty"
    @add="onSave"
  >
    <!-- LEFT SIDE: Selector + Status Badge -->
    <template #left-prepend>
      <div class="toolbar__group">
        <!-- Menu Selector Dropdown -->
        <div
          class="custom-week-selector"
          :class="{ 'is-open': isOpen }"
          tabindex="0"
          @blur="closeSelector"
        >
          <div class="selector-trigger" @click="toggleSelector">
            <span v-if="isFetching" class="material-symbols-outlined icon-calendar is-spinning">sync</span>
            <span v-else class="material-symbols-outlined icon-calendar">event_note</span>
            <span class="value">{{ currentLabel }}</span>
            <span class="material-symbols-outlined icon-chevron">expand_more</span>
          </div>

          <Transition name="fade-slide">
            <div v-if="isOpen" class="selector-menu">
              <div class="menu-header">Pilih Perencanaan Menu</div>
              <div class="menu-list">
                <div
                  v-for="menu in menus"
                  :key="menu.id"
                  class="menu-item"
                  :class="{ 'is-active': currentMenu?.id === menu.id }"
                  @click.stop="selectMenu(menu)"
                >
                  <div class="item-content">
                    <span class="material-symbols-outlined icon-date">event_note</span>
                    <div class="item-info">
                      <span class="item-label">{{ menu.week_range_label }}</span>
                      <div class="item-sublabel-row">
                        <span v-if="!menu.name.startsWith('Menu Minggu ')" class="item-name-tag">{{ menu.name }} •</span>
                        <span class="status-dot" :class="`status-dot--${menu.status}`"></span>
                        <span class="status-text">{{ menu.status_label }}</span>
                      </div>
                    </div>
                  </div>
                  <span v-if="currentMenu?.id === menu.id" class="material-symbols-outlined icon-check">check_circle</span>
                </div>

                <!-- Empty state -->
                <div v-if="menus.length === 0" class="menu-empty">
                  Belum ada perencanaan menu.
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Weekly Status Badge -->
        <MenuStatusBadge v-if="currentStatus" :status="currentStatus" />
      </div>
    </template>

    <!-- RIGHT SIDE: Custom Action Buttons -->
    <template #actions>
      <!-- Delete Button (Only visible if a menu is loaded and user has menus.delete permission) -->
      <button 
        v-if="currentMenu && canDelete"
        class="btn-outline-danger btn-with-icon"
        type="button"
        :disabled="isSaving"
        @click="$emit('delete')"
      >
        <span class="material-symbols-outlined">delete</span>
        Hapus Menu
      </button>

      <div class="toolbar__datepicker" v-if="canCreate">
        <VueDatePicker 
          :enable-time-picker="false"
          position="right"
          hide-input-icon
          hide-offset-dates
          :month-change-on-scroll="false"
          auto-apply
          :highlight="isDateFilled"
          :disabled-dates="isDateFilled"
          :locale="idLocale"
          @update:model-value="onNewWeekSelected"
        >
          <template #trigger>
            <button class="btn-secondary btn-with-icon">
              <span class="material-symbols-outlined">add</span>
              Buat Menu Baru
            </button>
          </template>
        </VueDatePicker>
      </div>
    </template>
  </BaseTableToolbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseTableToolbar from '@/components/common/BaseTableToolbar.vue'
import MenuStatusBadge from './MenuStatusBadge.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import type { Menu, StatusPublikasi } from '@/types/menu-planning'
import { id } from 'date-fns/locale'

const idLocale = id

const props = defineProps<{
  menus: Menu[]
  currentMenu: Menu | null
  isSaving: boolean
  isFetching: boolean
  isDirty: boolean
  currentStatus: StatusPublikasi | null
  currentStatusLabel: string
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
}>()

const emit = defineEmits<{
  (e: 'select-menu', menu: Menu): void
  (e: 'save'): void
  (e: 'new-week', weekStart: string): void
  (e: 'delete'): void
}>()

const isOpen = ref(false)

const currentLabel = computed(() => {
  if (props.currentMenu) {
    return props.currentMenu.week_range_label || props.currentMenu.name
  }
  return 'Pilih Perencanaan Menu'
})

const toggleSelector = () => {
  isOpen.value = !isOpen.value
}

const closeSelector = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

const selectMenu = (menu: Menu) => {
  if (props.isDirty) {
    const confirmLeave = confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin membuang perubahan dan berpindah ke perencanaan menu lain?')
    if (!confirmLeave) return
  }
  emit('select-menu', menu)
  isOpen.value = false
}

function onSave() {
  emit('save')
}

function onNewWeekSelected(date: Date | null) {
  if (!date) return
  if (props.isDirty) {
    const confirmLeave = confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin membuang perubahan dan membuat perencanaan menu baru?')
    if (!confirmLeave) return
  }
  // Calculate Monday of the selected date's week
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday (0)
  const monday = new Date(date)
  monday.setDate(diff)
  const weekStart = monday.toISOString().slice(0, 10)
  emit('new-week', weekStart)
}



function isDateFilled(date: unknown): boolean {
  if (!(date instanceof Date)) return false
  if (!props.menus || props.menus.length === 0) return false
  
  // Format target date to YYYY-MM-DD local time
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const targetStr = `${yyyy}-${mm}-${dd}`
  
  // Check if it falls inside any menu's range
  return props.menus.some(menu => {
    return targetStr >= menu.week_start && targetStr <= menu.week_end
  })
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
  width: 300px;
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      max-height: 300px;
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
        min-width: 0;
        flex: 1;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .icon-date {
        font-size: 1.15rem;
        color: $color-text-muted;
        flex-shrink: 0;
      }

      .item-label {
        font-size: $text-sm;
        color: $color-text-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-sublabel-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        color: $color-text-muted;
        margin-top: 2px;
      }

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;

        &--published { background-color: $color-success; }
        &--scheduled { background-color: $color-warning; }
        &--planned { background-color: $color-primary; }
        &--archived { background-color: $color-text-muted; }
      }

      .status-text {
        font-weight: 500;
      }
      
      .item-name-tag {
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 120px;
      }

      .icon-check {
        font-size: 1.15rem;
        color: $color-primary;
        flex-shrink: 0;
      }
    }

    .menu-empty {
      padding: $space-6;
      text-align: center;
      color: $color-text-muted;
      font-size: $text-sm;
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

.toolbar__datepicker {
  display: inline-block;
}
</style>
