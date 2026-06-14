<template>
  <div class="pending-bast-card">
    <div class="pending-bast-card__header">
      <div>
        <p class="pending-bast-card__label">{{ sectionLabel }}</p>
        <h2 class="pending-bast-card__title">{{ title }}</h2>
      </div>
      <span v-if="schedules.length" class="pending-bast-card__badge">
        <span class="material-symbols-outlined badge__icon">warning</span>
        {{ schedules.length }} Tertunda
      </span>
      <span v-else class="pending-bast-card__badge pending-bast-card__badge--success">
        <span class="material-symbols-outlined badge__icon">check_circle</span>
        Semua Bersih
      </span>
    </div>

    <div class="pending-bast-card__body">
      <div v-if="schedules.length === 0" class="empty-state">
        <span class="material-symbols-outlined empty-icon">check_circle</span>
        <p class="empty-text">Semua Berita Acara Serah Terima (BAST) telah diverifikasi.</p>
      </div>

      <div v-else class="bast-list">
        <div v-for="item in schedules" :key="item.id" class="bast-item">
          <div class="bast-item__info">
            <span class="bast-item__school">{{ item.school_name || 'Sekolah Terdaftar' }}</span>
            <div class="bast-item__meta">
              <span class="meta-item">
                <span class="material-symbols-outlined meta-icon">local_shipping</span>
                {{ item.courier_name || 'Kurir' }}
              </span>
              <span class="meta-item">
                <span class="material-symbols-outlined meta-icon">schedule</span>
                {{ formatTime(item.arrived_at) }}
              </span>
            </div>
          </div>
          <button class="btn-verify" @click="$emit('verify', item.id)">
            Verifikasi
          </button>
        </div>
      </div>
    </div>

    <button class="btn-secondary" @click="$emit('view-all')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  sectionLabel?: string
  title?: string
  schedules?: Array<{
    id: number
    courier_name: string | null
    school_name: string | null
    arrived_at: string | null
  }>
  actionLabel?: string
}>(), {
  sectionLabel: 'VERIFIKASI BAST',
  title: 'BAST Menunggu Verifikasi',
  schedules: () => [],
  actionLabel: 'Lihat Riwayat Distribusi',
})

defineEmits<{
  (e: 'verify', id: number): void
  (e: 'view-all'): void
}>()

function formatTime(val: string | null): string {
  if (!val) return '-'
  const d = new Date(val)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
}
</script>

<style scoped lang="scss">
.pending-bast-card {
  @include card-base;
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-5;
  font-family: $font-body;
  height: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $space-4;
  }

  &__label {
    @include label-uppercase;
    margin: 0 0 $space-1 0;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    padding: $space-1 $space-2.5;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 700;
    white-space: nowrap;
    background: $color-warning-bg;
    color: $color-warning;
    border: 1px solid $color-warning-border;

    &--success {
      background: $color-success-bg;
      color: $color-success;
      border: 1px solid $color-success-border;
    }

    .badge__icon {
      font-size: 1rem;
    }
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $space-8 $space-4;
  text-align: center;
  color: $color-text-muted;
  gap: $space-3;
  margin: auto 0;

  .empty-icon {
    font-size: 2.5rem;
    color: $color-success;
    opacity: 0.8;
  }

  .empty-text {
    font-size: $text-sm;
    line-height: 1.5;
    margin: 0;
  }
}

.bast-list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.bast-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-3 $space-4;
  background-color: $color-bg-muted;
  border-radius: $radius-lg;
  border: 1px solid $color-border-light;
  gap: $space-4;
  transition: all $transition-fast;

  &:hover {
    border-color: $color-border;
    background-color: $color-bg-subtle;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  &__school {
    font-size: $text-base;
    font-weight: 600;
    color: $color-text-primary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: $space-4;
    flex-wrap: wrap;
  }

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: $text-xs;
    color: $color-text-secondary;

    .meta-icon {
      font-size: 0.95rem;
      color: $color-text-muted;
    }
  }
}

.btn-verify {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-2 $space-4;
  border-radius: $radius-md;
  font-size: $text-xs;
  font-weight: 700;
  cursor: pointer;
  background: $color-bg-surface;
  color: $color-primary;
  border: 1.5px solid $color-border;
  transition: all $transition-fast;
  white-space: nowrap;

  &:hover {
    background: $color-primary;
    color: $color-text-inverse;
    border-color: $color-primary;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-2 $space-5;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-weight: 600;
  font-family: $font-body;
  cursor: pointer;
  background: transparent;
  color: $color-text-primary;
  border: 1.5px solid $color-border;
  transition: all $transition-fast;
  align-self: flex-start;

  &:hover {
    background: $color-bg-muted;
    border-color: $color-border;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
}

@include mobile {
  .bast-item {
    flex-direction: column;
    align-items: stretch;
    gap: $space-3;
  }
  .btn-verify {
    width: 100%;
  }
  .btn-secondary {
    width: 100%;
  }
}
</style>
