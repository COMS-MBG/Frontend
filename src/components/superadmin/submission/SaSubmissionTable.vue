<template>
  <div class="sa-submission-table-wrap">
    <table class="sa-submission-table">
      <thead>
        <tr>
          <th class="th-center">NO</th>
          <th class="th-number">NO. PENGAJUAN</th>
          <th>SUMBER</th>
          <th class="th-center">STATUS</th>
          <th class="th-center">PETA DIKONFIRMASI</th>
          <th>TANGGAL</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="sa-submission-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — rows injected via slot.
</script>

<style scoped lang="scss">
.sa-submission-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.sa-submission-table {
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
  .th-number {
    color: $color-text-primary;
    min-width: 240px;
    text-align: left;
  }

  .th-center {
    text-align: center;
  }

  .th-aksi {
    color: $color-text-primary;
    text-align: center;
    width: 120px;
  }
}

.sa-submission-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>
