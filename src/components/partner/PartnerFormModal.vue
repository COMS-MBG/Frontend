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
      <BaseFormGroup label="Nama Sekolah" id="nama_sekolah" required :error="errors.nama_sekolah">
        <BaseInput
          id="nama_sekolah"
          v-model="formData.nama_sekolah"
          placeholder="Masukkan nama sekolah"
          :error="errors.nama_sekolah || undefined"
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
        <BaseFormGroup label="Jumlah Porsi" id="jumlah_porsi" required :error="errors.jumlah_porsi">
          <BaseInput
            id="jumlah_porsi"
            type="number"
            v-model="formData.jumlah_porsi"
            placeholder="0"
            :error="errors.jumlah_porsi || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
      </div>

      <div class="form-row">
        <BaseFormGroup label="Bentuk Sekolah" id="bentuk" required :error="errors.bentuk">
          <BaseSelect
            id="bentuk"
            :model-value="formData.bentuk"
            :options="bentukOptions"
            placeholder="Pilih bentuk"
            :error="!!errors.bentuk"
            :disabled="isSubmitting"
            @update:model-value="formData.bentuk = String($event ?? '')"
          />
        </BaseFormGroup>
        <BaseFormGroup label="Status" id="status" required :error="errors.status">
          <BaseSelect
            id="status"
            :model-value="formData.status"
            :options="statusOptions"
            placeholder="Pilih status"
            :error="!!errors.status"
            :disabled="isSubmitting"
            @update:model-value="formData.status = String($event ?? '')"
          />
        </BaseFormGroup>
      </div>

      <BaseFormGroup label="Alamat" id="alamat" :error="errors.alamat">
        <BaseInput
          id="alamat"
          v-model="formData.alamat"
          placeholder="Jl. ..."
          :error="errors.alamat || undefined"
          :disabled="isSubmitting"
        />
      </BaseFormGroup>

      <div class="form-row">
        <BaseFormGroup label="Kecamatan" id="kecamatan" :error="errors.kecamatan">
          <BaseInput
            id="kecamatan"
            v-model="formData.kecamatan"
            placeholder="Nama kecamatan"
            :error="errors.kecamatan || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
        <BaseFormGroup label="Kabupaten/Kota" id="kabupaten_kota" :error="errors.kabupaten_kota">
          <BaseInput
            id="kabupaten_kota"
            v-model="formData.kabupaten_kota"
            placeholder="Nama kabupaten/kota"
            :error="errors.kabupaten_kota || undefined"
            :disabled="isSubmitting"
          />
        </BaseFormGroup>
      </div>

      <!-- ── Location Coordinates ── -->
      <div class="form-section">
        <p class="form-section__title">
          <span class="material-symbols-outlined">location_on</span>
          Informasi Lokasi
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
import BaseSelect from '@/components/common/BaseSelect.vue'
import type { Partner } from '@/types/partner'
import type { SelectOption } from '@/types/form'
import { partnerSchema } from '@/validation/partner.schema'

// ── Types ──
interface FormErrors {
  nama_sekolah: string; npsn: string; bentuk: string; status: string
  alamat: string; kecamatan: string; kabupaten_kota: string
  latitude: string; longitude: string; jumlah_porsi: string
}
const emptyErrors = (): FormErrors =>
  ({ nama_sekolah: '', npsn: '', bentuk: '', status: '', alamat: '', kecamatan: '', kabupaten_kota: '', latitude: '', longitude: '', jumlah_porsi: '' })

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
  nama_sekolah: '', npsn: '', bentuk: '', status: '',
  alamat: '', kecamatan: '', kabupaten_kota: '',
  latitude: null as number | null, longitude: null as number | null,
  jumlah_porsi: 0 as number | null,
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
  { label: 'Negeri', value: 'Negeri' },
  { label: 'Swasta', value: 'Swasta' },
]

// ── Populate form when modal opens ──
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    apiError.value = ''
    Object.assign(errors, emptyErrors())
    if (props.initialData) {
      formData.nama_sekolah   = props.initialData.nama_sekolah
      formData.npsn           = props.initialData.npsn || ''
      formData.bentuk         = props.initialData.bentuk
      formData.status         = props.initialData.status
      formData.alamat         = props.initialData.alamat || ''
      formData.kecamatan      = props.initialData.kecamatan || ''
      formData.kabupaten_kota = props.initialData.kabupaten_kota || ''
      formData.latitude       = props.initialData.latitude ?? null
      formData.longitude      = props.initialData.longitude ?? null
      formData.jumlah_porsi   = props.initialData.jumlah_porsi
    } else {
      formData.nama_sekolah = ''; formData.npsn = ''; formData.bentuk = ''
      formData.status = ''; formData.alamat = ''; formData.kecamatan = ''
      formData.kabupaten_kota = ''; formData.latitude = null; formData.longitude = null
      formData.jumlah_porsi = 0
    }
  }
})

// ── Client-side validation ──
function validate(): boolean {
  Object.assign(errors, emptyErrors())
  const result = partnerSchema.safeParse({
    ...formData,
    jumlah_porsi: Number(formData.jumlah_porsi) || 0,
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
    id:              props.initialData?.id,
    nama_sekolah:   formData.nama_sekolah,
    npsn:           formData.npsn || null,
    bentuk:         formData.bentuk as Partner['bentuk'],
    status:         formData.status as Partner['status'],
    alamat:         formData.alamat || null,
    kecamatan:      formData.kecamatan || null,
    kabupaten_kota: formData.kabupaten_kota || null,
    latitude:       formData.latitude  !== null ? Number(formData.latitude)  : null,
    longitude:      formData.longitude !== null ? Number(formData.longitude) : null,
    jumlah_porsi:   Number(formData.jumlah_porsi) || 0,
  })
}

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
