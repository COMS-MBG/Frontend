<template>
  <BaseModal
    v-model="isOpenModel"
    :title="`Assign Role — ${employee?.name ?? ''}`"
    size="sm"
    @close="$emit('cancel')"
  >
    <div class="assign-role-modal">
      <div v-if="employee?.role?.name && employee.role.name !== 'Tanpa Akses'" class="assign-role-modal__current">
        <span class="assign-role-modal__label">Role saat ini:</span>
        <BaseBadge :text="employee.role.name" variant="info" />
      </div>

      <BaseFormGroup label="Pilih Role Baru" id="assign-role-select" required :error="errorMessage">
        <AppSelect
          :model-value="selectedRoleId"
          :options="roleSelectOptions"
          placeholder="Pilih role"
          :error="errorMessage || undefined"
          @update:model-value="selectedRoleId = $event as number | null"
        />
      </BaseFormGroup>
    </div>

    <template #footer>
      <button class="btn-secondary" type="button" @click="$emit('cancel')">Batal</button>
      <button class="btn-primary btn-with-icon" type="button" :disabled="isSubmitting || !selectedRoleId" @click="onConfirm">
        <span v-if="isSubmitting" class="material-symbols-outlined assign-role-modal__spinner">progress_activity</span>
        Konfirmasi
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseFormGroup from '@/components/common/BaseFormGroup.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import type { Employee, AssignRoleOption, AssignRolePayload } from '@/types/employee'
import type { SelectOption } from '@/types/form'

const props = withDefaults(defineProps<{
  employee: Employee | null
  roleOptions: AssignRoleOption[]
  isSubmitting?: boolean
  modelValue: boolean
}>(), { isSubmitting: false })

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: AssignRolePayload): void
  (e: 'cancel'): void
}>()

const isOpenModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const selectedRoleId = ref<number | null>(null)
const errorMessage = ref('')

const roleSelectOptions = computed<SelectOption[]>(() =>
  props.roleOptions.map((r) => ({ label: r.name, value: r.id })),
)

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    selectedRoleId.value = props.employee?.role?.id ?? null
    errorMessage.value = ''
  }
})

function onConfirm() {
  if (!selectedRoleId.value) {
    errorMessage.value = 'Pilih role terlebih dahulu'
    return
  }
  errorMessage.value = ''
  emit('submit', { role_id: selectedRoleId.value })
}
</script>

<style scoped lang="scss">
.assign-role-modal {
  display: flex; flex-direction: column; gap: $space-4;
  &__current {
    display: flex; align-items: center; gap: $space-3;
    padding: $space-3 $space-4; background-color: $color-bg-subtle;
    border-radius: $radius-md; border: 1px solid $color-border-light;
  }
  &__label { font-size: $text-sm; font-weight: 500; color: $color-text-secondary; }
  &__spinner { animation: spin 1s linear infinite; font-size: 1.1rem; }
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
