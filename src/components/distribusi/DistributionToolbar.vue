<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDistributionStore } from '@/stores/distribution.store'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseFilterDate from '@/components/common/BaseFilterDate.vue'

const store = useDistributionStore()
const localQuery = ref(store.query)
let timeoutId: number | null = null

watch(localQuery, (val) => {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(() => {
    store.setQuery(val)
  }, 400)
})
</script>

<template>
  <div class="distribution-toolbar">
    <div class="distribution-toolbar__controls">
      <div class="search-box">
        <BaseInput 
          v-model="localQuery" 
          placeholder="Cari sekolah atau kurir..." 
          aria-label="Cari pengiriman"
        />
      </div>
      <BaseFilterDate 
        v-model="store.date" 
        aria-label="Filter Tanggal"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.distribution-toolbar {
  display: flex;
  justify-content: flex-end; /* Pindahkan filter ke sebelah kanan */
  align-items: center;
  margin-top: $space-2;
  margin-bottom: $space-2; /* Perkecil jarak ke tabel */
  
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
