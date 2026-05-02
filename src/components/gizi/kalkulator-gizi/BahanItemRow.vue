<template>
  <div class="bahan-item-row">
    <div class="input-select">
      <BaseFormGroup :error="error?.bahanId" class="form-group--inline">
        <BaseCombobox
          v-model="localBahanId"
          :options="bahanOptions"
          placeholder="Cari bahan baku..."
        />
      </BaseFormGroup>
    </div>
    <div class="input-gram-wrapper">
      <BaseFormGroup :error="error?.gram" class="form-group--inline">
        <BaseInput
          type="number"
          v-model="localGram"
          placeholder="0"
        />
        <span class="gram-label">G</span>
      </BaseFormGroup>
    </div>
    <button type="button" class="btn-delete" @click="$emit('delete')">
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseCombobox from '@/components/common/BaseCombobox.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import type { SelectOption } from '@/types/form'
import type { BahanError } from '@/types/gizi'

const props = defineProps<{
  bahanId: string | number | null
  gram: number | string
  bahanOptions: SelectOption[]
  error?: BahanError
}>()

const emit = defineEmits<{
  (e: 'update:bahanId', val: string | number | null): void
  (e: 'update:gram', val: number | string): void
  (e: 'delete'): void
}>()

const localBahanId = computed({
  get: () => props.bahanId,
  set: (val) => emit('update:bahanId', val)
})

const localGram = computed({
  get: () => props.gram,
  set: (val) => emit('update:gram', val)
})
</script>

<style scoped lang="scss">
.bahan-item-row {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-bottom: $space-3;
}

.form-group--inline {
  margin-bottom: 0;
}

.input-select {
  flex: 1;
}

.input-gram-wrapper {
  position: relative;
  width: 120px;

  .gram-label {
    position: absolute;
    right: $space-3;
    top: 50%;
    transform: translateY(-50%);
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-muted;
    pointer-events: none;
  }
}

.btn-delete {
  background: transparent;
  border: none;
  color: $color-danger;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-2;
  border-radius: $radius-sm;
  transition: all 0.2s;

  &:hover {
    background: $color-danger-bg;
  }

  .material-symbols-outlined {
    font-size: 1.25rem;
  }
}

@include mobile {
  .bahan-item-row {
    flex-wrap: wrap;
  }
  .input-select {
    width: 100%;
    flex: none;
  }
}
</style>
