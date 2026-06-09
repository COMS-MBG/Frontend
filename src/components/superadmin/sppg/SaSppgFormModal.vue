<template>
  <BaseModal v-model="open" :title="isEditing ? 'Edit SPPG' : 'Tambah SPPG'" size="lg">
    <form @submit.prevent="$emit('submit')" class="sa-sppg-form">
      <BaseFormGroup label="Nama SPPG" required>
        <BaseInput :model-value="form.name" @update:model-value="update('name', String($event ?? ''))" placeholder="Nama SPPG" />
      </BaseFormGroup>
      <BaseFormGroup label="Alamat">
        <BaseInput :model-value="form.address" @update:model-value="update('address', String($event ?? ''))" placeholder="Alamat lengkap" />
      </BaseFormGroup>
      <div class="sa-sppg-form__row">
        <BaseFormGroup label="Kota" required>
          <BaseInput :model-value="form.city" @update:model-value="update('city', String($event ?? ''))" placeholder="Kota" />
        </BaseFormGroup>
        <BaseFormGroup label="Provinsi">
          <BaseInput :model-value="form.province" @update:model-value="update('province', String($event ?? ''))" placeholder="Provinsi" />
        </BaseFormGroup>
      </div>
      <div class="sa-sppg-form__row">
        <BaseFormGroup label="Latitude">
          <BaseInput :model-value="form.latitude" @update:model-value="update('latitude', String($event ?? ''))" type="number" placeholder="-6.xxx" />
        </BaseFormGroup>
        <BaseFormGroup label="Longitude">
          <BaseInput :model-value="form.longitude" @update:model-value="update('longitude', String($event ?? ''))" type="number" placeholder="106.xxx" />
        </BaseFormGroup>
        <BaseFormGroup label="Kapasitas" required>
          <BaseInput :model-value="form.capacity" @update:model-value="update('capacity', String($event ?? ''))" type="number" placeholder="0" />
        </BaseFormGroup>
      </div>
    </form>

    <template #footer>
      <button class="btn-secondary" type="button" @click="open = false" :disabled="isSubmitting">Batal</button>
      <button class="btn-primary btn-with-icon" type="button" :disabled="isSubmitting" @click="$emit('submit')">
        <span v-if="isSubmitting" class="material-symbols-outlined is-spinning">sync</span>
        <span v-else class="material-symbols-outlined">save</span>
        {{ isEditing ? 'Simpan Perubahan' : 'Tambah SPPG' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BaseInput from '@/components/common/BaseInput.vue'

interface SppgForm {
  name: string
  address: string
  city: string
  province: string
  latitude: string
  longitude: string
  capacity: string
}

const props = defineProps<{
  modelValue: boolean
  form: SppgForm
  isEditing: boolean
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:form', value: SppgForm): void
  (e: 'submit'): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function update(key: keyof SppgForm, value: string) {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<style scoped lang="scss">
.sa-sppg-form {
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
