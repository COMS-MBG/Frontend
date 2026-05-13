<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="val => !val && $emit('update:isOpen', false)"
    :title="mode === 'create' ? 'Partner Ditambahkan' : 'Partner Diperbarui'"
    size="sm"
  >
    <div class="success-body">
      <!-- Pulsing success icon — mirrors BahanDeleteModal danger pattern -->
      <div class="icon-wrapper">
        <div class="icon-success">
          <span class="material-symbols-outlined">check_circle</span>
        </div>
      </div>

      <h4 class="message">
        {{ mode === 'create' ? 'Berhasil Ditambahkan!' : 'Berhasil Diperbarui!' }}
      </h4>

      <p class="sub-message" v-if="partnerName">
        <span class="highlight-name">{{ partnerName }}</span>
        {{ mode === 'create'
          ? 'telah berhasil ditambahkan ke daftar sekolah mitra.'
          : 'telah berhasil diperbarui.' }}
      </p>
    </div>

    <template #footer>
      <button class="btn-primary btn-full" @click="$emit('update:isOpen', false)">
        <span class="material-symbols-outlined">done</span>
        Oke, Tutup
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/common/BaseModal.vue'

defineProps<{
  isOpen: boolean
  mode: 'create' | 'edit'
  partnerName?: string | null
}>()

defineEmits<{
  (e: 'update:isOpen', val: boolean): void
}>()
</script>

<style scoped lang="scss">
.success-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: $space-4 $space-2 $space-2;
}

// ── Icon — mirrors .icon-wrapper in BahanDeleteModal ──
.icon-wrapper {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-bottom: $space-6;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: $color-success;
    opacity: 0.12;
    border-radius: 50%;
    transform: scale(1.4);
    animation: pulse-success 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.icon-success {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: $color-success-bg;
  color: $color-success;
  box-shadow: $shadow-sm;

  span { font-size: $text-hero; }
}

// ── Text ──
.message {
  font-size: $text-lg;
  font-weight: 600;
  color: $color-text-primary;
  margin: 0 0 $space-3;
}

.sub-message {
  font-size: $text-sm;
  line-height: 1.6;
  color: $color-text-secondary;
  max-width: 260px;

  .highlight-name {
    display: inline-block;
    font-weight: 700;
    color: $color-text-primary;
    background: $color-bg-subtle;
    padding: 2px $space-2;
    border-radius: $radius-sm;
    margin-bottom: $space-1;
  }
}

// ── Footer button ──
.btn-full {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
}

// ── Pulse animation — green variant of BahanDeleteModal's pulse-danger ──
@keyframes pulse-success {
  0%   { transform: scale(1);   opacity: 0.15; }
  50%  { transform: scale(1.6); opacity: 0.05; }
  100% { transform: scale(1);   opacity: 0.15; }
}
</style>
