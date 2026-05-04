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
        :value="String(accessStore.features.length)"
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
        :value="accessStore.selectedRole"
        variant="horizontal"
        icon-variant="purple"
      />
    </div>

    <!-- ═══════════════════════════════════════
         3. ROLE SELECTOR
    ════════════════════════════════════════ -->
    <RoleSelector
      :model-value="accessStore.selectedRole"
      :roles="accessStore.roles"
      @update:model-value="accessStore.selectRole"
    />

    <!-- ═══════════════════════════════════════
         4. PERMISSION TABLE
    ════════════════════════════════════════ -->
    <PermissionTable
      :features="accessStore.currentPermissions"
      :can-edit="accessStore.canEditPermissions"
      @toggle="onToggle"
    />

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import RoleSelector from '@/components/hr/access/RoleSelector.vue'
import PermissionTable from '@/components/hr/access/PermissionTable.vue'
import { useAccessStore } from '@/stores/access.store'
import type { PermissionAction } from '@/types/access'

// ── Store ────────────────────────────────────────────────────
const accessStore = useAccessStore()

// ── Initialize store on mount ────────────────────────────────
onMounted(() => {
  accessStore.initialize()
})

// ── Handlers ────────────────────────────────────────────────
function onToggle(featureId: string, action: PermissionAction): void {
  accessStore.togglePermission(featureId, action)
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