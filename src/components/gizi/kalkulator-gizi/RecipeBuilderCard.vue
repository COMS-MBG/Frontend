<template>
  <BaseCard class="recipe-builder-card" padding="none">
    <BaseLoadingOverlay
      :show="isLoading"
      text="Memuat data resep..."
    />
    <div class="rb-header">
      <div>
        <p class="subtitle">DATA INPUT</p>
        <h2 class="title">Racik Resep</h2>
      </div>
      <div class="icon-wrapper">
        <span class="material-symbols-outlined">restaurant_menu</span>
      </div>
    </div>

    <div class="rb-body">
      <div class="form-group-custom">
        <BaseFormGroup label="NAMA MENU / MASAKAN" :error="errors?.nama">
          <BaseInput
            v-model="localNamaMenu"
            placeholder="Contoh: Sayur Bayam Jagung Manis"
          />
        </BaseFormGroup>
      </div>

      <div class="bahan-section">
        <div class="bahan-header">
          <label>DAFTAR BAHAN BAKU</label>
          <span class="subtitle">Kuantitas dalam Gram (g)</span>
        </div>

        <div class="bahan-list">
          <BahanItemRow
            v-for="(item, index) in bahanItems"
            :key="item.id"
            v-model:bahan-id="item.bahanId"
            v-model:gram="item.gram"
            :bahan-options="bahanOptions"
            :error="errors?.bahanList?.[index]"
            @delete="onRemoveBahan(index)"
          />
        </div>

        <BaseButton 
          variant="secondary" 
          outline 
          full-width 
          icon="add_circle"
          class="bahan-add-btn"
          @click="$emit('add-bahan')"
        >
          Tambah Bahan Baku
        </BaseButton>
      </div>

      <div class="action-buttons">
        <BaseButton 
          variant="dark" 
          full-width 
          icon="calculate"
          :disabled="isSaving"
          @click="$emit('calculate')"
        >
          Hitung Analisis Gizi
        </BaseButton>
        <BaseButton 
          variant="primary" 
          full-width 
          :icon="isSaving ? 'sync' : 'save'"
          :disabled="isSaving"
          :class="{ 'btn--loading': isSaving }"
          @click="$emit('save')"
        >
          {{ isSaving ? 'Menyimpan...' : 'Simpan Resep' }}
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseLoadingOverlay from '@/components/common/BaseLoadingOverlay.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BahanItemRow from './BahanItemRow.vue'
import type { SelectOption } from '@/types/form'
import type { BahanItemData, ResepFormErrors } from '@/types/gizi'

const props = defineProps<{
  namaMenu: string
  bahanItems: BahanItemData[]
  bahanOptions: SelectOption[]
  errors?: ResepFormErrors
  isSaving?: boolean
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:namaMenu', val: string): void
  (e: 'add-bahan'): void
  (e: 'remove-bahan', index: number): void
  (e: 'calculate'): void
  (e: 'save'): void
}>()

const localNamaMenu = computed({
  get: () => props.namaMenu,
  set: (val) => emit('update:namaMenu', val)
})

const onRemoveBahan = (index: number) => {
  emit('remove-bahan', index)
}
</script>

<style scoped lang="scss">
.recipe-builder-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative; /* needed for loading overlay */
  overflow: hidden;
}

.rb-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: $space-5 $space-6;
  border-bottom: 1px solid $color-border;

  .subtitle {
    font-size: $text-xs;
    font-weight: 700;
    color: $color-text-muted;
    letter-spacing: 0.05em;
    margin-bottom: $space-1;
  }

  .title {
    font-size: $text-2xl;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0;
  }

  .icon-wrapper {
    background-color: $color-success-bg;
    color: $color-success;
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;

    .material-symbols-outlined {
      font-size: 1.5rem;
    }
  }
}

.rb-body {
  padding: $space-6;
  display: flex;
  flex-direction: column;
  gap: $space-6;
  flex: 1;
}

.form-group-custom {
  :deep(.form-label) {
    display: block;
    font-size: $text-xs;
    font-weight: 700;
    color: $color-text-primary;
    margin-bottom: $space-2;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

.bahan-section {
  .bahan-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: $space-3;

    label {
      font-size: $text-xs;
      font-weight: 700;
      color: $color-text-primary;
      letter-spacing: 0.05em;
    }

    .subtitle {
      font-size: $text-xs;
      color: $color-text-muted;
    }
  }
}

.bahan-add-btn {
  margin-bottom: $space-8;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  margin-top: auto;
}
</style>
