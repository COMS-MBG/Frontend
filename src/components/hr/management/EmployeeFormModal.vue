<template>
  <BaseModal
    v-model="isOpenModel"
    :title="isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru'"
    size="md"
    @close="onClose"
  >
    <form @submit.prevent="onSubmit" class="employee-form">
      <!-- Nama Lengkap -->
      <BaseFormGroup label="Nama Lengkap" id="emp-name" required :error="errors.name">
        <BaseInput id="emp-name" v-model="formData.name" placeholder="Masukkan nama lengkap" :error="errors.name || undefined" />
      </BaseFormGroup>

      <div class="form-row">
        <!-- NIK -->
        <BaseFormGroup label="NIK" id="emp-nik" :error="errors.nik">
          <BaseInput id="emp-nik" v-model="formData.nik" placeholder="16 digit NIK" :error="errors.nik || undefined" />
        </BaseFormGroup>

        <!-- Phone -->
        <BaseFormGroup label="No. Telepon" id="emp-phone" :error="errors.phone">
          <BaseInput id="emp-phone" v-model="formData.phone" placeholder="08xxxxxxxxxx" :error="errors.phone || undefined" />
        </BaseFormGroup>
      </div>

      <div class="form-row">
        <!-- Position -->
        <BaseFormGroup label="Posisi / Jabatan" id="emp-position" required :error="errors.position">
          <AppSelect
            :model-value="formData.position"
            :options="positionOptions"
            placeholder="Pilih posisi"
            :error="errors.position || undefined"
            @update:model-value="formData.position = String($event ?? '')"
          />
        </BaseFormGroup>
      </div>

      <!-- Address -->
      <BaseFormGroup label="Alamat" id="emp-address">
        <BaseInput id="emp-address" v-model="formData.address" placeholder="Alamat karyawan" />
      </BaseFormGroup>
    </form>

    <template #footer>
      <button class="btn-secondary" type="button" @click="onClose">Batal</button>
      <button class="btn-primary btn-with-icon" type="button" :disabled="isSubmitting" @click="onSubmit">
        <span v-if="isSubmitting" class="material-symbols-outlined employee-form__spinner">progress_activity</span>
        {{ isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { Employee, EmployeeCreateForm } from '@/types/employee'
import type { SelectOption } from '@/types/form'

const props = defineProps<{
  isOpen: boolean
  initialData?: Employee | null
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', data: EmployeeCreateForm): void
}>()

const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})

const isEdit = computed(() => !!props.initialData)

const formData = reactive({
  name: '',
  nik: '',
  position: '',
  phone: '',
  address: '',
})

interface FormErrors {
  name: string
  nik: string
  position: string
  phone: string
}
const emptyErrors = (): FormErrors => ({ name: '', nik: '', position: '', phone: '' })
const errors: FormErrors = reactive(emptyErrors())

const positionOptions: SelectOption[] = [
  { label: 'Pemilik', value: 'pemilik' },
  { label: 'Manajer', value: 'manajer' },
  { label: 'Ahli Gizi', value: 'ahli_gizi' },
  { label: 'Admin Logistik', value: 'admin_logistik' },
  { label: 'Kurir', value: 'kurir' },
  { label: 'Karyawan Operasional', value: 'karyawan_operasional' },
]

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.initialData) {
      formData.name = props.initialData.name
      formData.nik = props.initialData.nik ?? ''
      formData.position = props.initialData.position
      formData.phone = props.initialData.phone ?? ''
      formData.address = props.initialData.address ?? ''
    } else {
      formData.name = ''
      formData.nik = ''
      formData.position = ''
      formData.phone = ''
      formData.address = ''
    }
    Object.assign(errors, emptyErrors())
  }
})

const nikRegex = /^[0-9]*$/

function validate(): boolean {
  Object.assign(errors, emptyErrors())
  let valid = true

  if (!formData.name.trim()) { errors.name = 'Nama wajib diisi'; valid = false }
  if (!formData.position) { errors.position = 'Posisi wajib dipilih'; valid = false }
  if (formData.nik && (formData.nik.length !== 16 || !nikRegex.test(formData.nik))) {
    errors.nik = 'NIK harus 16 digit angka'; valid = false
  }

  return valid
}

function onSubmit() {
  if (validate()) {
    const payload: Partial<EmployeeCreateForm> = {
      name: formData.name,
      position: formData.position,
    }
    // Only include optional fields if they have actual values
    if (formData.nik) payload.nik = formData.nik
    if (formData.phone) payload.phone = formData.phone
    if (formData.address) payload.address = formData.address

    emit('submit', payload as EmployeeCreateForm)
  }
}

function onClose() { emit('update:isOpen', false) }
</script>

<style scoped lang="scss">
.employee-form {
  display: flex; flex-direction: column; gap: $space-2;
  &__spinner { animation: spin 1s linear infinite; font-size: 1.1rem; }
}
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: $space-4; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@include mobile { .form-row { grid-template-columns: 1fr; gap: 0; } }
</style>
