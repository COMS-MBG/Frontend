<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSuperAdminSppg } from '@/composables/useSuperAdminSppg'
import { useToast } from '@/composables/useToast'
import PageHeader from '@/components/common/PageHeader.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import ConfirmActionModal from '@/components/common/ConfirmActionModal.vue'
import ResultModal from '@/components/common/ResultModal.vue'
import BaseLoadingOverlay from '@/components/common/BaseLoadingOverlay.vue'
import SppgDetailInfo from '@/components/superadmin/sppg/SppgDetailInfo.vue'
import SppgDetailPartners from '@/components/superadmin/sppg/SppgDetailPartners.vue'
import SppgDetailMenus from '@/components/superadmin/sppg/SppgDetailMenus.vue'
import SaAssignSchoolModal from '@/components/superadmin/sppg/SaAssignSchoolModal.vue'
import SppgDetailSkeleton from '@/components/superadmin/sppg/SppgDetailSkeleton.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const sppgId = Number(route.params.id)

const {
  selectedSppg,
  partners,
  menus,
  error,
  isLoadingDetail,
  isLoadingMenus,
  isSubmitting,
  unassignedSchools,
  isLoadingUnassigned,
  fetchSppgDetail,
  fetchPartners,
  fetchMenus,
  detachSchool,
  assignSchool,
  fetchUnassignedSchools,
} = useSuperAdminSppg()

const activeTab = ref<'info' | 'partners' | 'menus'>('info')
const isInitialLoad = ref(true)
const isLoadingPartners = ref(false)

// Detach, Assign & Success Modal State
const showDetachModal = ref(false)
const detachTarget = ref<{ id: string | number; name: string } | null>(null)
const showSuccessModal = ref(false)
const successModalTitle = ref('')
const successModalHeadline = ref('')
const successModalMessage = ref('')

// Assign School State
const showAssignModal = ref(false)

// Computed helpers to safely retrieve data
const sppgData = computed(() => selectedSppg.value?.data ?? null)
const capacityData = computed(() => selectedSppg.value?.capacity ?? null)

// Determine if the currently active tab is still loading
const isActiveTabLoading = computed(() => {
  if (activeTab.value === 'info') return isLoadingDetail.value
  if (activeTab.value === 'partners') return isLoadingPartners.value
  if (activeTab.value === 'menus') return isLoadingMenus.value
  return false
})

onMounted(async () => {
  if (isNaN(sppgId)) {
    toast.error('ID SPPG tidak valid.')
    router.push({ name: 'super-admin-sppg' })
    return
  }

  isInitialLoad.value = true
  isLoadingPartners.value = true
  try {
    await fetchSppgDetail(sppgId)
    await fetchPartners(sppgId)
    await fetchMenus(sppgId)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal memuat data detail.'
    toast.error(msg)
  } finally {
    isLoadingPartners.value = false
    isInitialLoad.value = false
  }
})

function onOpenDetachModal(partnerId: string | number, schoolName: string) {
  detachTarget.value = { id: partnerId, name: schoolName }
  showDetachModal.value = true
}

async function handleDetachConfirm() {
  if (!detachTarget.value) return
  const targetId = String(detachTarget.value.id)
  const schoolName = detachTarget.value.name

  try {
    const success = await detachSchool(sppgId, targetId)
    if (success) {
      // Keep loading active during silent background refresh
      isSubmitting.value = true
      try {
        await Promise.all([
          fetchPartners(sppgId),
          fetchSppgDetail(sppgId)
        ])
      } finally {
        isSubmitting.value = false
      }

      // Close the confirmation modal
      showDetachModal.value = false
      
      // Wait for modal close transition (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Trigger the success ResultModal after the table data row is removed
      successModalTitle.value = 'Kemitraan Diputuskan'
      successModalHeadline.value = 'Kemitraan Berhasil Diputuskan'
      successModalMessage.value = `Kemitraan dengan sekolah "${schoolName}" telah berhasil diputuskan. Status layanan sekolah kini berubah menjadi Tidak Terlayani (Unserved).`
      showSuccessModal.value = true
      detachTarget.value = null
    }
  } catch {
    toast.error(`Gagal memutuskan kemitraan sekolah "${schoolName}".`)
  }
}

// Fetch unserved schools when assign modal opens
watch(showAssignModal, async (isOpen) => {
  if (isOpen) {
    try {
      await fetchUnassignedSchools()
    } catch {
      toast.error('Gagal memuat daftar sekolah unserved.')
    }
  }
})

async function handleAssignSchool(schoolId: string) {
  const school = unassignedSchools.value.find((s) => s.id === schoolId)
  const schoolName = school ? school.school_name : 'Sekolah'

  try {
    const success = await assignSchool(sppgId, schoolId)
    if (success) {
      // Keep loading active during silent background refresh
      isSubmitting.value = true
      try {
        await Promise.all([
          fetchPartners(sppgId),
          fetchSppgDetail(sppgId)
        ])
      } finally {
        isSubmitting.value = false
      }

      // Close the assign modal
      showAssignModal.value = false

      // Wait for modal close transition (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Trigger the success ResultModal after the new school is added to the table
      successModalTitle.value = 'Kemitraan Dibuat'
      successModalHeadline.value = 'Kemitraan Berhasil Dibuat'
      successModalMessage.value = `Sekolah "${schoolName}" telah berhasil dihubungkan ke SPPG ini. Sekolah akan segera menerima alokasi porsi makanan harian.`
      showSuccessModal.value = true
    }
  } catch {
    toast.error(`Gagal menghubungkan sekolah "${schoolName}".`)
  }
}
</script>

