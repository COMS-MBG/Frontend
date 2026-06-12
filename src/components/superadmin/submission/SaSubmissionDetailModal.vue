<template>
  <BaseModal
    v-model="isOpenModel"
    title="Detail Pengajuan SPPG"
    size="lg"
    @close="onClose"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="detail-loading">
      <span class="material-symbols-outlined detail-loading__icon">progress_activity</span>
      <p>Memuat detail pengajuan...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="submission" class="submission-detail">
      
      <!-- Header Info: Submission Number & Status -->
      <div class="detail-header-info">
        <div class="detail-header-info__left">
          <span class="detail-header-info__badge-source">{{ submission.source }}</span>
          <h4 class="detail-header-info__number">{{ submission.submission_number }}</h4>
        </div>
        <div class="detail-header-info__right">
          <BaseBadge :variant="submission.status === 'registered' ? 'success' : 'warning'">
            {{ submission.status === 'registered' ? 'Terdaftar' : 'Draft' }}
          </BaseBadge>
        </div>
      </div>

      <!-- Tabs Header -->
      <div class="detail-tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'sppg' }"
          @click="activeTab = 'sppg'"
        >
          <span class="material-symbols-outlined tab-icon">domain</span>
          <span>Informasi SPPG</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'accounts' }"
          @click="activeTab = 'accounts'"
        >
          <span class="material-symbols-outlined tab-icon">badge</span>
          <span>Akun Pengurus</span>
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'partners' }"
          @click="activeTab = 'partners'"
        >
          <span class="material-symbols-outlined tab-icon">school</span>
          <span>Sekolah Mitra ({{ submission.partners?.length ?? 0 }})</span>
        </button>
      </div>

      <!-- Tabs Content -->
      <div class="tab-content">
        
        <!-- ── TAB 1: SPPG INFO ── -->
        <div v-if="activeTab === 'sppg'" class="tab-pane">
          <div class="detail-grid">
            
            <!-- Left Side: Basic Data -->
            <div class="detail-section">
              <h5 class="section-title">Data Dasar</h5>
              <div class="info-list">
                <div class="info-row">
                  <span class="label">Nama SPPG</span>
                  <span class="value font-semibold">{{ sppgForm1.name || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Kapasitas Produksi</span>
                  <span class="value font-semibold text-primary">
                    {{ sppgForm1.capacity ? `${sppgForm1.capacity.toLocaleString('id-ID')} Porsi` : '—' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Alamat</span>
                  <span class="value">{{ sppgForm1.address || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Kecamatan</span>
                  <span class="value">{{ sppgForm1.district || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Kota / Kabupaten</span>
                  <span class="value">{{ sppgForm1.city || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Provinsi</span>
                  <span class="value">{{ sppgForm1.province || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- Right Side: GIS / Location Confirmation -->
            <div class="detail-section">
              <h5 class="section-title">Konfirmasi & Lokasi GIS</h5>
              <div class="info-list">
                <div class="info-row">
                  <span class="label">Konfirmasi Peta</span>
                  <span class="value">
                    <BaseBadge :variant="submission.map_confirmed ? 'success' : 'default'">
                      {{ submission.map_confirmed ? 'Sudah Dikonfirmasi' : 'Belum Dikonfirmasi' }}
                    </BaseBadge>
                  </span>
                </div>
                <div class="info-row" v-if="submission.map_confirmed">
                  <span class="label">Status Titik Lokasi</span>
                  <span class="value">
                    <BaseBadge :variant="pointStatusVariant">
                      {{ pointStatusText }}
                    </BaseBadge>
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Koordinat Awal</span>
                  <span class="value font-mono">
                    {{ submission.latitude ? `${submission.latitude.toFixed(6)}, ${submission.longitude?.toFixed(6)}` : '—' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Koordinat Konfirmasi</span>
                  <span class="value font-mono" :class="{ 'text-muted': !submission.confirmed_latitude }">
                    {{ submission.confirmed_latitude ? `${submission.confirmed_latitude.toFixed(6)}, ${submission.confirmed_longitude?.toFixed(6)}` : 'Belum dikonfirmasi peta' }}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Tanggal Dibuat</span>
                  <span class="value">{{ formatDate(submission.created_at) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Tanggal Pembaruan</span>
                  <span class="value">{{ formatDate(submission.updated_at) }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── TAB 2: ACCOUNTS INFO ── -->
        <div v-else-if="activeTab === 'accounts'" class="tab-pane">
          <div class="accounts-grid">
            
            <!-- Admin SPPG -->
            <div class="account-card">
              <div class="account-card__header">
                <span class="material-symbols-outlined account-icon">admin_panel_settings</span>
                <span class="account-role">Admin SPPG</span>
              </div>
              <div class="account-card__body">
                <div class="info-row">
                  <span class="label">Nama Lengkap</span>
                  <span class="value font-semibold">{{ adminAccount.name || '—' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Alamat Email</span>
                  <span class="value font-mono">{{ adminAccount.email || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- Ahli Gizi -->
            <div class="account-card">
              <div class="account-card__header">
                <span class="material-symbols-outlined account-icon">restaurant</span>
                <span class="account-role">Ahli Gizi (Nutritionist)</span>
              </div>
              <div class="account-card__body">
                <template v-if="nutritionistAccount">
                  <div class="info-row">
                    <span class="label">Nama Lengkap</span>
                    <span class="value font-semibold">{{ nutritionistAccount.name || '—' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Alamat Email</span>
                    <span class="value font-mono">{{ nutritionistAccount.email || '—' }}</span>
                  </div>
                </template>
                <div v-else class="account-empty">
                  <span class="material-symbols-outlined empty-icon font-light">info</span>
                  <span>Data Ahli Gizi belum diisi (opsional)</span>
                </div>
              </div>
            </div>

            <!-- Admin Logistik -->
            <div class="account-card">
              <div class="account-card__header">
                <span class="material-symbols-outlined account-icon">local_shipping</span>
                <span class="account-role">Admin Logistik</span>
              </div>
              <div class="account-card__body">
                <template v-if="logisticsAccount">
                  <div class="info-row">
                    <span class="label">Nama Lengkap</span>
                    <span class="value font-semibold">{{ logisticsAccount.name || '—' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Alamat Email</span>
                    <span class="value font-mono">{{ logisticsAccount.email || '—' }}</span>
                  </div>
                </template>
                <div v-else class="account-empty">
                  <span class="material-symbols-outlined empty-icon font-light">info</span>
                  <span>Data Admin Logistik belum diisi (opsional)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── TAB 3: PARTNERS INFO ── -->
        <div v-else-if="activeTab === 'partners'" class="tab-pane">
          
          <div v-if="!submission.partners || submission.partners.length === 0" class="empty-partners">
            <span class="material-symbols-outlined empty-icon">school</span>
            <h6>Belum Ada Sekolah Mitra</h6>
            <p>Draft pengajuan ini belum memiliki sekolah mitra terhubung.</p>
          </div>

          <div v-else class="partners-list-wrap">
            <table class="partners-table">
              <thead>
                <tr>
                  <th class="th-center">NO</th>
                  <th class="th-name">NAMA SEKOLAH</th>
                  <th class="th-center">NPSN</th>
                  <th class="th-center">JENJANG / STATUS</th>
                  <th class="th-center">PORSI HARIAN</th>
                  <th class="th-center">KOORDINAT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, idx) in submission.partners" :key="p.id || idx">
                  <td class="td-center text-muted">{{ idx + 1 }}</td>
                  <td class="td-name">
                    <div class="school-text">
                      <span class="school-name">{{ p.school_name }}</span>
                      <span v-if="p.address" class="school-address">{{ p.address }}, Kec. {{ p.district }}, {{ p.city }}</span>
                    </div>
                  </td>
                  <td class="td-center font-mono text-secondary">{{ p.npsn || '—' }}</td>
                  <td class="td-center">
                    <div class="school-badges">
                      <BaseBadge variant="info">{{ p.level }}</BaseBadge>
                      <BaseBadge :variant="p.school_status === 'public' || p.school_status === 'negeri' ? 'success' : 'default'">
                        {{ p.school_status === 'public' || p.school_status === 'negeri' ? 'Negeri' : 'Swasta' }}
                      </BaseBadge>
                    </div>
                  </td>
                  <td class="td-num font-semibold text-primary">
                    {{ p.jumlah_porsi ? p.jumlah_porsi.toLocaleString('id-ID') : 0 }} Porsi
                  </td>
                  <td class="td-center font-mono">
                    {{ p.latitude ? `${p.latitude.toFixed(5)}, ${p.longitude?.toFixed(5)}` : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>

    <!-- Empty/Fallback State -->
    <div v-else class="detail-empty">
      <span class="material-symbols-outlined detail-empty__icon">error</span>
      <p>Data pengajuan tidak ditemukan.</p>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Tutup</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { SppgDraft } from '@/types/superadmin-submission'

const props = defineProps<{
  isOpen: boolean
  submission: SppgDraft | null
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'close'): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const activeTab = ref<'sppg' | 'accounts' | 'partners'>('sppg')

// Reset active tab to 'sppg' when modal opens
watch(() => props.isOpen, (open) => {
  if (open) {
    activeTab.value = 'sppg'
  }
})

// Safe parsing of form JSON data
const sppgForm1 = computed(() => {
  return (props.submission?.form1_data || {}) as Record<string, any>
})

const adminAccount = computed(() => {
  return (props.submission?.form2_data || {}) as Record<string, any>
})

const nutritionistAccount = computed(() => {
  const f3 = props.submission?.form3_data
  if (!f3) return null
  return (f3.nutritionist || f3.ahli_gizi || null) as Record<string, any> | null
})

const logisticsAccount = computed(() => {
  const f3 = props.submission?.form3_data
  if (!f3) return null
  return (f3.logistics_admin || f3.admin_logistik || null) as Record<string, any> | null
})

const pointStatusVariant = computed(() => {
  const status = props.submission?.point_status
  if (status === 'green') return 'success'
  if (status === 'yellow') return 'warning'
  if (status === 'red') return 'danger'
  return 'default'
})

const pointStatusText = computed(() => {
  const status = props.submission?.point_status
  if (status === 'green') return 'Aman (Hijau)'
  if (status === 'yellow') return 'Perlu Tinjauan (Kuning)'
  if (status === 'red') return 'Konflik Lokasi (Merah)'
  return 'Tidak Diketahui'
})

function formatDate(isoStr?: string | null): string {
  if (!isoStr) return '—'
  try {
    return new Date(isoStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return '—'
  }
}

function onClose() {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.submission-detail {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

// ── Header Info ──
.detail-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: $space-4;
  border-bottom: 1px solid $color-border-light;

  &__left {
    display: flex;
    align-items: center;
    gap: $space-2-5;
  }

  &__badge-source {
    font-size: $text-xs;
    font-weight: 700;
    text-transform: uppercase;
    background: $color-bg-subtle;
    border: 1px solid $color-border;
    color: $color-text-secondary;
    padding: 2px $space-2;
    border-radius: $radius-sm;
    letter-spacing: 0.05em;
  }

  &__number {
    margin: 0;
    font-size: $text-lg;
    font-weight: 700;
    color: $color-text-primary;
    font-family: $font-mono;
  }
}

// ── Tabs ──
.detail-tabs {
  display: flex;
  border-bottom: 1px solid $color-border;
  background: $color-bg-subtle;
  border-radius: $radius-md;
  padding: 2px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  background: transparent;
  border: none;
  padding: $space-2-5 $space-4;
  font-size: $text-xs;
  font-weight: 600;
  color: $color-text-muted;
  cursor: pointer;
  border-radius: $radius-md;
  transition: all $transition-fast;

  .tab-icon {
    font-size: 1.1rem;
    color: $color-text-faint;
  }

  &:hover {
    color: $color-primary;
  }

  &.active {
    background: $color-bg-surface;
    color: $color-primary;
    box-shadow: $shadow-xs;

    .tab-icon {
      color: $color-primary;
    }
  }
}

.tab-content {
  min-height: 200px;
}

// ── Grid & Section Layout ──
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-6;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: $space-4;
  }
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.section-title {
  margin: 0;
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-text-secondary;
}

.info-list {
  display: flex;
  flex-direction: column;
  background: $color-bg-subtle;
  border: 1px solid $color-border-light;
  border-radius: $radius-lg;
  padding: $space-1 $space-4;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-3 0;
  border-bottom: 1px solid $color-border-light;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-size: $text-sm;
    color: $color-text-muted;
  }

  .value {
    font-size: $text-sm;
    color: $color-text-primary;
    text-align: right;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;

    &.font-mono {
      font-family: $font-mono;
      color: $color-text-secondary;
    }
  }
}

// ── Accounts Tab ──
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-4;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.account-card {
  @include card-base($radius-lg, $shadow-xs);
  border: 1px solid $color-border-light;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border-light;
    padding: $space-3 $space-4;
    display: flex;
    align-items: center;
    gap: $space-2;

    .account-icon {
      font-size: 1.15rem;
      color: $color-primary;
    }

    .account-role {
      font-size: $text-xs;
      font-weight: 700;
      color: $color-text-primary;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }

  &__body {
    padding: $space-4;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-3;

    .info-row {
      flex-direction: column;
      align-items: flex-start;
      padding: 0 0 $space-2-5 0;
      border-bottom: 1px solid $color-border-light;
      gap: $space-1;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .label {
        font-size: $text-xs;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .value {
        text-align: left;
        max-width: 100%;
        font-size: $text-sm;
      }
    }
  }
}

.account-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: $space-6 $space-2;
  gap: $space-2;
  color: $color-text-faint;
  font-size: $text-xs;
  height: 100%;
  min-height: 80px;

  .empty-icon {
    font-size: 1.5rem;
  }
}

// ── Partners Tab ──
.empty-partners {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10 $space-4;
  text-align: center;
  border: 1px dashed $color-border;
  border-radius: $radius-lg;
  color: $color-text-muted;

  .empty-icon {
    font-size: 2.5rem;
    color: $color-text-faint;
    margin-bottom: $space-2;
  }

  h6 {
    margin: 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-primary;
  }

  p {
    margin: 2px 0 0 0;
    font-size: $text-xs;
  }
}

.partners-list-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  border: 1px solid $color-border-light;
  scrollbar-width: thin;
}

.partners-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-body;

  thead {
    tr {
      background-color: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-3 $space-4;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
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
      padding: $space-4 $space-3;
      vertical-align: middle;
      font-size: $text-xs;
      color: $color-text-secondary;
    }
  }

  .th-name {
    color: $color-text-primary;
    min-width: 180px;
  }

  .th-center {
    text-align: center;
  }

  .td-center {
    text-align: center;
  }

  .td-name {
    min-width: 180px;
  }

  .td-num {
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .school-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .school-name {
    font-weight: 600;
    color: $color-text-primary;
    font-size: $text-xs;
  }

  .school-address {
    font-size: $text-xs;
    color: $color-text-muted;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .school-badges {
    display: flex;
    justify-content: center;
    gap: 4px;
  }
}

// ── Generic Empty & Loading State ──
.detail-loading,
.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-12;
  gap: $space-3;
  color: $color-text-muted;

  &__icon {
    font-size: 2rem;
  }

  p {
    margin: 0;
    font-size: $text-sm;
  }
}

.detail-loading {
  &__icon {
    animation: spin 1s linear infinite;
    color: $color-primary;
  }
}

.detail-empty {
  &__icon {
    color: $color-danger;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Global helpers (local scoped override fallback if helper class not globally loaded)
.font-semibold { font-weight: 600; }
.font-mono { font-family: $font-mono; font-size: $text-xs; }
.text-primary { color: $color-primary; }
.text-muted { color: $color-text-muted; }
.text-secondary { color: $color-text-secondary; }
</style>
