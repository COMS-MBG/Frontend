<template>
  <BaseModal
    :model-value="isOpen"
    :title="`Set Stok Minimum — ${item?.ingredient_name ?? ''}`"
    size="md"
    @update:model-value="$emit('close')"
    @close="$emit('close')"
  >
    <form id="stock-minimum-form" class="minimum-form" @submit.prevent="onSubmit" novalidate>
      <!-- Minimum Quantity -->
      <div class="form-group">
        <label class="form-label" for="min-quantity">Batas Minimum Stok <span class="req">*</span></label>
        <div class="input-addon">
          <input
            id="min-quantity"
            type="number"
            class="form-input"
            v-model.number="form.minimum_quantity"
            min="0"
            step="0.001"
            placeholder="0"
          />
          <select class="addon-select" v-model="form.unit">
            <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
        <p v-if="errors.minimum_quantity" class="form-error">{{ errors.minimum_quantity }}</p>
      </div>
    </form>

    <template #footer>
      <button class="btn-secondary" type="button" @click="$emit('close')" :disabled="isSubmitting">Batal</button>
      <button class="btn-primary" type="submit" form="stock-minimum-form" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="material-symbols-outlined spin">progress_activity</span>
        <span v-else class="material-symbols-outlined">save</span>
        {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { StockSummary } from '@/types/stock'
import { stockMinimumSchema } from '@/validation/stock.schema'

const UNITS = ['kg', 'liter', 'gram', 'ml', 'pcs'] as const

const props = defineProps<{
  isOpen: boolean
  isSubmitting: boolean
  item: StockSummary | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { minimum_quantity: number; unit: typeof UNITS[number] }): void
}>()

const form = ref({
  minimum_quantity: '' as number | '',
  unit: 'kg' as typeof UNITS[number]
})

const errors = ref<Record<string, string>>({})

watch(() => props.item, (val) => {
  if (val) {
    form.value.minimum_quantity = val.minimum_quantity
    form.value.unit = val.unit
  }
}, { immediate: true })

watch(() => props.isOpen, (open) => {
  if (!open) {
    errors.value = {}
  } else if (props.item) {
    form.value.minimum_quantity = props.item.minimum_quantity
    form.value.unit = props.item.unit
  }
})

function validate(): boolean {
  const result = stockMinimumSchema.safeParse({
    minimum_quantity: form.value.minimum_quantity,
    unit: form.value.unit
  })

  if (!result.success) {
    errors.value = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string
      if (!errors.value[key]) errors.value[key] = issue.message
    }
    return false
  }
  errors.value = {}
  return true
}

function onSubmit() {
  if (!validate()) return
  emit('submit', {
    minimum_quantity: Number(form.value.minimum_quantity),
    unit: form.value.unit
  })
}
</script>

<style scoped lang="scss">
.minimum-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $space-1.5;
}

.form-label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-text-secondary;

  .req { color: $color-danger; }
}

.form-input {
  border: none;
  border-radius: 0;
  flex: 1;
  padding: $space-2-5 $space-3;
  font-size: $text-sm;
  font-family: $font-body;
  color: $color-text-primary;
  background-color: $color-bg-surface;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.input-addon {
  display: flex;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-muted;
  }

  .addon-select {
    border: none;
    border-left: 1px solid $color-border;
    border-radius: 0;
    padding: $space-2 $space-2-5;
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-secondary;
    background-color: $color-bg-subtle;
    cursor: pointer;
    outline: none;
    min-width: 80px;
  }
}

.form-error {
  font-size: $text-xs;
  color: $color-danger;
  margin: 0;
  font-weight: 600;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
  padding: $space-2-5 $space-4;
  border: none;
  border-radius: $radius-md;
  background-color: $color-primary;
  color: $color-text-inverse;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  font-family: $font-body;
  transition: background-color $transition-fast;

  &:hover:not(:disabled) { background-color: $color-primary-dark; }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
  .material-symbols-outlined { font-size: 1.1rem; }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
  padding: $space-2-5 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background-color: $color-bg-surface;
  color: $color-text-secondary;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  font-family: $font-body;
  transition: background-color $transition-fast;

  &:hover:not(:disabled) { background-color: $color-bg-subtle; }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
