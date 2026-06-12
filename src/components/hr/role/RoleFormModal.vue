<template>
  <BaseModal
    v-model="isOpenModel"
    :title="isEdit ? 'Edit Role' : 'Tambah Role Baru'"
    size="md"
    @close="onClose"
  >
    <!-- API-level error banner -->
    <BaseAlert
      :show="!!apiError"
      :message="apiError"
      variant="error"
      dismissible
      @update:show="apiError = ''"
      style="margin-bottom: 1rem;"
    />

    <form @submit.prevent="onSubmit" class="role-form">
      <!-- Name -->
      <BaseFormGroup label="Nama Role" id="role-name" required :error="errors.name">
        <BaseInput
          id="role-name"
          v-model="formData.name"
          placeholder="Contoh: Staf Gudang"
          :error="errors.name || undefined"
          :disabled="isSubmitting"
        />
      </BaseFormGroup>

      <!-- Description -->
      <BaseFormGroup label="Deskripsi" id="role-description" :error="errors.description">
        <BaseInput
          id="role-description"
          v-model="formData.description"
          placeholder="Deskripsi singkat fungsi role ini"
          :error="errors.description || undefined"
          :disabled="isSubmitting"
        />
      </BaseFormGroup>
    </form>

    <template #footer>
      <button class="btn-secondary" @click="onClose" :disabled="isSubmitting">Batal</button>
      <button class="btn-primary btn-with-icon" @click="onSubmit" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="material-symbols-outlined spinning">sync</span>
        {{ isSubmitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Role') }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseAlert from '@/components/common/BaseAlert.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import type { Role } from '@/types/access'
import { roleSchema } from '@/validation/role.schema'

// ── Types ──
interface FormErrors {
  name: string
  description: string
}
const emptyErrors = (): FormErrors => ({ name: '', description: '' })

// ── Props / Emits ──
const props = defineProps<{
  isOpen: boolean
  initialData?: Role | null
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'submit', data: { name: string; description?: string; permissions: number[] }): void
}>()

// ── Computed ──
const isOpenModel = computed({
  get: () => props.isOpen,
  set: (val) => emit('update:isOpen', val),
})
const isEdit = computed(() => !!props.initialData)
const isSubmitting = computed(() => props.isSubmitting ?? false)

// ── Form State ──
const formData = reactive({
  name: '',
  description: '',
  permissions: [] as number[],
})
const errors: FormErrors = reactive(emptyErrors())
const apiError = ref('')

// ── Populate form when modal opens ──
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    apiError.value = ''
    Object.assign(errors, emptyErrors())
    if (props.initialData) {
      formData.name = props.initialData.name
      formData.description = props.initialData.description ?? ''
      formData.permissions = props.initialData.permissions.map((p) => p.id)
    } else {
      formData.name = ''
      formData.description = ''
      formData.permissions = []
    }
  }
})

// ── Client-side validation ──
function validate(): boolean {
  Object.assign(errors, emptyErrors())
  const result = roleSchema.safeParse({
    name: formData.name,
    description: formData.description || undefined,
    permissions: formData.permissions,
  })
  if (result.success) return true
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof FormErrors | undefined
    if (field && field in errors) errors[field] = issue.message
  }
  return false
}

// ── Submit ──
function onSubmit(): void {
  if (isSubmitting.value) return
  if (!validate()) return

  emit('submit', {
    name: formData.name,
    description: formData.description || undefined,
    permissions: formData.permissions,
  })
}

function onClose(): void {
  emit('update:isOpen', false)
}

// Expose so parent can push server errors back in
function applyServerErrors(err: unknown): void {
  const axiosErr = err as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }
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

defineExpose({ applyServerErrors })
</script>

<style scoped lang="scss">
.role-form {
  display: flex;
  flex-direction: column;
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

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
</style>
