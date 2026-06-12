<template>
  <div class="sa-dashboard-card drafts-feed-card">
    <div class="drafts-feed-card__header">
      <div class="header-title">
        <span class="material-symbols-outlined header-icon">gpp_maybe</span>
        <h3>Tindakan Cepat: Konfirmasi GIS</h3>
      </div>
      <span class="badge badge--warning" v-if="drafts.length > 0">{{ drafts.length }} Tertunda</span>
      <span class="badge badge--success" v-else>Selesai</span>
    </div>

    <div class="drafts-feed-card__body">
      <!-- Empty State: No drafts pending -->
      <div v-if="drafts.length === 0" class="drafts-empty-state">
        <span class="material-symbols-outlined check-icon">check_circle</span>
        <div class="empty-text">
          <h4>Semua Lokasi Terkonfirmasi</h4>
          <p>Tidak ada draf pengajuan lokasi baru yang memerlukan tindakan centroid-shifting saat ini.</p>
        </div>
      </div>

      <!-- Feed List -->
      <div v-else class="drafts-list">
        <div 
          v-for="draft in drafts.slice(0, 3)" 
          :key="draft.id" 
          class="draft-feed-item"
        >
          <div class="draft-info">
            <div class="draft-title">
              <span class="sub-number">{{ draft.submission_number }}</span>
              <span class="draft-source">{{ draft.source === 'dinas' ? 'Pengajuan Dinas' : 'Rekomendasi Sistem' }}</span>
            </div>
            <div class="draft-region">
              <span class="material-symbols-outlined icon-pin">location_on</span>
              <span>{{ draft.partners?.[0]?.city || draft.partners?.[0]?.district || 'Jawa Barat' }}</span>
            </div>
          </div>

          <div class="draft-actions">
            <span class="partners-count">{{ draft.partners?.length || 0 }} Sekolah</span>
            <button 
              class="btn-tinjau" 
              @click="$emit('navigate', 'super-admin-map')"
              aria-label="Tinjau Lokasi"
            >
              <span>Tinjau</span>
              <span class="material-symbols-outlined">explore</span>
            </button>
          </div>
        </div>

        <div v-if="drafts.length > 3" class="more-drafts-notice">
          <span>+{{ drafts.length - 3 }} draf pengajuan lokasi lainnya menunggu antrean konfirmasi...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SppgDraft } from '@/types/superadmin-submission'

defineProps<{
  drafts: SppgDraft[]
}>()

defineEmits<{
  (e: 'navigate', routeName: string): void
}>()
</script>

<style scoped lang="scss">
.drafts-feed-card {
  display: flex;
  flex-direction: column;
  background: $color-bg-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  overflow: hidden;
  height: 100%;
  min-height: 290px;

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

      &--success {
        background: rgba($color-success, 0.1);
        color: $color-success-dark;
        border: 1px solid rgba($color-success, 0.2);
      }

      &--warning {
        background: rgba($color-warning, 0.1);
        color: $color-warning-dark;
        border: 1px solid rgba($color-warning, 0.2);
      }
    }
  }

  &__body {
    padding: $space-5;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.drafts-empty-state {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-4 $space-2;

  .check-icon {
    font-size: 2.25rem;
    color: $color-success;
    flex-shrink: 0;
  }

  .empty-text {
    h4 {
      margin: 0 0 2px 0;
      font-size: $text-sm;
      font-weight: 700;
      color: $color-text-primary;
    }
    p {
      margin: 0;
      font-size: $text-xs;
      color: $color-text-muted;
      line-height: 1.4;
    }
  }
}

.drafts-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  width: 100%;
}

.draft-feed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-3 $space-4;
  background: $color-bg-subtle;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  transition: all $transition-base;

  &:hover {
    background: $color-bg-surface;
    border-color: $color-primary-muted;
    box-shadow: $shadow-xs;
    transform: translateY(-1px);
  }
}

.draft-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  .draft-title {
    display: flex;
    align-items: center;
    gap: $space-2;
    flex-wrap: wrap;

    .sub-number {
      font-size: $text-sm;
      font-weight: 700;
      color: $color-text-primary;
      font-family: $font-mono;
    }

    .draft-source {
      font-size: 9px;
      font-weight: 700;
      color: $color-text-muted;
      background: $color-bg-muted;
      padding: 1px 4px;
      border-radius: $radius-sm;
    }
  }

  .draft-region {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 11px;
    color: $color-text-secondary;

    .icon-pin {
      font-size: 13px;
      color: $color-text-faint;
    }
  }
}

.draft-actions {
  display: flex;
  align-items: center;
  gap: $space-4;
  flex-shrink: 0;

  .partners-count {
    font-size: 11px;
    font-weight: 600;
    color: $color-text-muted;
  }

  .btn-tinjau {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 28px;
    padding: 0 $space-3;
    border-radius: $radius-pill;
    border: 1px solid $color-primary;
    background: transparent;
    color: $color-primary;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all $transition-fast;

    .material-symbols-outlined {
      font-size: 14px;
      transition: transform $transition-fast;
    }

    &:hover {
      background: $color-primary;
      color: white;

      .material-symbols-outlined {
        transform: rotate(30deg);
      }
    }
  }
}

.more-drafts-notice {
  font-size: 10px;
  color: $color-text-muted;
  text-align: center;
  font-weight: 600;
  margin-top: 2px;
}
</style>