<template>
  <div class="sppg-detail-page">
    <PageHeader
      :title="sppgData?.name || 'Detail SPPG'"
      subtitle="Informasi lengkap operasional, mitra sekolah, dan perencanaan menu SPPG"
      :breadcrumb="['Super Admin', 'Manajemen SPPG', sppgData?.name || 'Detail']"
      class="mb-6"
    />

    <!-- Navigation Back Button -->
    <div class="navigation-toolbar">
      <RouterLink :to="{ name: 'super-admin-sppg' }" class="btn-back">
        <span class="material-symbols-outlined">arrow_back</span>
        <span>Kembali ke Daftar</span>
      </RouterLink>
    </div>

    <!-- Error State -->
    <BaseAlert
      v-if="error"
      :show="!!error"
      variant="error"
      :message="error"
      class="mb-6"
    />

    <!-- Main Content Card -->
    <div class="detail-container">
      <!-- Submitting Loading Overlay -->
      <BaseLoadingOverlay :show="isSubmitting && !showDetachModal" />

      <!-- ═══ SKELETON: Initial Full-Page Loading ═══ -->
      <SppgDetailSkeleton v-if="isInitialLoad" type="initial" />

      <!-- ═══ REAL CONTENT ═══ -->
      <template v-else-if="sppgData">
        <!-- Tabs Header -->
        <div class="tabs-header">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            <span class="material-symbols-outlined tab-icon">info</span>
            <span>Informasi SPPG</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'partners' }"
            @click="activeTab = 'partners'"
          >
            <span class="material-symbols-outlined tab-icon">school</span>
            <span>Sekolah Mitra</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'menus' }"
            @click="activeTab = 'menus'"
          >
            <span class="material-symbols-outlined tab-icon">restaurant_menu</span>
            <span>Jadwal Menu</span>
          </button>
        </div>

        <!-- Tabs Body -->
        <div class="tabs-body">
          <Transition name="fade" mode="out-in">
            <div :key="activeTab">

              <!-- ── Info Tab ─────────────── -->
              <template v-if="activeTab === 'info'">
                <SppgDetailInfo
                  v-if="capacityData"
                  :sppg="sppgData"
                  :capacity="capacityData"
                />
                <!-- Info Tab Skeleton (rare, only if detail reloads) -->
                <SppgDetailSkeleton v-else type="initial" />
              </template>

              <!-- ── Partners Tab ─────────── -->
              <template v-else-if="activeTab === 'partners'">
                <SppgDetailSkeleton v-if="isLoadingPartners" type="partners" />
                <SppgDetailPartners
                  v-else
                  :partners="partners"
                  @detach="onOpenDetachModal"
                  @open-assign="showAssignModal = true"
                />
              </template>

              <!-- ── Menus Tab ────────────── -->
              <template v-else-if="activeTab === 'menus'">
                <SppgDetailSkeleton v-if="isLoadingMenus" type="menus" />
                <SppgDetailMenus
                  v-else
                  :menus="menus as any"
                />
              </template>

            </div>
          </Transition>
        </div>
      </template>
    </div>

    <!-- Detach Confirmation Modal -->
    <ConfirmActionModal
      v-model="showDetachModal"
      title="Putus Kemitraan Sekolah Mitra"
      confirm-label="Putus Kemitraan"
      confirm-icon="link_off"
      variant="danger"
      :is-submitting="isSubmitting"
      @confirm="handleDetachConfirm"
    >
      Apakah Anda yakin ingin memutuskan hubungan kemitraan dengan <strong>{{ detachTarget?.name || '' }}</strong>?<br><br>
      <span class="text-danger font-bold">PERINGATAN:</span> 
      Sekolah ini tidak akan lagi menerima alokasi porsi makanan harian dari SPPG ini, dan status layanannya akan berubah menjadi <strong>Tidak Terlayani (Unserved)</strong>.
    </ConfirmActionModal>

    <!-- Success Confirmation Modal -->
    <ResultModal
      v-model="showSuccessModal"
      :title="successModalTitle"
      :headline="successModalHeadline"
      :message="successModalMessage"
      variant="success"
    />

    <!-- Assign School Modal -->
    <SaAssignSchoolModal
      v-model="showAssignModal"
      :schools="unassignedSchools"
      :is-loading="isLoadingUnassigned"
      :is-submitting="isSubmitting"
      @assign="handleAssignSchool"
    />
  </div>
</template>

<style scoped lang="scss">
.sppg-detail-page {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.navigation-toolbar {
  display: flex;
  justify-content: flex-start;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  text-decoration: none;
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-secondary;
  padding: $space-2 $space-4;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  background-color: $color-bg-surface;
  transition: all $transition-fast;

  span {
    font-size: 1.1rem;
  }

  &:hover {
    color: $color-primary;
    border-color: $color-primary-muted;
    background-color: $color-primary-light;
  }
}

.detail-container {
  position: relative;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  min-height: 280px;
  overflow: hidden;
}

// ── Tabs Styling ─────────────────────────────────────────────────
.tabs-header {
  display: flex;
  border-bottom: 1px solid $color-border;
  background: $color-bg-subtle;
  padding: 0 $space-4;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: $space-2;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: $space-4 $space-5;
  font-size: $text-sm;
  font-weight: 600;
  color: $color-text-muted;
  cursor: pointer;
  transition: all $transition-fast;

  .tab-icon {
    font-size: 1.15rem;
  }

  &:hover {
    color: $color-primary;
  }

  &.active {
    color: $color-primary;
    border-bottom-color: $color-primary;
  }
}

.tabs-body {
  padding: $space-6;
}

// ── Transitions ──────────────────────────────────────────────────
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-base;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>

