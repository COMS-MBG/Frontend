<template>
  <div class="master-employee">

    <!-- 1. HEADER -->
    <PageHeader
      title="Data Karyawan"
      subtitle="Kelola data pegawai, jabatan, dan akses sistem."
      :breadcrumb="['Data Karyawan', 'Manajemen Karyawan']"
    />

    <!-- 2. SUMMARY STAT CARDS -->
    <div class="summary-row">
      <StatCard label="TOTAL KARYAWAN" icon="group" :value="String(pagination.total)" variant="horizontal" icon-variant="blue" />
      <StatCard label="KARYAWAN AKTIF" icon="check_circle" :value="String(activeCount)" variant="horizontal" icon-variant="green" />
      <StatCard label="TOTAL ROLE" icon="admin_panel_settings" :value="String(roleCount)" variant="horizontal" icon-variant="purple" />
    </div>

    <!-- 3. TOOLBAR -->
    <EmployeeToolbar
      :search-value="filters.search"
      :role-value="filters.role_id"
      :can-create="canCreate"
      @update:search-value="onSearchChange"
      @update:role-value="onRoleChange"
      @add="openCreateModal"
    />

    <!-- 4. DATA TABLE -->
    <EmployeeTable
      :items="employees"
      :is-loading="isLoading"
      :can-edit="canUpdate"
      :can-delete="canDelete"
      @edit="openEditModal"
      @delete="onDeleteRequest"
      @assign-role="openAssignRoleModal"
      @view-detail="openDetailModal"
      @add="openCreateModal"
    />

    <!-- 5. PAGINATION -->
    <BasePagination
      v-if="pagination.total > pagination.perPage"
      :model-value="pagination.currentPage"
      :total="pagination.total"
      :per-page="pagination.perPage"
      item-label="karyawan"
      @update:model-value="onPageChange"
    />

    <!-- 6. FORM MODAL -->
    <EmployeeFormModal
      :is-open="isFormOpen"
      :initial-data="editTarget"
      :is-submitting="isSubmitting"
      @update:is-open="isFormOpen = $event"
      @submit="onFormSubmit"
    />

    <!-- 7. ASSIGN ROLE MODAL -->
    <AssignRoleModal
      v-model="isAssignRoleOpen"
      :employee="assignRoleTarget"
      :role-options="assignRoleOptions"
      :is-submitting="isSubmitting"
      @submit="onAssignRoleSubmit"
      @cancel="closeAssignRoleModal"
    />

    <!-- 8. DELETE CONFIRMATION (Danger-styled) -->
    <ConfirmDeleteModal
      v-model="isDeleteOpen"
      title="Hapus Karyawan"
      :item-name="deleteTarget?.name ?? ''"
      confirm-label="Hapus"
      :is-submitting="isSubmitting"
      @confirm="onDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <!-- 9. RESULT MODAL (Success/Error Feedback) -->
    <ResultModal
      v-model="isResultOpen"
      :headline="resultHeadline"
      :message="resultMessage"
      :variant="resultVariant"
    />

    <!-- 10. DETAIL MODAL -->
    <EmployeeDetailModal
      :is-open="isDetailOpen"
      :employee="detailTarget"
      :can-edit="canUpdate"
      @update:is-open="isDetailOpen = $event"
      @close="closeDetailModal"
      @edit="onEditFromDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import EmployeeToolbar from '@/components/hr/management/EmployeeToolbar.vue'
import EmployeeTable from '@/components/hr/management/EmployeeTable.vue'
import EmployeeFormModal from '@/components/hr/management/EmployeeFormModal.vue'
import EmployeeDetailModal from '@/components/hr/management/EmployeeDetailModal.vue'
import AssignRoleModal from '@/components/hr/management/AssignRoleModal.vue'
import { useEmployee } from '@/composables/useEmployee'
import { useToast } from '@/composables/useToast'
import type { Employee, EmployeeCreateForm, EmployeeUpdateForm, AssignRolePayload } from '@/types/employee'

const {
  employees, selectedEmployee, pagination, isLoading, isSubmitting, error, filters,
  assignRoleOptions, activeCount, roleCount,
  canCreate, canUpdate, canDelete,
  fetchEmployees, fetchEmployee, createEmployee, updateEmployee, deleteEmployee,
  fetchAssignRoleOptions, assignRole, setFilter, resetState,
} = useEmployee()

