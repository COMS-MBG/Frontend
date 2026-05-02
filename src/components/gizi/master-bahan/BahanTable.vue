<template>
  <div class="bahan-table-wrap">
    <table class="bahan-table">
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
        <slot />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="bahan-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — no props needed.
// Rows and pagination injected via slots.
</script>

<style scoped lang="scss">
.bahan-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.bahan-table {
  width: 100%;
  border-collapse: collapse;
  font-family: $font-body;

  thead {
    position: sticky;
    top: 0;
    z-index: 2;

    tr {
      background-color: $color-bg-subtle;
      border-bottom: 1px solid $color-border;
    }

    th {
      padding: $space-4 $space-5; // Increased vertical padding
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
    }
  }

  .th-nama {
    color: $color-text-primary;
    text-align: left;
  }

  .th-center {
    color: $color-text-primary;
    text-align: center;
  }

  .th-num {
    color: $color-text-primary;
    text-align: center; // Changed to center as requested
  }

  .th-aksi {
    color: $color-text-primary;
    text-align: center;
    width: 120px; // Slightly wider for action buttons with gap
  }
}

.bahan-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>
