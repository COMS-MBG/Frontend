<template>
  <div class="bahan-skeleton-wrap">
    <table class="bahan-skeleton-table">
      <thead>
        <tr>
          <th class="th-nama">NAMA BAHAN</th>
          <th class="th-center">SATUAN</th>
          <th class="th-center">STOK</th>
          <th class="th-num">KALORI/100G</th>
          <th class="th-num">PROTEIN/100G</th>
          <th class="th-num">KARBO/100G</th>
          <th class="th-num">LEMAK/100G</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in rows" :key="i" class="skeleton-row">
          <td>
            <div class="skeleton-cell-nama">
              <div class="skeleton-circle" />
              <div class="skeleton-text-group">
                <div class="skeleton-bar skeleton-bar--name" />
                <div class="skeleton-bar skeleton-bar--sub" />
              </div>
            </div>
          </td>
          <td><div class="skeleton-bar skeleton-bar--badge" /></td>
          <td><div class="skeleton-bar skeleton-bar--short" /></td>
          <td><div class="skeleton-bar skeleton-bar--num" /></td>
          <td><div class="skeleton-bar skeleton-bar--num" /></td>
          <td><div class="skeleton-bar skeleton-bar--num" /></td>
          <td><div class="skeleton-bar skeleton-bar--num" /></td>
          <td>
            <div class="skeleton-action-group">
              <div class="skeleton-circle skeleton-circle--sm" />
              <div class="skeleton-circle skeleton-circle--sm" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
}>(), {
  rows: 6
})
</script>

<style scoped lang="scss">
.bahan-skeleton-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
}

.bahan-skeleton-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-body;

  thead {
    tr {
      background-color: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-3 $space-5;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
    }
  }

  .th-nama { text-align: left; color: $color-text-primary; }
  .th-center { text-align: center; color: $color-text-primary; }
  .th-num { text-align: right; color: $color-text-primary; }
  .th-aksi { text-align: center; width: 100px; color: $color-text-primary; }
}

.skeleton-row {
  border-bottom: 1px solid $color-border-light;

  td {
    padding: $space-4 $space-3;
    vertical-align: middle;
  }
}

// ── Skeleton primitives ──
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-bar {
  height: 12px;
  border-radius: $radius-sm;
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;

  &--name { width: 140px; height: 14px; }
  &--sub { width: 80px; height: 10px; margin-top: 4px; }
  &--badge { width: 48px; height: 22px; border-radius: 6px; margin: 0 auto; }
  &--short { width: 56px; margin: 0 auto; }
  &--num { width: 64px; margin-left: auto; }
}

.skeleton-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, $color-bg-subtle 25%, $color-border-light 50%, $color-bg-subtle 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  flex-shrink: 0;

  &--sm {
    width: 28px;
    height: 28px;
  }
}

.skeleton-cell-nama {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
}

.skeleton-action-group {
  display: flex;
  justify-content: center;
  gap: $space-2;
}
</style>
