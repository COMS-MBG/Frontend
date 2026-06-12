<template>
  <form @submit.prevent="handleSubmit" class="bahan-form">
    <!-- ── Section 1: Informasi Dasar ── -->
    <div class="section-title">Informasi Dasar</div>

    <div class="form-grid">
      <BaseFormGroup
        label="Nama Bahan"
        id="name"
        required
        :error="errors.name"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model="formData.name"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="Masukkan nama bahan"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Berat Acuan (gram)"
        id="serving_weight"
        required
        :error="errors.serving_weight"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.serving_weight"
            type="number"
            step="any"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="100"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Deskripsi"
        id="description"
        class="form-grid__full"
        :error="errors.description"
      >
        <template #default="{ id, describedby, invalid }">
          <textarea
            v-model="formData.description"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control form-control--textarea"
            placeholder="Deskripsi bahan (opsional)"
            rows="2"
          />
        </template>
      </BaseFormGroup>
    </div>

    <!-- ── Section 2: Kandungan Nutrisi ── -->
    <div class="section-title">Kandungan Nutrisi</div>

    <div class="form-grid">
      <BaseFormGroup
        label="Kalori (kkal)"
        id="calorie"
        required
        :error="errors.calorie"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.calorie"
            type="number"
            step="any"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="0"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Protein (g)"
        id="protein"
        required
        :error="errors.protein"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.protein"
            type="number"
            step="any"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="0"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Karbohidrat (g)"
        id="carbohydrate"
        required
        :error="errors.carbohydrate"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.carbohydrate"
            type="number"
            step="any"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="0"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Lemak (g)"
        id="fat"
        :error="errors.fat"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.fat"
            type="number"
            step="any"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="0"
          />
        </template>
      </BaseFormGroup>
    </div>

    <!-- ── Form Actions ── -->
    <div class="form-actions">
      <button type="button" class="btn-outlined" @click="$emit('cancel')">Batal</button>
      <button type="submit" class="btn-primary" :disabled="!isFormValid || loading">
        <span v-if="loading" class="material-symbols-outlined spinning">sync</span>
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { z } from 'zod'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import type { Ingredient, IngredientForm } from '@/types/ingredient'

// ── Props & Emits ─────────────────────────────────────────────
const props = defineProps<{
  initialData?: Ingredient | null
  loading?: boolean
  submitText?: string
}>()

const emit = defineEmits<{
  (e: 'submit', data: IngredientForm): void
  (e: 'cancel'): void
}>()

// ── Validation Schema ─────────────────────────────────────────
const schema = z.object({
  name: z.string().min(1, 'Nama bahan wajib diisi'),
  serving_weight: z.number({ message: 'Berat acuan harus berupa angka' }).min(1, 'Berat acuan minimal 1 gram'),
  description: z.string().max(1000).optional().or(z.literal('')),
  calorie: z.number({ message: 'Kalori harus berupa angka' }).min(0, 'Kalori tidak boleh negatif'),
  protein: z.number({ message: 'Protein harus berupa angka' }).min(0, 'Protein tidak boleh negatif'),
  carbohydrate: z.number({ message: 'Karbohidrat harus berupa angka' }).min(0, 'Karbohidrat tidak boleh negatif'),
  fat: z.number({ message: 'Lemak harus berupa angka' }).min(0, 'Lemak tidak boleh negatif').optional().default(0),
})

// ── Form State ────────────────────────────────────────────────
type BahanFormData = {
  name: string
  serving_weight: number
  description: string
  calorie: number
  protein: number
  carbohydrate: number
  fat: number
}

const getDefaultForm = (): BahanFormData => ({
  name: '',
  serving_weight: 100,
  description: '',
  calorie: 0,
  protein: 0,
  carbohydrate: 0,
  fat: 0,
})

const formData = ref<BahanFormData>(getDefaultForm())
const errors = ref<Record<string, string>>({})
const isFormValid = ref(false)

// ── Watch initial data (edit mode) ────────────────────────────
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = {
      name: newData.name,
      serving_weight: newData.serving_weight,
      description: newData.description ?? '',
      calorie: newData.calorie,
      protein: newData.protein,
      carbohydrate: newData.carbohydrate,
      fat: newData.fat,
    }
  } else {
    formData.value = getDefaultForm()
  }
  errors.value = {}
}, { immediate: true })

// ── Silent validation (enable/disable submit button) ──────────
watch(formData, () => {
  const result = schema.safeParse(formData.value)
  isFormValid.value = result.success
}, { deep: true })

// ── Full validation (shows error messages) ────────────────────
const validate = (): boolean => {
  try {
    schema.parse(formData.value)
    errors.value = {}
    return true
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      err.issues.forEach(e => {
        const pathKey = e.path[0]
        if (pathKey !== undefined) {
          fieldErrors[pathKey.toString()] = e.message
        }
      })
      errors.value = fieldErrors
    }
    return false
  }
}

// ── Submit handler ────────────────────────────────────────────
const handleSubmit = () => {
  if (validate()) {
    const payload: IngredientForm = {
      name: formData.value.name,
      serving_weight: formData.value.serving_weight,
      calorie: formData.value.calorie,
      protein: formData.value.protein,
      carbohydrate: formData.value.carbohydrate,
      fat: formData.value.fat,
      description: formData.value.description || undefined,
    }
    emit('submit', payload)
  }
}
</script>

<style scoped lang="scss">
.section-title {
  font-size: $text-md;
  font-weight: 600;
  margin-bottom: $space-4;
  color: $color-text-primary;
  border-bottom: 1px solid $color-border;
  padding-bottom: $space-2;

  &:not(:first-child) {
    margin-top: $space-6;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
  margin-bottom: $space-4;

  &__full {
    grid-column: 1 / -1;
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.form-control {
  width: 100%;
  padding: $space-2 $space-3;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-family: $font-body;
  font-size: $text-sm;
  color: $color-text-primary;
  background-color: $color-bg-surface;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &::placeholder {
    color: $color-text-faint;
  }

  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-muted;
  }

  &[aria-invalid="true"] {
    border-color: $color-danger;

    &:focus {
      box-shadow: 0 0 0 3px $color-danger-bg;
    }
  }

  &--textarea {
    resize: vertical;
    min-height: 60px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: $space-3;
  margin-top: $space-6;
  padding-top: $space-4;
  border-top: 1px solid $color-border;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
