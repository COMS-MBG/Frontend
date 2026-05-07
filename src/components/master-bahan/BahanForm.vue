<template>
  <form @submit.prevent="handleSubmit" class="bahan-form">
    <!-- ── Section 1: Informasi Dasar ── -->
    <div class="section-title">Informasi Dasar</div>

    <div class="form-grid">
      <BaseFormGroup
        label="Nama Bahan"
        id="nama"
        required
        :error="errors.nama"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model="formData.nama"
            :id="id"
            :aria-describedby="describedby"
            :aria-invalid="invalid"
            class="form-control"
            placeholder="Masukkan nama bahan"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Satuan"
        id="satuan"
        required
      >
        <template #default>
          <AppSelect
            v-model="formData.satuan"
            :options="satuanOptions"
            placeholder="Pilih satuan"
            :error="errors.satuan"
          />
        </template>
      </BaseFormGroup>

      <BaseFormGroup
        label="Status"
        id="status"
        required
      >
        <template #default>
          <AppSelect
            v-model="formData.status"
            :options="statusOptions"
            placeholder="Pilih status"
            :error="errors.status"
          />
        </template>
      </BaseFormGroup>
    </div>

    <!-- ── Section 2: Kandungan Nutrisi ── -->
    <div class="section-title">Kandungan Nutrisi</div>

    <div class="form-grid">
      <BaseFormGroup
        label="Kalori (kkal)"
        id="kalori"
        required
        :error="errors.kalori"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.kalori"
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
        id="karbohidrat"
        required
        :error="errors.karbohidrat"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.karbohidrat"
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
        id="lemak"
        required
        :error="errors.lemak"
      >
        <template #default="{ id, describedby, invalid }">
          <input
            v-model.number="formData.lemak"
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
import AppSelect from '@/components/common/AppSelect.vue'
import type { BahanItem } from '@/types/gizi'

// ── Select Options ────────────────────────────────────────────
const satuanOptions = [
  { label: 'Kg', value: 'kg' },
  { label: 'Liter', value: 'liter' },
  { label: 'Pcs', value: 'pcs' },
]

const statusOptions = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Nonaktif', value: 'nonaktif' },
]

// ── Props & Emits ─────────────────────────────────────────────
const props = defineProps<{
  initialData?: BahanItem | null
  loading?: boolean
  submitText?: string
}>()

const emit = defineEmits<{
  (e: 'submit', data: Omit<BahanItem, 'id'>): void
  (e: 'cancel'): void
}>()

// ── Validation Schema ─────────────────────────────────────────
const schema = z.object({
  nama: z.string().min(1, 'Nama bahan wajib diisi'),
  satuan: z.enum(['kg', 'liter', 'pcs'] as const, { message: 'Satuan wajib dipilih' }),
  status: z.enum(['aktif', 'nonaktif'] as const, { message: 'Status wajib dipilih' }),
  kalori: z.number({ message: 'Kalori harus berupa angka' }).min(0, 'Kalori tidak boleh negatif'),
  protein: z.number({ message: 'Protein harus berupa angka' }).min(0, 'Protein tidak boleh negatif'),
  karbohidrat: z.number({ message: 'Karbohidrat harus berupa angka' }).min(0, 'Karbohidrat tidak boleh negatif'),
  lemak: z.number({ message: 'Lemak harus berupa angka' }).min(0, 'Lemak tidak boleh negatif'),
})

// ── Form State ────────────────────────────────────────────────
type BahanFormData = {
  nama: string
  satuan: string | null
  status: string | null
  kalori: number
  protein: number
  karbohidrat: number
  lemak: number
}

const getDefaultForm = (): BahanFormData => ({
  nama: '',
  satuan: null,
  status: 'aktif',
  kalori: 0,
  protein: 0,
  karbohidrat: 0,
  lemak: 0,
})

const formData = ref<BahanFormData>(getDefaultForm())
const errors = ref<Record<string, string>>({})
const isFormValid = ref(false)

// ── Watch initial data (edit mode) ────────────────────────────
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.value = {
      nama: newData.nama,
      satuan: newData.satuan,
      status: newData.status,
      kalori: newData.kalori,
      protein: newData.protein,
      karbohidrat: newData.karbohidrat,
      lemak: newData.lemak,
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
    emit('submit', formData.value as Omit<BahanItem, 'id'>)
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