const toast = useToast()

// ── Toolbar ──────────────────────────────────────────────────
function onSearchChange(val: string) { setFilter('search', val) }
function onRoleChange(val: string) { setFilter('role_id', val) }
function onPageChange(page: number) { setFilter('page', page) }

// ── Result Modal ─────────────────────────────────────────────
const isResultOpen = ref(false)
const resultHeadline = ref('')
const resultMessage = ref('')
const resultVariant = ref<'success' | 'error'>('success')

function showResult(headline: string, message: string, variant: 'success' | 'error' = 'success') {
  resultHeadline.value = headline
  resultMessage.value = message
  resultVariant.value = variant
  isResultOpen.value = true
}

// ── Form Modal ───────────────────────────────────────────────
const isFormOpen = ref(false)
const editTarget = ref<Employee | null>(null)

function openCreateModal() { editTarget.value = null; isFormOpen.value = true }
function openEditModal(emp: Employee) { editTarget.value = emp; isFormOpen.value = true }

async function onFormSubmit(data: EmployeeCreateForm) {
  let success = false
  if (editTarget.value) {
    const payload: EmployeeUpdateForm = { ...data }
    success = await updateEmployee(editTarget.value.id, payload)
    if (success) {
      isFormOpen.value = false
      showResult('Karyawan Berhasil Diperbarui', `Data karyawan "${data.name}" telah diperbarui.`)
    }
  } else {
    success = await createEmployee(data)
    if (success) {
      isFormOpen.value = false
      showResult('Karyawan Berhasil Ditambahkan', `Karyawan "${data.name}" telah ditambahkan ke sistem.`)
    }
  }
  if (!success && error.value) toast.error(error.value)
}

// ── Delete Modal ─────────────────────────────────────────────
const isDeleteOpen = ref(false)
const deleteTarget = ref<Employee | null>(null)

function onDeleteRequest(item: Employee) { deleteTarget.value = item; isDeleteOpen.value = true }
function closeDeleteModal() { isDeleteOpen.value = false; deleteTarget.value = null }

async function onDeleteConfirm() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  const success = await deleteEmployee(deleteTarget.value.id)
  if (success) {
    closeDeleteModal()
    showResult('Karyawan Berhasil Dihapus', `Karyawan "${name}" telah dihapus dari sistem.`)
  } else if (error.value) {
    toast.error(error.value)
  }
}

// ── Assign Role Modal ────────────────────────────────────────
const isAssignRoleOpen = ref(false)
const assignRoleTarget = ref<Employee | null>(null)

async function openAssignRoleModal(emp: Employee) {
  assignRoleTarget.value = emp
  await fetchAssignRoleOptions(emp.id)
  isAssignRoleOpen.value = true
}
function closeAssignRoleModal() { isAssignRoleOpen.value = false; assignRoleTarget.value = null }
async function onAssignRoleSubmit(payload: AssignRolePayload) {
  if (!assignRoleTarget.value) return
  const success = await assignRole(assignRoleTarget.value.id, payload)
  if (success) {
    closeAssignRoleModal()
    showResult('Role Berhasil Diassign', `Role telah diassign ke "${assignRoleTarget.value.name}".`)
  } else if (error.value) {
    toast.error(error.value)
  }
}

// ── Detail Modal ─────────────────────────────────────────────
const isDetailOpen = ref(false)
const detailTarget = ref<Employee | null>(null)

async function openDetailModal(emp: Employee) {
  detailTarget.value = null
  isDetailOpen.value = true
  await fetchEmployee(emp.id)
  detailTarget.value = selectedEmployee.value
}

function closeDetailModal() {
  isDetailOpen.value = false
  detailTarget.value = null
}

function onEditFromDetail(emp: Employee) {
  isDetailOpen.value = false
  openEditModal(emp)
}

// ── Error watcher ────────────────────────────────────────────
watch(error, (err) => {
  if (err && err.includes('403')) toast.error('Tidak memiliki izin')
})

onMounted(() => fetchEmployees())
onUnmounted(() => resetState())
</script>

<style scoped lang="scss">
.master-employee {
  display: flex; flex-direction: column; gap: $space-6; font-family: $font-body;
}
.summary-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: $space-4;
}
@include tablet { .summary-row { grid-template-columns: repeat(2, 1fr); } }
@include mobile { .summary-row { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); } }
</style>
