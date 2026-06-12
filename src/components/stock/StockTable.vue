<template>
  <div class="stock-table-wrap">
    <table class="stock-table">
      <thead>
        <tr>
          <th class="th-nama">BAHAN BAKU</th>
          <th class="th-num">TOTAL STOK</th>
          <th class="th-num">MINIMUM</th>
          <th class="th-center">BATCH AKTIF</th>
          <th class="th-center">STATUS</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — rows injected via slot.
</script>

<style scoped lang="scss">
.stock-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.stock-table {
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
      padding: $space-4 $space-5;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $color-text-muted;
      white-space: nowrap;
    }
  }

  .th-nama   { text-align: left; color: $color-text-primary; }
  .th-num    { text-align: right; color: $color-text-primary; }
  .th-center { text-align: center; color: $color-text-primary; }
  .th-aksi   { text-align: center; color: $color-text-primary; width: 160px; }
}
</style>
