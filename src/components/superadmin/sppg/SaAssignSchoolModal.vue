<template>
  <BaseModal v-model="open" title="Hubungkan Sekolah Mitra" size="lg">
    <div class="assign-school-modal">
      <!-- Search Input -->
      <div class="search-wrap">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Cari sekolah berdasarkan nama, NPSN, atau kota..."
          :disabled="isSubmitting"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="clear-btn"
          @click="searchQuery = ''"
          :disabled="isSubmitting"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Schools Container -->
      <div class="schools-container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <span class="material-symbols-outlined spin-icon">sync</span>
          <p>Memuat daftar sekolah...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredSchools.length === 0" class="empty-state">
          <span class="material-symbols-outlined empty-icon">school</span>
          <h4>Sekolah Tidak Ditemukan</h4>
          <p v-if="searchQuery">Tidak ada sekolah unserved yang cocok dengan kata kunci "{{ searchQuery }}".</p>
          <p v-else>Semua sekolah dalam sistem saat ini sudah terhubung ke SPPG.</p>
        </div>

        <!-- Table List -->
        <div v-else class="table-wrap">
          <table class="school-table">
            <thead>
              <tr>
                <th>NAMA SEKOLAH</th>
                <th class="text-center">NPSN</th>
                <th class="text-center">KOTA</th>
                <th class="text-center">PORSI HARIAN</th>
                <th class="text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="school in filteredSchools" :key="school.id">
                <td class="td-name">
                  <div class="school-info">
                    <span class="school-name">{{ school.school_name }}</span>
                    <span class="school-address text-muted">{{ school.address }}</span>
                  </div>
                </td>
                <td class="text-center font-mono">{{ school.npsn || '—' }}</td>
                <td class="text-center">{{ school.city || '—' }}</td>
                <td class="text-center font-semibold text-primary">
                  {{ school.portion_count.toLocaleString('id-ID') }}
                </td>
                <td class="text-center">
                  <button
                    type="button"
                    class="btn-assign btn-with-icon"
                    :disabled="isSubmitting"
                    @click="handleAssign(school.id)"
                  >
                    <span v-if="isSubmitting && clickedSchoolId === school.id" class="material-symbols-outlined spinner">progress_activity</span>
                    <span v-else class="material-symbols-outlined" style="font-size: 1rem;">add_link</span>
                    <span>Hubungkan</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="open = false" :disabled="isSubmitting">
        Tutup
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { SchoolItem } from '@/types/superadmin-school'

const props = defineProps<{
  modelValue: boolean
  schools: SchoolItem[]
  isLoading: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'assign', schoolId: string): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const searchQuery = ref('')
const clickedSchoolId = ref<string | null>(null)

// Reset search and clicked school state when modal opens/closes
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    clickedSchoolId.value = null
  }
})

// Local filtering for instant UX
const filteredSchools = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.schools

  return props.schools.filter((s) => {
    return (
      s.school_name.toLowerCase().includes(query) ||
      (s.npsn && s.npsn.toLowerCase().includes(query)) ||
      s.city.toLowerCase().includes(query)
    )
  })
})

function handleAssign(schoolId: string) {
  clickedSchoolId.value = schoolId
  emit('assign', schoolId)
}
</script>

<style scoped lang="scss">
.assign-school-modal {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  padding: $space-2 0;
}

// Search box
.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  .search-icon {
    position: absolute;
    left: $space-4;
    font-size: 1.25rem;
    color: $color-text-muted;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: $space-3 $space-10 $space-3 $space-10;
    font-family: $font-body;
    font-size: $text-sm;
    color: $color-text-primary;
    background-color: $color-bg-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    transition: all $transition-base;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px $color-primary-muted;
      background-color: $color-bg-surface;
    }

    &:disabled {
      background-color: $color-bg-subtle;
      color: $color-text-muted;
      cursor: not-allowed;
    }
  }

  .clear-btn {
    position: absolute;
    right: $space-3;
    background: transparent;
    border: none;
    padding: $space-1;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-muted;

    &:hover {
      background-color: $color-bg-subtle;
      color: $color-text-primary;
    }

    span {
      font-size: 1.1rem;
    }
  }
}

// Schools Container
.schools-container {
  min-height: 200px;
  max-height: 380px;
  overflow-y: auto;
  scrollbar-width: thin;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  background-color: $color-bg-surface;
}

// Table Wrap
.table-wrap {
  width: 100%;
}

.school-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-body;

  thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: $color-bg-subtle;

    tr {
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-3 $space-4;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      text-align: left;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid $color-border-light;
      transition: background-color $transition-fast;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: $color-bg-subtle;
      }
    }

    td {
      padding: $space-3 $space-4;
      vertical-align: middle;
      font-size: $text-sm;
      color: $color-text-secondary;
    }
  }

  .td-name {
    min-width: 240px;
  }

  .school-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .school-name {
    font-weight: 600;
    color: $color-text-primary;
  }

  .school-address {
    font-size: $text-xs;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-center {
    text-align: center;
  }

  .text-primary {
    color: $color-primary;
  }

  .text-muted {
    color: $color-text-muted;
  }

  .font-mono {
    font-family: $font-mono;
    font-size: $text-xs;
  }

  .font-semibold {
    font-weight: 600;
  }
}

// Button Assign
.btn-assign {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-1.5;
  background-color: $color-primary-light;
  border: 1px solid $color-primary-muted;
  padding: $space-1.5 $space-3;
  border-radius: $radius-md;
  color: $color-primary;
  font-size: $text-xs;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-base;

  &:hover:not(:disabled) {
    background-color: $color-primary;
    border-color: $color-primary;
    color: $color-text-inverse;
    box-shadow: 0 2px 6px rgba(67, 97, 238, 0.12);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
    font-size: 1rem;
  }
}

// States
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10 $space-4;
  text-align: center;
  color: $color-text-muted;
}

.loading-state {
  gap: $space-3;
  
  .spin-icon {
    font-size: 2rem;
    animation: spin 1.5s linear infinite;
    color: $color-primary;
  }
}

.empty-state {
  gap: $space-2;

  .empty-icon {
    font-size: 2.5rem;
    color: $color-text-faint;
    margin-bottom: $space-2;
  }

  h4 {
    margin: 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-primary;
  }

  p {
    margin: 0;
    font-size: $text-xs;
    max-width: 280px;
    line-height: 1.4;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
