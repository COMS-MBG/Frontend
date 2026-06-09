<template>
  <div class="sa-dashboard-card finance-widget-card">
    <div class="finance-widget-card__header">
      <div class="header-title">
        <span class="material-symbols-outlined header-icon">payments</span>
        <h3>Ringkasan Keuangan SPPG Nasional</h3>
      </div>
      <span class="badge badge--info">Sistem Laporan</span>
    </div>

    <div class="finance-widget-card__body">
      <!-- Grid Summary Data -->
      <div class="financial-metric-grid">
        <div class="metric-box box-income">
          <span class="label">Total Anggaran (Income)</span>
          <span class="value">Rp {{ summary.income.toLocaleString('id-ID') }}</span>
        </div>
        <div class="metric-box box-expense">
          <span class="label">Total Realisasi (Expense)</span>
          <span class="value">Rp {{ summary.expense.toLocaleString('id-ID') }}</span>
        </div>
        <div class="metric-box box-surplus" :class="{ 'is-negative': summary.net < 0 }">
          <span class="label">Sisa Anggaran (Surplus)</span>
          <span class="value">Rp {{ summary.net.toLocaleString('id-ID') }}</span>
        </div>
      </div>

      <!-- Helper text for empty data state -->
      <div v-if="summary.income === 0 && summary.expense === 0" class="zero-state-helper">
        <span class="material-symbols-outlined info-icon">info</span>
        <p>Belum ada realisasi anggaran atau laporan keuangan yang diserahkan oleh SPPG Daerah untuk periode ini. Metrik akan terakumulasi otomatis setelah laporan keuangan disetujui.</p>
      </div>

      <!-- Pending Approvals Feed Section -->
      <div class="approvals-feed">
        <h4 class="section-title">Persetujuan Laporan Keuangan Terkini</h4>
        
        <div v-if="summary.pending.length === 0" class="empty-feed">
          <span class="material-symbols-outlined check-icon">check_circle</span>
          <p>Semua laporan keuangan telah ditinjau. Tidak ada antrean persetujuan.</p>
        </div>

        <div v-else class="feed-list">
          <div 
            v-for="report in summary.pending" 
            :key="report.id" 
            class="feed-item"
          >
            <div class="feed-item__info">
              <div class="sppg-name">{{ report.sppg_name }}</div>
              <div class="meta-row">
                <span class="period">Periode: {{ report.period }}</span>
                <span class="amount">Surplus: Rp {{ report.net_income.toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <div class="feed-item__actions">
              <button 
                class="btn-action btn-action--reject" 
                title="Tolak"
                :disabled="processingId === report.id"
                @click="handleAction(report.id, 'reject')"
              >
                <span v-if="processingId === report.id && currentAction === 'reject'" class="material-symbols-outlined is-spinning">sync</span>
                <span v-else class="material-symbols-outlined">close</span>
              </button>
              <button 
                class="btn-action btn-action--approve" 
                title="Setujui"
                :disabled="processingId === report.id"
                @click="handleAction(report.id, 'approve')"
              >
                <span v-if="processingId === report.id && currentAction === 'approve'" class="material-symbols-outlined is-spinning">sync</span>
                <span v-else class="material-symbols-outlined">check</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FinancialReport } from '@/types/superadmin-finance'
import { useToast } from '@/composables/useToast'

defineProps<{
  summary: {
    income: number
    expense: number
    net: number
    pending: FinancialReport[]
  }
}>()

const emit = defineEmits<{
  (e: 'approve', id: number | string): void
  (e: 'reject', id: number | string): void
}>()

const toast = useToast()
const processingId = ref<number | string | null>(null)
const currentAction = ref<'approve' | 'reject' | null>(null)

async function handleAction(id: number | string, action: 'approve' | 'reject') {
  processingId.value = id
  currentAction.value = action
  try {
    if (action === 'approve') {
      await emit('approve', id)
      toast.success('Laporan keuangan berhasil disetujui')
    } else {
      await emit('reject', id)
      toast.warning('Laporan keuangan berhasil ditolak')
    }
  } catch {
    toast.error('Gagal memproses persetujuan laporan keuangan')
  } finally {
    processingId.value = null
    currentAction.value = null
  }
}
</script>

<style scoped lang="scss">
.finance-widget-card {
  display: flex;
  flex-direction: column;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $space-4 $space-5;
    background: $color-bg-subtle;
    border-bottom: 1px solid $color-border;

    .header-title {
      display: flex;
      align-items: center;
      gap: $space-2;

      .header-icon {
        color: $color-primary;
        font-size: 1.25rem;
      }

      h3 {
        margin: 0;
        font-size: $text-sm;
        font-weight: 700;
        color: $color-text-primary;
      }
    }

    .badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: $radius-sm;
      font-weight: 600;
      background: rgba($color-primary, 0.1);
      color: $color-primary-dark;
      border: 1px solid rgba($color-primary, 0.2);
    }
  }

  &__body {
    padding: $space-5;
    display: flex;
    flex-direction: column;
    gap: $space-5;
  }
}

