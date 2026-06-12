<template>
  <div class="resep-table-wrap">
    <table class="resep-table">
      <thead>
        <tr>
          <th class="th-nama">NAMA RESEP</th>
          <th class="th-num">BERAT TOTAL</th>
          <th class="th-num">KALORI</th>
          <th class="th-num">PROTEIN</th>
          <th class="th-num">KARBO</th>
          <th class="th-num">LEMAK</th>
          <th class="th-aksi">AKSI</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>

    <div v-if="$slots.pagination" class="resep-table__footer">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Presentational wrapper — rows and pagination injected via slots.
</script>

<style scoped lang="scss">
.resep-table-wrap {
  @include card-base($radius-lg, $shadow-xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}

.resep-table {
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

  .th-nama {
    color: $color-text-primary;
    text-align: left;
  }

  .th-num {
    color: $color-text-primary;
    text-align: center;
  }

  .th-aksi {
    color: $color-text-primary;
    text-align: center;
    width: 140px;
  }
}

.resep-table__footer {
  padding: $space-4 $space-5;
  border-top: 1px solid $color-border;
  background-color: $color-bg-surface;
}
</style>
