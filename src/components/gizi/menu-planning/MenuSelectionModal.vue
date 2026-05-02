<template>
  <BaseModal :model-value="isOpen" title="Pilih Menu - Master Resep" @update:model-value="!$event && $emit('close')" @close="$emit('close')">
    <div class="menu-selection">
      <div class="search-box">
        <span class="material-symbols-outlined search-icon">search</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama menu atau bahan baku..." 
          class="search-input"
        />
      </div>

      <div class="menu-list">
        <div v-if="filteredRecipes.length === 0" class="empty-state">
          Tidak ada menu yang sesuai dengan pencarian.
        </div>
        <div v-else v-for="recipe in filteredRecipes" :key="recipe.id" class="menu-item">
          <div class="menu-img">
            <span class="material-symbols-outlined">restaurant_menu</span>
          </div>
          
          <div class="menu-info">
            <h4 class="menu-title">{{ recipe.nama }}</h4>
            <div class="menu-badges">
              <BaseBadge v-if="recipe.protein > 20" variant="success" text="PROTEIN TINGGI" />
              <BaseBadge v-if="recipe.kalori < 300" variant="info" text="RENDAH KALORI" />
              <BaseBadge v-if="recipe.karbohidrat > 50" variant="default" text="KARBOHIDRAT KOMPLEKS" />
            </div>
          </div>

          <button class="btn-primary btn-sm btn-pilih" @click="selectMenu(recipe.id)">
            Pilih
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { useResepStore } from '@/stores/resep.store'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', menuId: number): void
}>()

const resepStore = useResepStore()
const searchQuery = ref('')

const filteredRecipes = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return resepStore.items.filter(r => r.nama.toLowerCase().includes(query))
})

const selectMenu = (id: number) => {
  emit('select', id)
  emit('close')
  searchQuery.value = ''
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as *;

.menu-selection {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-width: 500px;
  
  @include mobile {
    min-width: 100%;
  }
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  
  .search-icon {
    position: absolute;
    left: $space-3;
    color: $color-text-muted;
  }
  
  .search-input {
    width: 100%;
    padding: $space-2 $space-3 $space-2 2.5rem;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    font-family: $font-body;
    background-color: $color-bg-subtle;
    outline: none;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: $color-primary;
    }
  }
}

.menu-list {
  display: flex;
  flex-direction: column;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $color-border;
    border-radius: 4px;
  }
}

.empty-state {
  padding: $space-6;
  text-align: center;
  color: $color-text-muted;
  font-size: $text-sm;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $space-4;
  padding: $space-3 $space-4;
  border-bottom: 1px dashed $color-border-light;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: $color-bg-subtle;
  }
}

.menu-img {
  width: 48px;
  height: 48px;
  border-radius: $radius-md;
  background-color: $color-primary-subtle;
  color: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  .material-symbols-outlined {
    font-size: 1.5rem;
  }
}

.menu-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.menu-title {
  margin: 0;
  font-size: $text-sm;
  font-weight: 700;
  color: $color-text-primary;
}

.menu-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  
  :deep(.base-badge) {
    font-size: 0.6rem;
    padding: 0.1rem 0.3rem;
  }
}

.btn-pilih {
  padding: 0.4rem 1rem;
  font-size: $text-sm;
  border-radius: $radius-md;
}
</style>
