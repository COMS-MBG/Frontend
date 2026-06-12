<template>
  <div class="master-role">

    <!-- ═══════════════════════════════════════
         1. HEADER
    ════════════════════════════════════════ -->
    <PageHeader
      title="Manajemen Role"
      subtitle="Kelola tingkatan akses pengguna pada sistem."
      :breadcrumb="['Data Karyawan', 'Manajemen Role']"
    />

    <!-- ═══════════════════════════════════════
         2. SUMMARY STAT CARDS
    ════════════════════════════════════════ -->
    <div class="summary-row">
      <StatCard label="TOTAL ROLE" icon="shield_person" :value="String(filteredItems.length)" variant="horizontal" icon-variant="blue" />
      <StatCard label="TOTAL HAK AKSES" icon="admin_panel_settings" :value="String(totalPermissionCount)" variant="horizontal" icon-variant="orange" />
      <StatCard label="ROLE TERPAKAI" icon="group" :value="String(usedRolesCount)" variant="horizontal" icon-variant="green" />
    </div>

    <RoleToolbar
      :search-value="searchQuery"
      :can-create="canCreate"
      @update:search-value="setSearchQuery"
      @add="openCreateModal"
    />

    <!-- ═══════════════════════════════════════
         4. LOADING STATE
    ════════════════════════════════════════ -->
    <BaseTableSkeleton
      v-if="isLoading"
      :rows="5"
      :columns="skeletonColumns"
      :headers="skeletonHeaders"
    />

    <!-- ═══════════════════════════════════════
         5. EMPTY STATE
    ════════════════════════════════════════ -->
    <BaseEmptyState
      v-else-if="filteredItems.length === 0"
      icon="shield_person"
      title="Belum ada role"
      description="Mulai tambahkan role untuk mengatur hak akses pengguna."
      action-label="Tambah Role"
      @action="openCreateModal"
    />

    <!-- ═══════════════════════════════════════
         6. DATA TABLE
    ════════════════════════════════════════ -->
    <RoleTable
      v-else
      :roles="filteredItems"
      :can-edit="canUpdate"
      :can-delete="canDelete"
      @edit="openEditModal"
      @delete="onDeleteRequest"
    />

    <!-- ═══════════════════════════════════════
         7. FORM MODAL (Create/Edit)
    ════════════════════════════════════════ -->
    <RoleFormModal
      :is-open="isFormOpen"
      :initial-data="editTarget"
      :is-submitting="isSubmitting"
      @update:is-open="isFormOpen = $event"
      @submit="onFormSubmit"
    />

    <!-- ═══════════════════════════════════════
         8. DELETE CONFIRMATION
    ════════════════════════════════════════ -->
    <ConfirmDeleteModal
      v-model="isDeleteOpen"
      title="Hapus Role"
      :item-name="deleteTarget?.name ?? ''"
      confirm-label="Hapus"
      :is-submitting="isSubmitting"
      @confirm="onDeleteConfirm"
      @cancel="closeDeleteModal"
    />

    <!-- ═══════════════════════════════════════
         9. RESULT MODAL (Success/Error)
    ════════════════════════════════════════ -->
    <ResultModal
      v-model="isResultOpen"
      :headline="resultHeadline"
      :message="resultMessage"
      :variant="resultVariant"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import RoleToolbar from '@/components/hr/role/RoleToolbar.vue'
import BaseTableSkeleton from '@/components/common/BaseTableSkeleton.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import type { SkeletonColumn, SkeletonHeader } from '@/components/common/BaseTableSkeleton.vue'
import RoleTable from '@/components/hr/role/RoleTable.vue'
import RoleFormModal from '@/components/hr/role/RoleFormModal.vue'
import { useRole } from '@/composables/useRole'
import { useToast } from '@/composables/useToast'
import type { Role } from '@/types/access'

// ── Composable ──────────────────────────────────────────────
const {
  filteredItems, isLoading, isSubmitting, error,
  searchQuery, totalPermissionCount, usedRolesCount,
  allPermissions,
  canCreate, canUpdate, canDelete,
  fetchRoles, createRole, updateRole, deleteRole,
  setSearchQuery, resetState,
} = useRole()

const toast = useToast()

// ── Skeleton Config ──────────────────────────────────────────
const skeletonHeaders: SkeletonHeader[] = [
  { label: 'NAMA ROLE', align: 'left' },
  { label: 'DESKRIPSI', align: 'left' },
  { label: 'KARYAWAN', align: 'center' },
  { label: 'HAK AKSES', align: 'left' },
  { label: 'AKSI', align: 'center' },
]

const skeletonColumns: SkeletonColumn[] = [
  { type: 'avatar-text' },
  { type: 'text', width: '120px' },
  { type: 'text', width: '48px', align: 'center' },
  { type: 'text', width: '160px' },
  { type: 'actions' },
]

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
const editTarget = ref<Role | null>(null)

function openCreateModal() { editTarget.value = null; isFormOpen.value = true }
function openEditModal(item: Role) { editTarget.value = item; isFormOpen.value = true }
function closeFormModal() { isFormOpen.value = false; editTarget.value = null }

async function onFormSubmit(data: { name: string; description?: string; permissions: number[] }) {
  let success = false
  if (editTarget.value) {
    success = await updateRole(editTarget.value.id, data)
    if (success) {
      closeFormModal()
      showResult('Role Berhasil Diperbarui', `Role "${data.name}" telah diperbarui.`)
    }
  } else {
    success = await createRole(data)
    if (success) {
      closeFormModal()
      showResult('Role Berhasil Ditambahkan', `Role "${data.name}" telah ditambahkan ke sistem.`)
    }
  }
  if (!success && error.value) toast.error(error.value)
}

// ── Delete Modal ─────────────────────────────────────────────
const isDeleteOpen = ref(false)
const deleteTarget = ref<Role | null>(null)

function onDeleteRequest(item: Role) { deleteTarget.value = item; isDeleteOpen.value = true }
function closeDeleteModal() { isDeleteOpen.value = false; deleteTarget.value = null }

async function onDeleteConfirm() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  const success = await deleteRole(deleteTarget.value.id)
  if (success) {
    closeDeleteModal()
    showResult('Role Berhasil Dihapus', `Role "${name}" telah dihapus dari sistem.`)
  } else if (error.value) {
    closeDeleteModal()
    showResult('Gagal Menghapus Role', error.value, 'error')
  }
}

// ── Lifecycle ────────────────────────────────────────────────
onMounted(() => fetchRoles())
onUnmounted(() => resetState())
</script>

<style scoped lang="scss">
.master-role {
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
