<script setup lang="ts">
import { useFinanceStore } from '@/stores/finance.store'
import { formatRupiah } from '@/utils/format'
import StatCard from '@/components/common/StatCard.vue'

const store = useFinanceStore()
</script>

<template>
  <div class="laporan__stats">
    <template v-if="store.loading">
      <div v-for="i in 4" :key="i" class="skeleton-stat-card">
        <div class="skeleton-top">
          <div class="skeleton-label"></div>
          <div class="skeleton-icon"></div>
        </div>
        <div class="skeleton-value"></div>
        <div class="skeleton-sub"></div>
      </div>
    </template>
    
    <template v-else>
      <StatCard
        label="TOTAL ANGGARAN"
        icon="account_balance"
        :value="formatRupiah(store.stats.totalAnggaran)"
        subtitle="Budget bulanan"
        iconVariant="blue"
      />
      <StatCard
        label="TOTAL REALISASI"
        icon="payments"
        :value="formatRupiah(store.stats.totalRealisasi)"
        subtitle="Pengeluaran aktual"
        iconVariant="green"
      />
      <StatCard
        label="SISA ANGGARAN"
        icon="savings"
        :value="formatRupiah(store.stats.sisa)"
        subtitle="Dana tersedia"
        iconVariant="orange"
      />
      <StatCard
        label="EFISIENSI"
        icon="speed"
        :value="store.stats.efisiensi + '%'"
        subtitle="Tingkat penyerapan"
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
  @include card-base($radius-lg, $shadow-xs);
  padding: $space-5 $space-6;
  border-left: 4px solid $color-border-light;

  .skeleton-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: $space-3;
  }

  .skeleton-label {
    width: 60%;
    height: 12px;
    border-radius: 4px;
    @include shimmer-bg;
  }

  .skeleton-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    @include shimmer-bg;
  }

  .skeleton-value {
    width: 80%;
    height: 32px;
    border-radius: 6px;
    margin-bottom: $space-2;
    @include shimmer-bg;
  }

  .skeleton-sub {
    width: 40%;
    height: 10px;
    border-radius: 4px;
    @include shimmer-bg;
  }
}
</style>
