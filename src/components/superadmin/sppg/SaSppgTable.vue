<template>
  <div class="sa-sppg-table-wrap">
    <table class="sa-sppg-table">
      <thead>
        <tr>
          <th class="th-center">NO</th>
          <th class="th-name">NAMA SPPG</th>
          <th>KOTA</th>
          <th class="th-num">KAPASITAS</th>
          <th class="th-center">STATUS</th>
          <th>TANGGAL DIBUAT</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="sa-sppg-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — rows and pagination injected via slots.
</script>

<style scoped lang="scss">
.sa-sppg-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.sa-sppg-table {
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
      text-align: left;
    }
  }

  .th-name {
    color: $color-text-primary;
    min-width: 240px;
    text-align: left;
  }

  .th-num {
    color: $color-text-primary;
    text-align: center;
  }

  .th-center {
    text-align: center;
  }

  .th-aksi {
    color: $color-text-primary;
    text-align: center;
    width: 160px;
  }
}

.sa-sppg-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>
