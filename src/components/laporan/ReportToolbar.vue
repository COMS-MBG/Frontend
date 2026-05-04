<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useLaporanStore } from '@/stores/laporan.store'
import BaseInput from '@/components/common/BaseInput.vue'

const store = useLaporanStore()
const localQuery = ref(store.filters.search)
let timeoutId: number | null = null

watch(localQuery, (val) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    store.setFilter({ search: val })
  }, 400)
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <div class="report-toolbar">
    <div class="report-toolbar__controls">
      <div class="search-box">
        <BaseInput
          v-model="localQuery"
          placeholder="Cari sekolah atau keterangan..."
          aria-label="Cari laporan"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.report-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &__controls {
    display: flex;
    align-items: center;
    gap: $space-3;
    flex-wrap: wrap;
    justify-content: flex-end;

    .search-box {
      width: 280px;
      max-width: 100%;
    }
  }
}
</style>
