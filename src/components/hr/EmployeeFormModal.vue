<template>
  <BaseModal
    v-model="isOpenModel"
    :title="isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru'"
    size="md"
    @close="onClose"
  >
    <form @submit.prevent="onSubmit" class="employee-form">
        <BaseFormGroup
          label="Nama Lengkap"
          id="nama"
          required
          :error="errors.nama"
        >
          <BaseInput
            id="nama"
            v-model="formData.nama"
            placeholder="Masukkan nama lengkap"
            :error="errors.nama || undefined"
          />
        </BaseFormGroup>

        <div class="form-row">
          <BaseFormGroup
            label="NRP / NIDN"
            id="nrp"
            required
            :error="errors.nrp"
          >
            <BaseInput
              id="nrp"
              v-model="formData.nrp"
              placeholder="Contoh: 1029381"
              :error="errors.nrp || undefined"
            />
          </BaseFormGroup>

          <BaseFormGroup
            label="Email"
            id="email"
            required
            :error="errors.email"
          >
            <BaseInput
              id="email"
              type="email"
              v-model="formData.email"
              placeholder="contoh@coms.com"
              :error="errors.email || undefined"
            />
          </BaseFormGroup>
        </div>

        <div class="form-row">
          <BaseFormGroup
            label="Jabatan"
            id="jabatan"
            required
            :error="errors.jabatan"
          >
            <BaseInput
              id="jabatan"
              v-model="formData.jabatan"
              placeholder="Masukkan jabatan"
              :error="errors.jabatan || undefined"
            />
          </BaseFormGroup>

          <BaseFormGroup
            label="Departemen"
            id="departemen"
            required
            :error="errors.departemen"
          >
            <BaseInput
              id="departemen"
              v-model="formData.departemen"
              placeholder="Masukkan departemen"
              :error="errors.departemen || undefined"
            />
          </BaseFormGroup>
        </div>

        <BaseFormGroup
          label="Role Akses"
          id="role"
          required
          :error="errors.role"
        >
          <BaseSelect
            id="role"
            :model-value="formData.role"
            :options="roleOptions"
            placeholder="Pilih role"
            :error="!!errors.role"
            @update:model-value="formData.role = String($event ?? '')"
          />
        </BaseFormGroup>
      </form>

    <template #footer>
      <button class="btn-secondary" @click="onClose">Batal</button>
      <button class="btn-primary" @click="onSubmit">
        {{ isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan' }}
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
import BaseSelect from '@/components/common/BaseSelect.vue'
import type { Employee } from '@/types/employee'
import type { SelectOption } from '@/types/form'
import { employeeSchema as schema } from '@/validation/employee.schema'

/** Typed error shape for the modal form fields. */
interface FormErrors {
  nama: string
  nrp: string
  email: string
  jabatan: string
  departemen: string
  role: string
}

const emptyErrors = (): FormErrors => ({
  nama: '',
  nrp: '',
  email: '',
  jabatan: '',
  departemen: '',
  role: '',
})

const props = defineProps<{
  isOpen: boolean
  initialData?: Employee | null
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', data: Partial<Employee>): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val)
})

const isEdit = computed(() => !!props.initialData)

const formData = reactive({
  nama: '',
  nrp: '',
  email: '',
  jabatan: '',
  departemen: '',
  role: '',
})

const errors: FormErrors = reactive(emptyErrors())

const roleOptions: SelectOption[] = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Operator', value: 'Operator' },
  { label: 'Viewer', value: 'Viewer' },
]

// Reset and populate form
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.nama = props.initialData.nama
      formData.nrp = props.initialData.nrp
      formData.email = props.initialData.email
      formData.jabatan = props.initialData.jabatan
      formData.departemen = props.initialData.departemen
      formData.role = props.initialData.role
    } else {
      formData.nama = ''
      formData.nrp = ''
      formData.email = ''
      formData.jabatan = ''
      formData.departemen = ''
      formData.role = ''
    }
    Object.assign(errors, emptyErrors())
  }
})

const validate = (): boolean => {
  Object.assign(errors, emptyErrors())

  const result = schema.safeParse(formData)
  if (result.success) return true

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof FormErrors | undefined
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
      nrp: formData.nrp,
      email: formData.email,
      jabatan: formData.jabatan,
      departemen: formData.departemen,
      role: formData.role as Employee['role'],
      isActive: props.initialData?.isActive ?? true,
    })
    emit('update:isOpen', false)
  }
}

const onClose = () => {
  emit('update:isOpen', false)
}
</script>

<style scoped lang="scss">
.employee-form {
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
