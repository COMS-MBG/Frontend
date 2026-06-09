<template>
  <div class="sa-school-table-wrap">
    <table class="sa-school-table">
      <thead>
        <tr>
          <th class="th-center">NO</th>
          <th class="th-nama">NAMA SEKOLAH</th>
          <th>NPSN</th>
          <th>JENIS</th>
          <th>KOTA</th>
          <th class="th-num">PORSI</th>
          <th class="th-center">DIPETAKAN</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="sa-school-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — rows and pagination injected via slots.
</script>

<style scoped lang="scss">
.sa-school-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.sa-school-table {
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

  .th-nama {
    color: $color-text-primary;
    min-width: 240px;
    text-align: left;
  }

  .th-num {
    text-align: center;
  }

  .th-center {
    text-align: center;
  }

  .th-aksi {
    text-align: center;
    width: 120px;
  }
}

.sa-school-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>
