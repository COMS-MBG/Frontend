<template>
  <BaseModal
    v-model="isOpenModel"
    :title="isEdit ? 'Edit Sekolah Mitra' : 'Tambah Sekolah Mitra'"
    size="md"
    @close="onClose"
  >
    <!-- API-level error banner (e.g. 500, network) -->
    <BaseAlert
      :show="!!apiError"
      :message="apiError"
      variant="error"
      dismissible
      @update:show="apiError = ''"
      style="margin-bottom: 1rem;"
    />

    <form @submit.prevent="onSubmit" class="partner-form">
      <BaseFormGroup label="Nama Sekolah" id="school_name" required :error="errors.school_name">
        <BaseInput
          id="school_name"
          v-model="formData.school_name"
          placeholder="Masukkan nama sekolah"
          :error="errors.school_name || undefined"
          :disabled="isSubmitting"
        />
      </BaseFormGroup>

      <div class="form-row">
        <BaseFormGroup label="NPSN" id="npsn" help-text="Nomor Pokok Sekolah Nasional" :error="errors.npsn">
          <BaseInput
            id="npsn"
            v-model="formData.npsn"
            placeholder="Contoh: 20219157"
            :error="errors.npsn || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
        <BaseFormGroup label="Jumlah Porsi" id="portion_count" required :error="errors.portion_count">
          <BaseInput
            id="portion_count"
            type="number"
            v-model="formData.portion_count"
            placeholder="0"
            :error="errors.portion_count || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
      </div>

      <div class="form-row">
        <BaseFormGroup label="Bentuk Sekolah" id="school_type" required>
          <template #default>
            <AppSelect
              :model-value="formData.school_type"
              :options="bentukOptions"
              placeholder="Pilih bentuk"
              :error="errors.school_type"
              @update:model-value="formData.school_type = String($event ?? '')"
            />
          </template>
        </BaseFormGroup>
        <BaseFormGroup label="Status" id="ownership_status" required>
          <template #default>
            <AppSelect
              :model-value="formData.ownership_status"
              :options="statusOptions"
              placeholder="Pilih status"
              :error="errors.ownership_status"
              @update:model-value="formData.ownership_status = String($event ?? '')"
            />
          </template>
        </BaseFormGroup>
      </div>

      <BaseFormGroup label="Alamat" id="address" :error="errors.address">
        <BaseInput
          id="address"
          v-model="formData.address"
          placeholder="Jl. ..."
          :error="errors.address || undefined"
          :disabled="isSubmitting"
        />
      </BaseFormGroup>

      <div class="form-row">
        <BaseFormGroup label="Kecamatan" id="district" :error="errors.district">
          <BaseInput
            id="district"
            v-model="formData.district"
            placeholder="Nama kecamatan"
            :error="errors.district || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
        <BaseFormGroup label="Kabupaten/Kota" id="city" :error="errors.city">
          <BaseInput
            id="city"
            v-model="formData.city"
            placeholder="Nama kabupaten/kota"
            :error="errors.city || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
      </div>

      <!-- ── Location Coordinates ── -->
      <div class="form-section">
        <p class="form-section__title">
          <span class="form-section__badge">Opsional</span>
        </p>
        <div class="form-row">
          <BaseFormGroup label="Latitude" id="latitude" help-text="-90 s/d 90" :error="errors.latitude">
            <BaseInput
              id="latitude"
              type="number"
              step="0.0000001"
              v-model="formData.latitude"
              placeholder="-6.9175"
              :error="errors.latitude || undefined"
              :disabled="isSubmitting"
            />
          </BaseFormGroup>
          <BaseFormGroup label="Longitude" id="longitude" help-text="-180 s/d 180" :error="errors.longitude">
            <BaseInput
              id="longitude"
              type="number"
              step="0.0000001"
              v-model="formData.longitude"
              placeholder="107.6191"
              :error="errors.longitude || undefined"
              :disabled="isSubmitting"
            />
          </BaseFormGroup>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn-secondary" @click="onClose" :disabled="isSubmitting">Batal</button>
      <button class="btn-primary btn-with-icon" @click="onSubmit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="material-symbols-outlined spinning">sync</span>
        {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Partner') }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'
import type { AxiosError } from 'axios'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { Partner } from '@/types/partner'
import type { SelectOption } from '@/types/form'
import { partnerSchema } from '@/validation/partner.schema'

// ── Types ──
interface FormErrors {
  school_name: string; npsn: string; school_type: string; ownership_status: string
  address: string; district: string; city: string
  latitude: string; longitude: string; portion_count: string
}
const emptyErrors = (): FormErrors =>
  ({ school_name: '', npsn: '', school_type: '', ownership_status: '', address: '', district: '', city: '', latitude: '', longitude: '', portion_count: '' })

// ── Props / Emits ──
const props = defineProps<{
  isOpen: boolean
  initialData?: Partner | null
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', data: Partial<Partner>): void
}>()

// ── Computed ──
const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})
const isEdit      = computed(() => !!props.initialData)
const isSubmitting = computed(() => props.isSubmitting ?? false)

