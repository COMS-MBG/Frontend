<template>
  <BaseModal
    v-model="isOpenModel"
    title="Detail Karyawan"
    size="lg"
    @close="onClose"
  >
    <div class="employee-detail" v-if="employee">

      <!-- ── Identity Section ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">person</span>
          Informasi Pribadi
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Nama Lengkap</span>
            <span class="detail-item__value">{{ employee.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">NIK</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ employee.nik || '—' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">No. Telepon</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ employee.phone || '—' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Status</span>
            <span class="detail-item__value">
              <BaseBadge
                :text="employee.status === 'active' ? 'Aktif' : 'Nonaktif'"
                :variant="employee.status === 'active' ? 'success' : 'default'"
              />
            </span>
          </div>
          <div class="detail-item detail-item--full">
            <span class="detail-item__label">Alamat</span>
            <span class="detail-item__value">{{ employee.address || '—' }}</span>
          </div>
        </div>
      </section>

      <!-- ── Position & Role Section ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">work</span>
          Jabatan & Akses
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Posisi / Jabatan</span>
            <span class="detail-item__value">{{ positionLabel }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Role Akses</span>
            <span class="detail-item__value">
              <BaseBadge
                :text="employee.role?.name ?? 'Tanpa Akses'"
                :variant="roleVariant"
              />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Tanggal Bergabung</span>
            <span class="detail-item__value">{{ formatDate(employee.joined_at) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Gaji Pokok</span>
            <span class="detail-item__value detail-item__value--hero">
              {{ formatCurrency(employee.base_salary) }}
            </span>
          </div>
        </div>
      </section>

      <!-- ── Account Section ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">account_circle</span>
          Akun Sistem
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Memiliki Akun</span>
            <span class="detail-item__value">
              <BaseBadge
                :text="employee.has_account ? 'Ya' : 'Belum'"
                :variant="employee.has_account ? 'success' : 'default'"
              />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Email Login</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ employee.user?.email || '—' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Terdaftar Sejak</span>
            <span class="detail-item__value">{{ formatDate(employee.created_at) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Terakhir Diperbarui</span>
            <span class="detail-item__value">{{ formatDate(employee.updated_at) }}</span>
          </div>
        </div>
      </section>

    </div>

    <!-- Loading state -->
    <div v-else class="detail-loading">
      <span class="material-symbols-outlined detail-loading__icon">progress_activity</span>
      <p>Memuat data karyawan...</p>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Tutup</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { Employee } from '@/types/employee'

const POSITION_LABELS: Record<string, string> = {
  pemilik: 'Pemilik',
  manajer: 'Manajer',
  ahli_gizi: 'Ahli Gizi',
  admin_logistik: 'Admin Logistik',
  kurir: 'Kurir',
  karyawan_operasional: 'Karyawan Operasional',
}

const props = defineProps<{
  isOpen: boolean
  employee: Employee | null
  canEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'close'): void
  (e: 'edit', employee: Employee): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const positionLabel = computed(() =>
  props.employee ? (POSITION_LABELS[props.employee.position] ?? props.employee.position) : '—',
)

const roleVariant = computed(() => {
  const name = props.employee?.role?.name
  if (!name || name === 'Tanpa Akses') return 'default'
  if (name.includes('Admin')) return 'info'
  if (name.includes('Gizi')) return 'success'
  return 'warning'
})

function formatDate(isoStr?: string | null): string {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatCurrency(val?: number | null): string {
  if (val === null || val === undefined) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val)
}

function onClose() {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.employee-detail {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

// ── Section ──
.detail-section {
  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-text-secondary;
    margin: 0 0 $space-3;
    padding-bottom: $space-2;
    border-bottom: 1px solid $color-border-light;

    .material-symbols-outlined {
      font-size: 1.1rem;
      color: $color-primary;
    }
  }
}

// ── Grid ──
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-3 $space-5;
}

// ── Item ──
.detail-item {
  display: flex;
  flex-direction: column;
  gap: $space-1;

  &--full {
    grid-column: 1 / -1;
  }

  &__label {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  &__value {
    font-size: $text-base;
    font-weight: 500;
    color: $color-text-primary;

    &--mono {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.05em;
    }

    &--hero {
      font-size: $text-xl;
      font-weight: 800;
      color: $color-primary;
    }
  }
}

// ── Loading ──
.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-10;
  gap: $space-3;
  color: $color-text-muted;

  &__icon {
    font-size: 2rem;
    animation: spin 1s linear infinite;
  }

  p {
    margin: 0;
    font-size: $text-sm;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@include mobile {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
