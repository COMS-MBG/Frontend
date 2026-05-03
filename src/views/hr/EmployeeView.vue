<template>
  <div class="master-employee">

    <!-- ═══════════════════════════════════════
         1. HEADER + ACTION BUTTONS
    ════════════════════════════════════════ -->
    <PageHeader
      title="Data Karyawan"
      subtitle="Kelola data pegawai, jabatan, dan akses sistem."
      :breadcrumb="['Data Karyawan', 'Manajemen Karyawan']"
    >
      <template #actions>
        <button
          v-if="employeeStore.canAdd"
          class="btn-primary btn-with-icon"
          @click="onTambah"
          aria-label="Tambah Karyawan"
          title="Tambah Karyawan Baru"
        >
          <span class="material-symbols-outlined">add</span>
          Tambah Karyawan
        </button>
      </template>
    </PageHeader>

    <!-- ═══════════════════════════════════════
         2. SUMMARY STAT CARDS
    ════════════════════════════════════════ -->
    <div class="summary-row">
      <StatCard
        label="TOTAL KARYAWAN"
        icon="group"
        :value="String(employeeStore.totalItems)"
        variant="horizontal"
        icon-variant="blue"
      />
      <StatCard
        label="KARYAWAN AKTIF"
        icon="check_circle"
        :value="String(employeeStore.activeCount)"
        variant="horizontal"
        icon-variant="green"
      />
      <StatCard
        label="ADMIN SISTEM"
        icon="admin_panel_settings"
        :value="String(employeeStore.adminCount)"
        variant="horizontal"
        icon-variant="purple"
      />
    </div>

    <!-- ═══════════════════════════════════════
         3. TOOLBAR (Search + Filter)
    ════════════════════════════════════════ -->
    <EmployeeToolbar
      :search="search"
      :filter="filter"
      @update:search="onSearchUpdate"
      @update:filter="filter = $event"
    />

    <!-- ═══════════════════════════════════════
         4. LOADING STATE
    ════════════════════════════════════════ -->
    <BaseTableSkeleton
      v-if="employeeStore.isLoading"
      :rows="6"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <!-- ═══════════════════════════════════════
         5. EMPTY STATE
    ════════════════════════════════════════ -->
    <BaseEmptyState
      v-else-if="filteredItems.length === 0"
      icon="group_off"
      title="Belum ada data karyawan"
      description="Mulai tambahkan karyawan untuk mengelola data personalia Anda."
      action-label="Tambah Karyawan"
      @action="onTambah"
    />

    <!-- ═══════════════════════════════════════
         6. DATA TABLE + PAGINATION
    ════════════════════════════════════════ -->
    <EmployeeTable
      v-else
      :items="paginatedItems"
      :can-edit="employeeStore.canEdit"
      :can-delete="employeeStore.canDelete"
      @edit="onEdit"
      @delete="onDelete"
      @toggle-status="onToggleStatus"
    >
      <template #pagination>
        <BasePagination
          v-if="filteredItems.length > perPage"
          v-model="page"
          :total="filteredItems.length"
          :per-page="perPage"
          item-label="karyawan"
        />
      </template>
    </EmployeeTable>

    <!-- ═══════════════════════════════════════
         7. FORM MODAL
    ════════════════════════════════════════ -->
    <EmployeeFormModal
      :is-open="isModalOpen"
      :initial-data="editTarget"
      @update:is-open="isModalOpen = $event"
      @submit="onSubmit"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import EmployeeToolbar from '@/components/hr/EmployeeToolbar.vue'
import EmployeeTable from '@/components/hr/EmployeeTable.vue'
import EmployeeFormModal from '@/components/hr/EmployeeFormModal.vue'
import { useEmployeeStore } from '@/stores/employee.store'
import { employeeDummy } from '@/data/employee.dummy'
import { usePagination } from '@/composables/usePagination'
import type { Employee } from '@/types/employee'

// ── Store ────────────────────────────────────────────────────
const employeeStore = useEmployeeStore()

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA KARYAWAN', align: 'left' },
  { label: 'NRP / NIDN', align: 'left' },
  { label: 'JABATAN', align: 'left' },
  { label: 'DEPARTEMEN', align: 'left' },
  { label: 'ROLE', align: 'center' },
  { label: 'STATUS', align: 'center' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '80px' },
  { type: 'text', width: '100px' },
  { type: 'text', width: '100px' },
  { type: 'badge' },
  { type: 'text', width: '40px' },
  { type: 'actions' },
]

// ── Seed store on mount ──────────────────────────────────────
// TODO: swap to `employeeStore.fetchItems()` when API is ready.
onMounted(() => {
  if (employeeStore.items.length === 0) {
    employeeStore.setItems(employeeDummy)
  }
})

// ── UI State (view-local only) ───────────────────────────────
const search      = ref('')
const filter      = ref('all')
const isModalOpen = ref(false)
const editTarget  = ref<Employee | null>(null)

// ── Derived: Filter + Search ─────────────────────────────────
const filteredItems = computed(() => {
  let result = employeeStore.items

  if (filter.value !== 'all') {
    result = result.filter(e => e.role === filter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(e =>
      e.nama.toLowerCase().includes(q) ||
      e.nrp.toLowerCase().includes(q) ||
      e.departemen.toLowerCase().includes(q)
    )
  }

  return result
})

// Reset page when filter/search changes
watch([search, filter], () => {
  page.value = 1
})

// ── Pagination (extracted composable) ────────────────────────
const { page, perPage, paginatedItems } = usePagination(filteredItems, 5)

// ── Handlers ────────────────────────────────────────────────
function onSearchUpdate(val: string | number | null): void {
  search.value = String(val ?? '')
}

function onTambah(): void {
  editTarget.value = null
  isModalOpen.value = true
}

function onEdit(item: Employee): void {
  editTarget.value = item
  isModalOpen.value = true
}

function onDelete(item: Employee): void {
  employeeStore.deleteItem(item.id)
}

function onToggleStatus(item: Employee): void {
  employeeStore.toggleStatus(item.id)
}

function onSubmit(data: Partial<Employee>): void {
  if (data.id) {
    // Edit existing
    const existing = employeeStore.getById(data.id)
    if (existing) {
      employeeStore.updateItem({ ...existing, ...data } as Employee)
    }
  } else {
    // Add new — generate a temporary id
    const maxId = Math.max(0, ...employeeStore.items.map(i => i.id))
    employeeStore.addItem({
      ...data,
      id: maxId + 1,
      isActive: true,
    } as Employee)
  }
}
</script>

<style scoped lang="scss">
.master-employee {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  font-family: $font-body;
}

// ── Summary row ──
.summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;
}

// ── Responsive ──
@include tablet {
  .summary-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include mobile {
  .summary-row {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
</style>
