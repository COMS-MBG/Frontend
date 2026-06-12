<template>
  <BaseModal v-model="open" :title="isEditing ? 'Edit Sekolah' : 'Tambah Sekolah'" size="lg">
    <form @submit.prevent="$emit('submit')" class="sa-school-form">
      <div class="sa-school-form__row">
        <BaseFormGroup label="Nama Sekolah" required>
          <BaseInput :model-value="form.school_name" @update:model-value="update('school_name', String($event ?? ''))" placeholder="Nama sekolah" />
        </BaseFormGroup>
        <BaseFormGroup label="NPSN">
          <BaseInput :model-value="form.npsn" @update:model-value="update('npsn', String($event ?? ''))" placeholder="NPSN" />
        </BaseFormGroup>
      </div>
      <div class="sa-school-form__row">
        <BaseFormGroup label="Jenis Sekolah">
          <BaseInput :model-value="form.school_type" @update:model-value="update('school_type', String($event ?? ''))" placeholder="SMA / SMK / MA" />
        </BaseFormGroup>
        <BaseFormGroup label="Status Kepemilikan">
          <BaseInput :model-value="form.ownership_status" @update:model-value="update('ownership_status', String($event ?? ''))" placeholder="Negeri / Swasta" />
        </BaseFormGroup>
      </div>
      <BaseFormGroup label="Alamat">
        <BaseInput :model-value="form.address" @update:model-value="update('address', String($event ?? ''))" placeholder="Alamat lengkap" />
      </BaseFormGroup>
      <div class="sa-school-form__row">
        <BaseFormGroup label="Kecamatan">
          <BaseInput :model-value="form.district" @update:model-value="update('district', String($event ?? ''))" placeholder="Kecamatan" />
        </BaseFormGroup>
        <BaseFormGroup label="Kota" required>
          <BaseInput :model-value="form.city" @update:model-value="update('city', String($event ?? ''))" placeholder="Kota" />
        </BaseFormGroup>
        <BaseFormGroup label="Provinsi">
          <BaseInput :model-value="form.province" @update:model-value="update('province', String($event ?? ''))" placeholder="Provinsi" />
        </BaseFormGroup>
      </div>
      <div class="sa-school-form__row">
        <BaseFormGroup label="Latitude">
          <BaseInput :model-value="form.latitude" @update:model-value="update('latitude', String($event ?? ''))" type="number" placeholder="-6.xxx" />
        </BaseFormGroup>
        <BaseFormGroup label="Longitude">
          <BaseInput :model-value="form.longitude" @update:model-value="update('longitude', String($event ?? ''))" type="number" placeholder="106.xxx" />
        </BaseFormGroup>
        <BaseFormGroup label="Jumlah Porsi" required>
          <BaseInput :model-value="form.portion_count" @update:model-value="update('portion_count', String($event ?? ''))" type="number" placeholder="0" />
        </BaseFormGroup>
      </div>
    </form>

    <template #footer>
      <button class="btn-secondary" type="button" @click="open = false" :disabled="isSubmitting">Batal</button>
      <button class="btn-primary btn-with-icon" type="button" :disabled="isSubmitting" @click="$emit('submit')">
        <span v-if="isSubmitting" class="material-symbols-outlined is-spinning">sync</span>
        <span v-else class="material-symbols-outlined">save</span>
        {{ isEditing ? 'Simpan Perubahan' : 'Tambah Sekolah' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BaseInput from '@/components/common/BaseInput.vue'

export interface SchoolForm {
  school_name: string
  npsn: string
  school_type: string
  ownership_status: string
  address: string
  district: string
  city: string
  province: string
  latitude: string
  longitude: string
  portion_count: string
}

const props = defineProps<{
  modelValue: boolean
  form: SchoolForm
  isEditing: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:form', value: SchoolForm): void
  (e: 'submit'): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function update(key: keyof SchoolForm, value: string) {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<style scoped lang="scss">
.sa-school-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: $space-4;
  }
}
</style>
