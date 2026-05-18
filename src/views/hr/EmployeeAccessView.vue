<template>
  <div class="master-access">

    <!-- ═══════════════════════════════════════
         1. HEADER
    ════════════════════════════════════════ -->
    <PageHeader
      title="Hak Akses"
      subtitle="Kelola izin akses berdasarkan role pengguna."
      :breadcrumb="['Data Karyawan', 'Hak Akses']"
    />

    <!-- ═══════════════════════════════════════
         2. SUMMARY STAT CARDS
    ════════════════════════════════════════ -->
    <div class="summary-row">
      <StatCard
        label="TOTAL FITUR"
        icon="category"
        :value="String(accessStore.totalFeatures)"
        variant="horizontal"
        icon-variant="blue"
      />
      <StatCard
        label="IZIN AKTIF"
        icon="check_circle"
        :value="`${accessStore.enabledCount} / ${accessStore.totalPermissions}`"
        variant="horizontal"
        icon-variant="green"
      />
      <StatCard
        label="ROLE DIPILIH"
        icon="admin_panel_settings"
        :value="accessStore.selectedRoleName"
        variant="horizontal"
        icon-variant="purple"
      />
    </div>

    <!-- ═══════════════════════════════════════
         3. ROLE FILTER (AppSelect)
    ════════════════════════════════════════ -->
    <div class="role-filter-bar">
      <AppSelect
        :model-value="selectedRoleValue"
        :options="roleOptions"
        label="Pilih Role"
        placeholder="Pilih role untuk dikelola..."
        @update:model-value="onRoleSelect"
      />
    </div>

    <!-- ═══════════════════════════════════════
         4. PERMISSION TABLE
    ════════════════════════════════════════ -->
    <PermissionTable
      :features="accessStore.currentPermissions"
      :can-edit="accessStore.canEditPermissions"
      :is-saving="accessStore.isSaving"
      :is-loading="accessStore.isLoading"
      @toggle="onToggle"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import PermissionTable from '@/components/hr/access/PermissionTable.vue'
import { useAccessStore } from '@/stores/access.store'
import type { PermissionAction } from '@/types/access'

// ── Store ────────────────────────────────────────────────────
const accessStore = useAccessStore()

// ── Initialize store on mount ────────────────────────────────
onMounted(() => {
  accessStore.initialize()
})

// ── Role Select ──────────────────────────────────────────────
const roleOptions = computed(() =>
  accessStore.roles.map((r) => ({
    label: r.name,
    value: String(r.id),
  })),
)

const selectedRoleValue = computed(() =>
  accessStore.selectedRoleId !== null ? String(accessStore.selectedRoleId) : '',
)

function onRoleSelect(val: string | number | null) {
  if (val === null) return
  const id = Number(val)
  if (!isNaN(id)) accessStore.selectRole(id)
}

// ── Permission Toggle ────────────────────────────────────────
function onToggle(feature: string, action: PermissionAction): void {
  accessStore.togglePermission(feature, action)
}
</script>

<style scoped lang="scss">
.master-access {
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

// ── Role filter ──
.role-filter-bar {
  max-width: 360px;
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
  .role-filter-bar {
    max-width: 100%;
  }
}
</style>