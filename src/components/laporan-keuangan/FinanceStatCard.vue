<script setup lang="ts">
import { useFinanceStore } from '@/stores/finance.store'
import { formatCompactCurrency } from '@/utils/format'
import StatCard from '@/components/common/StatCard.vue'

const store = useFinanceStore()
</script>

<template>
  <div class="laporan__stats">
    <template v-if="store.loading">
      <div v-for="i in 4" :key="i" class="skeleton-stat-card">
        <div class="skeleton-icon-circle"></div>
        <div class="skeleton-info">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
      </div>
    </template>
    
    <template v-else>
      <StatCard
        label="TOTAL ANGGARAN"
        icon="account_balance"
        :value="formatCompactCurrency(store.stats.totalAnggaran)"
        subtitle="Budget bulanan"
        variant="financial"
        iconVariant="blue"
      />
      <StatCard
        label="TOTAL REALISASI"
        icon="payments"
        :value="formatCompactCurrency(store.stats.totalRealisasi)"
        subtitle="Pengeluaran aktual"
        variant="financial"
        iconVariant="green"
      />
      <StatCard
        label="SISA ANGGARAN"
        icon="savings"
        :value="formatCompactCurrency(store.stats.sisa)"
        subtitle="Dana tersedia"
        variant="financial"
        iconVariant="orange"
      />
      <StatCard
        label="EFISIENSI"
        icon="speed"
        :value="store.stats.efisiensi + '%'"
        subtitle="Tingkat penyerapan"
        variant="financial"
        iconVariant="purple"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@mixin shimmer-bg {
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-stat-card {
  background-color: $color-bg-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  box-shadow: $shadow-xs;
  padding: $space-5 $space-6;
  display: flex;
  align-items: center;
  gap: $space-4;

  .skeleton-icon-circle {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: $radius-lg;
    flex-shrink: 0;
    @include shimmer-bg;
  }

  .skeleton-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  .skeleton-label {
    width: 60%;
    height: 10px;
    border-radius: $radius-sm;
    @include shimmer-bg;
  }

  .skeleton-value {
    width: 80%;
    height: 24px;
    border-radius: $radius-sm;
    @include shimmer-bg;
  }
}
</style>
