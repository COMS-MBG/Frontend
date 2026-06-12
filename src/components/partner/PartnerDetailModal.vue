<template>
  <BaseModal
    v-model="isOpenModel"
    title="Detail Sekolah Mitra"
    size="lg"
    @close="onClose"
  >
    <div class="partner-detail" v-if="partner">

      <!-- ── Identity Section ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">school</span>
          Identitas Sekolah
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Nama Sekolah</span>
            <span class="detail-item__value">{{ partner.school_name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">NPSN</span>
            <span class="detail-item__value detail-item__value--mono">
              {{ partner.npsn || '—' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Bentuk</span>
            <span class="detail-item__value">
              <BaseBadge :text="partner.school_type" :variant="bentukVariant" />
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Status</span>
            <span class="detail-item__value">
              <BaseBadge :text="ownershipInfo.label" :variant="ownershipInfo.variant" />
            </span>
          </div>
        </div>
      </section>

      <!-- ── Location Section ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">location_on</span>
          Lokasi
        </h4>
        <div class="detail-grid">
          <div class="detail-item detail-item--full">
            <span class="detail-item__label">Alamat</span>
            <span class="detail-item__value">{{ partner.address || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Kecamatan</span>
            <span class="detail-item__value">{{ partner.district || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Kabupaten/Kota</span>
            <span class="detail-item__value">{{ partner.city || '—' }}</span>
          </div>
        </div>
      </section>

      <!-- ── Program Section ── -->
      <section class="detail-section">
        <h4 class="detail-section__title">
          <span class="material-symbols-outlined">restaurant</span>
          Program MBG
        </h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-item__label">Jumlah Porsi</span>
            <span class="detail-item__value detail-item__value--hero">
              {{ formatNumber(partner.portion_count) }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-item__label">Terdaftar Sejak</span>
            <span class="detail-item__value">{{ formatDate(partner.created_at) }}</span>
          </div>
        </div>
      </section>

    </div>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Tutup</button>
      <button class="btn-primary" @click="$emit('edit', partner)">
        <span class="material-symbols-outlined">edit</span>
        Edit Partner
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { Partner } from '@/types/partner'
import { getOwnershipInfo } from '@/utils/partner'

const props = defineProps<{
  isOpen: boolean
  partner: Partner | null
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'close'): void
  (e: 'edit', partner: Partner | null): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const bentukVariant = computed(() => {
  switch (props.partner?.school_type) {
    case 'SMA': return 'info'
    case 'SMK': return 'warning'
    case 'MA':
    case 'MAK': return 'success'
    default: return 'default'
  }
})

const ownershipInfo = computed(() => {
  return getOwnershipInfo(props.partner?.ownership_status)
})

function formatNumber(val: number): string {
  return val?.toLocaleString('id-ID') ?? '0'
}

function formatDate(isoStr?: string): string {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function onClose() {
  emit('update:isOpen', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.partner-detail {
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
      font-size: $text-2xl;
      font-weight: 800;
      color: $color-primary;
    }
  }
}

@include mobile {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