// ── Form State ──
const formData = reactive({
  school_name: '', npsn: '', school_type: '', ownership_status: '',
  address: '', district: '', city: '',
  latitude: null as number | null, longitude: null as number | null,
  portion_count: 0 as number | null,
})
const errors: FormErrors = reactive(emptyErrors())
const apiError = ref('')

// ── Options ──
const bentukOptions: SelectOption[] = [
  { label: 'SMA', value: 'SMA' }, { label: 'SMK', value: 'SMK' },
  { label: 'MA',  value: 'MA'  }, { label: 'MAK', value: 'MAK' },
  { label: 'SD',  value: 'SD'  }, { label: 'SMP', value: 'SMP' },
  { label: 'MI',  value: 'MI'  }, { label: 'MTs', value: 'MTs' },
]
const statusOptions: SelectOption[] = [
  { label: 'Negeri', value: 'public' },
  { label: 'Swasta', value: 'private' },
]

// ── Populate form when modal opens ──
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    apiError.value = ''
    Object.assign(errors, emptyErrors())
    if (props.initialData) {
      formData.school_name      = props.initialData.school_name
      formData.npsn             = props.initialData.npsn || ''
      formData.school_type      = props.initialData.school_type
      formData.ownership_status = props.initialData.ownership_status
      formData.address          = props.initialData.address || ''
      formData.district         = props.initialData.district || ''
      formData.city             = props.initialData.city || ''
      formData.latitude         = partnerCoordinates('lat')
      formData.longitude        = partnerCoordinates('lng')
      formData.portion_count    = props.initialData.portion_count
    } else {
      formData.school_name = ''; formData.npsn = ''; formData.school_type = ''
      formData.ownership_status = ''; formData.address = ''; formData.district = ''
      formData.city = ''; formData.latitude = null; formData.longitude = null
      formData.portion_count = 0
    }
  }
})

// Extract coordinates safely
function partnerCoordinates(type: 'lat' | 'lng'): number | null {
  if (!props.initialData) return null
  if (type === 'lat') return props.initialData.latitude ?? null
  return props.initialData.longitude ?? null
}

// ── Client-side validation ──
function validate(): boolean {
  Object.assign(errors, emptyErrors())
  const result = partnerSchema.safeParse({
    ...formData,
    portion_count: Number(formData.portion_count) || 0,
    latitude:  formData.latitude  !== null ? Number(formData.latitude)  : null,
    longitude: formData.longitude !== null ? Number(formData.longitude) : null,
  })
  if (result.success) return true
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof FormErrors | undefined
    if (field && field in errors) errors[field] = issue.message
  }
  return false
}

// ── Map 422 backend errors → field errors ──
function applyServerErrors(err: unknown): void {
  const axiosErr = err as AxiosError<{ errors?: Record<string, string[]> }>
  if (axiosErr.response?.status === 422) {
    const serverErrors = axiosErr.response.data?.errors ?? {}
    Object.assign(errors, emptyErrors())
    for (const [field, messages] of Object.entries(serverErrors)) {
      const key = field as keyof FormErrors
      if (key in errors) errors[key] = messages[0] ?? ''
    }
  } else {
    apiError.value = 'Terjadi kesalahan. Silakan coba lagi.'
  }
}

// ── Submit ──
function onSubmit(): void {
  if (isSubmitting.value) return
  if (!validate()) return

  emit('submit', {
    id:               props.initialData?.id,
    school_name:      formData.school_name,
    npsn:             formData.npsn || null,
    school_type:      formData.school_type as Partner['school_type'],
    ownership_status: formData.ownership_status as Partner['ownership_status'],
    address:          formData.address || null,
    district:         formData.district || null,
    city:             formData.city || null,
    latitude:         formData.latitude  !== null ? Number(formData.latitude)  : null,
    longitude:        formData.longitude !== null ? Number(formData.longitude) : null,
    portion_count:    Number(formData.portion_count) || 0,
  })
}

// Close handler
function onClose(): void {
  emit('update:isOpen', false)
}

// Expose so parent can push server errors back in
defineExpose({ applyServerErrors })
</script>

<style scoped lang="scss">
.partner-form {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}
.form-section {
  margin-top: $space-3;
  padding-top: $space-3;
  border-top: 1px solid $color-border-light;

  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: 700;
    color: $color-text-secondary;
    margin: 0 0 $space-3;

    .material-symbols-outlined {
      font-size: 1.1rem;
      color: $color-primary;
    }
  }

  &__badge {
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-muted;
    background: $color-bg-subtle;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: auto;
  }
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
}
.spinning {
  animation: spin 1s linear infinite;
  font-size: 1rem;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

@include mobile {
  .form-row { grid-template-columns: 1fr; gap: 0; }
}
</style>
