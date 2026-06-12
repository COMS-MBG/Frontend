<template>
  <div class="sa-finance-table-wrap">
    <table class="sa-finance-table">
      <thead>
        <tr>
          <th>No</th>
          <th class="th-name">SPPG</th>
          <th>Periode</th>
          <th class="th-num">Pendapatan</th>
          <th class="th-num">Pengeluaran</th>
          <th class="th-num">Laba Bersih</th>
          <th>Status</th>
          <th class="th-aksi">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="sa-finance-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — rows and pagination injected via slots.
</script>

<style scoped lang="scss">
.sa-finance-table-wrap {
  overflow-x: auto;
  scrollbar-width: thin;
}

.sa-finance-table {
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
    min-width: 180px;
  }

  .th-num {
    text-align: right;
  }

  .th-aksi {
    text-align: center;
    width: 140px;
  }
}

.sa-finance-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>