// Grid data keuangan
.financial-metric-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $space-3;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.metric-box {
  display: flex;
  flex-direction: column;
  padding: $space-3-5 $space-4;
  border-radius: $radius-md;
  border-left: 3px solid transparent;
  
  .label {
    font-size: 10px;
    font-weight: 700;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .value {
    font-size: $text-sm;
    font-weight: 800;
    font-family: $font-mono;
  }

  &.box-income {
    background: var(--color-primary-subtle);
    border-left-color: var(--color-primary);
    .value { color: var(--color-primary-dark); }
  }

  &.box-expense {
    background: var(--color-danger-bg);
    border-left-color: var(--color-danger-border);
    .value { color: var(--color-danger-darker); }
  }

  &.box-surplus {
    background: var(--color-success-bg);
    border-left-color: var(--color-success);
    .value { color: var(--color-success); }

    &.is-negative {
      background: var(--color-danger-bg);
      border-left-color: var(--color-danger);
      .value { color: var(--color-danger-darker); }
    }
  }
}

.zero-state-helper {
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-3-5 $space-4;
  background: var(--color-primary-light);
  border: 1px solid var(--color-primary-muted);
  border-radius: $radius-md;
  color: $color-text-secondary;

  .info-icon {
    color: var(--color-primary);
    font-size: 1.25rem;
    margin-top: 1px;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: 11px;
    line-height: 1.4;
  }
}

// Persetujuan feed
.approvals-feed {
  display: flex;
  flex-direction: column;
  gap: $space-3;

  .section-title {
    margin: 0;
    font-size: 11px;
    font-weight: 800;
    color: $color-text-secondary;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.empty-feed {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-4;
  background: $color-bg-subtle;
  border: 1px dashed $color-border;
  border-radius: $radius-md;
  color: $color-text-muted;

  .check-icon {
    color: $color-success;
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    font-size: $text-xs;
  }
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.feed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-3 $space-4;
  background: $color-bg-subtle;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-primary-muted;
    background: $color-bg-surface;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    .sppg-name {
      font-size: $text-sm;
      font-weight: 700;
      color: $color-text-primary;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta-row {
      display: flex;
      gap: $space-4;
      font-size: 11px;
      color: $color-text-muted;

      .amount {
        font-family: $font-mono;
        font-weight: 600;
        color: $color-text-secondary;
      }
    }
  }

  &__actions {
    display: flex;
    gap: $space-2;
    flex-shrink: 0;

    .btn-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid transparent;
      background: white;
      cursor: pointer;
      transition: all $transition-fast;
      padding: 0;

      .material-symbols-outlined {
        font-size: 16px;
      }

      &--approve {
        color: $color-success;
        border-color: rgba($color-success, 0.3);
        
        &:hover:not(:disabled) {
          background: $color-success;
          color: white;
          border-color: $color-success;
        }
      }

      &--reject {
        color: $color-danger;
        border-color: rgba($color-danger, 0.3);

        &:hover:not(:disabled) {
          background: $color-danger;
          color: white;
          border-color: $color-danger;
        }
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

.is-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
