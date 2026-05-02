<template>
  <BaseModal
    v-model="isOpenModel"
    :title="isEdit ? 'Edit Resep' : 'Tambah Resep Baru'"
    size="md"
    @close="onClose"
  >
    <form @submit.prevent="onSubmit" class="resep-form">
        <BaseFormGroup 
          label="Nama Resep" 
          id="nama" 
          required 
          :error="errors.nama"
        >
          <BaseInput 
            id="nama" 
            v-model="formData.nama" 
            placeholder="Masukkan nama resep" 
            :error="errors.nama || undefined"
          />
        </BaseFormGroup>

        <div class="form-row">
          <BaseFormGroup 
            label="Kalori (kcal)" 
            id="kalori" 
            required 
            :error="errors.kalori"
          >
            <BaseInput 
              id="kalori" 
              type="number" 
              v-model="formData.kalori" 
              placeholder="0" 
              :error="errors.kalori || undefined"
            />
          </BaseFormGroup>

          <BaseFormGroup 
            label="Protein (g)" 
            id="protein" 
            required 
            :error="errors.protein"
          >
            <BaseInput 
              id="protein" 
              type="number" 
              v-model="formData.protein" 
              placeholder="0" 
              :error="errors.protein || undefined"
            />
          </BaseFormGroup>
        </div>

        <div class="form-row">
          <BaseFormGroup 
            label="Karbohidrat (g)" 
            id="karbohidrat" 
            required 
            :error="errors.karbohidrat"
          >
            <BaseInput 
              id="karbohidrat" 
              type="number" 
              v-model="formData.karbohidrat" 
              placeholder="0" 
              :error="errors.karbohidrat || undefined"
            />
          </BaseFormGroup>

          <BaseFormGroup 
            label="Lemak (g)" 
            id="lemak" 
            required 
            :error="errors.lemak"
          >
            <BaseInput 
              id="lemak" 
              type="number" 
              v-model="formData.lemak" 
              placeholder="0" 
              :error="errors.lemak || undefined"
            />
          </BaseFormGroup>
        </div>
      </form>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Batal</button>
      <button class="btn-primary" @click="onSubmit">
        {{ isEdit ? 'Simpan Perubahan' : 'Tambah Resep' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { z } from 'zod'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import type { ResepItem } from '@/types/resep'

/** Typed error shape for the modal form fields. */
interface ModalFormErrors {
  nama: string
  kalori: string
  protein: string
  karbohidrat: string
  lemak: string
}

const emptyErrors = (): ModalFormErrors => ({
  nama: '',
  kalori: '',
  protein: '',
  karbohidrat: '',
  lemak: '',
})

// ── Zod schema for the modal form ──────────────────────────
const modalSchema = z.object({
  nama: z.string().min(1, { message: 'Nama resep wajib diisi' }),
  kalori: z.coerce.number({ message: 'Kalori tidak valid' }).min(0, { message: 'Kalori tidak valid' }),
  protein: z.coerce.number({ message: 'Protein tidak valid' }).min(0, { message: 'Protein tidak valid' }),
  karbohidrat: z.coerce.number({ message: 'Karbohidrat tidak valid' }).min(0, { message: 'Karbohidrat tidak valid' }),
  lemak: z.coerce.number({ message: 'Lemak tidak valid' }).min(0, { message: 'Lemak tidak valid' }),
})

const props = defineProps<{
  isOpen: boolean
  initialData?: ResepItem | null
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', data: Partial<ResepItem>): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val)
})

const isEdit = computed(() => !!props.initialData)

const formData = reactive({
  nama: '',
  kalori: '' as number | string,
  protein: '' as number | string,
  karbohidrat: '' as number | string,
  lemak: '' as number | string
})

const errors: ModalFormErrors = reactive(emptyErrors())

// Reset and populate form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.nama = props.initialData.nama
      formData.kalori = props.initialData.kalori
      formData.protein = props.initialData.protein
      formData.karbohidrat = props.initialData.karbohidrat
      formData.lemak = props.initialData.lemak
    } else {
      formData.nama = ''
      formData.kalori = ''
      formData.protein = ''
      formData.karbohidrat = ''
      formData.lemak = ''
    }
    Object.assign(errors, emptyErrors())
  }
})

const validate = (): boolean => {
  Object.assign(errors, emptyErrors())

  const result = modalSchema.safeParse(formData)
  if (result.success) return true

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ModalFormErrors | undefined
    if (field && field in errors) {
      errors[field] = issue.message
    }
  }
  return false
}

const onSubmit = () => {
  if (validate()) {
    emit('submit', {
      id: props.initialData?.id,
      nama: formData.nama,
      kalori: Number(formData.kalori),
      protein: Number(formData.protein),
      karbohidrat: Number(formData.karbohidrat),
      lemak: Number(formData.lemak),
      status: props.initialData?.status || 'Sesuai Standar',
      statusVariant: props.initialData?.statusVariant || 'success'
    })
    emit('update:isOpen', false)
  }
}

const onClose = () => {
  emit('update:isOpen', false)
}
</script>

<style scoped lang="scss">
.resep-form {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}

@include mobile {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
