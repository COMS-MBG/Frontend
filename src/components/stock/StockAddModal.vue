<template>
  <BaseModal
    :model-value="isOpen"
    :title="editItem ? 'Edit Pengajuan Stok' : 'Ajukan Penambahan Stok'"
    size="lg"
    @update:model-value="$emit('close')"
    @close="$emit('close')"
  >
    <form id="stock-add-form" class="stock-form" @submit.prevent="onSubmit" novalidate>
      <!-- Bahan Baku -->
      <div class="form-group form-group--full">
        <label class="form-label" for="stock-ingredient">Bahan Baku <span class="req">*</span></label>
        <select id="stock-ingredient" class="form-select" v-model="form.ingredient_id" :disabled="!!prefillIngredient">
          <option :value="null" disabled>-- Pilih Bahan Baku --</option>
          <option v-for="ing in ingredientOptions" :key="ing.id" :value="ing.id">{{ ing.name }}</option>
        </select>
        <p v-if="errors.ingredient_id" class="form-error">{{ errors.ingredient_id }}</p>
      </div>

      <div class="form-row">
        <!-- Jumlah -->
        <div class="form-group">
          <label class="form-label" for="stock-qty">Jumlah <span class="req">*</span></label>
          <div class="input-addon">
            <input id="stock-qty" type="number" class="form-input" v-model.number="form.quantity" min="0.001" step="0.001" placeholder="0" />
            <select class="addon-select" v-model="form.unit">
              <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          <p v-if="errors.quantity" class="form-error">{{ errors.quantity }}</p>
        </div>

        <!-- Harga Per Satuan -->
        <div class="form-group">
          <label class="form-label" for="stock-price">Harga / Satuan (Rp) <span class="req">*</span></label>
          <input id="stock-price" type="number" class="form-input" v-model.number="form.price_per_unit" min="0" placeholder="0" />
          <p v-if="errors.price_per_unit" class="form-error">{{ errors.price_per_unit }}</p>
        </div>
      </div>

      <div class="form-row">
        <!-- Tanggal Beli -->
        <div class="form-group">
          <label class="form-label" for="stock-purchase-date">Tanggal Pembelian <span class="req">*</span></label>
          <input id="stock-purchase-date" type="date" class="form-input" v-model="form.purchase_date" />
          <p v-if="errors.purchase_date" class="form-error">{{ errors.purchase_date }}</p>
        </div>

        <!-- Tanggal Kadaluarsa -->
        <div class="form-group">
          <label class="form-label" for="stock-expiry-date">Tanggal Kadaluarsa <span class="req">*</span></label>
          <input id="stock-expiry-date" type="date" class="form-input" v-model="form.expiry_date" :min="form.purchase_date" />
          <p v-if="errors.expiry_date" class="form-error">{{ errors.expiry_date }}</p>
        </div>
      </div>

      <div class="form-row">
        <!-- Supplier -->
        <div class="form-group">
          <label class="form-label" for="stock-supplier">Supplier <span class="req">*</span></label>
          <input id="stock-supplier" type="text" class="form-input" v-model="form.supplier" placeholder="Nama supplier..." />
          <p v-if="errors.supplier" class="form-error">{{ errors.supplier }}</p>
        </div>

        <!-- Jenis Penyimpanan -->
        <div class="form-group">
          <label class="form-label" for="stock-storage">Jenis Penyimpanan <span class="req">*</span></label>
          <select id="stock-storage" class="form-select" v-model="form.storage_type">
            <option value="dry">Kering (Dry)</option>
            <option value="chilled">Dingin (Chilled)</option>
            <option value="frozen">Beku (Frozen)</option>
          </select>
          <p v-if="errors.storage_type" class="form-error">{{ errors.storage_type }}</p>
        </div>
      </div>

      <div class="form-row">
        <!-- Lokasi Penyimpanan -->
        <div class="form-group">
          <label class="form-label" for="stock-location">Lokasi Penyimpanan</label>
          <input id="stock-location" type="text" class="form-input" v-model="form.storage_location" placeholder="Rak A1, Freezer 2..." />
        </div>

        <!-- SKU -->
        <div class="form-group">
          <label class="form-label" for="stock-sku">SKU / Kode Internal</label>
          <input id="stock-sku" type="text" class="form-input" v-model="form.sku" placeholder="SKU-001..." />
        </div>
      </div>

      <!-- Catatan -->
      <div class="form-group form-group--full">
        <label class="form-label" for="stock-notes">Catatan</label>
        <textarea id="stock-notes" class="form-textarea" v-model="form.notes" rows="2" placeholder="Catatan tambahan..." />
      </div>

      <!-- Bukti Dokumen -->
      <div class="form-group form-group--full">
        <label class="form-label" for="stock-proof">Bukti Pembelian (JPG/PNG/PDF, maks. 2MB)</label>
        <div class="file-upload" :class="{ 'has-file': !!proofPreview }">
          <input id="stock-proof" type="file" class="file-input" accept=".jpg,.jpeg,.png,.pdf" @change="onFileChange" />
          <div class="file-upload__inner">
            <span class="material-symbols-outlined">upload_file</span>
            <span v-if="proofPreview">{{ proofPreview }}</span>
            <span v-else class="file-placeholder">Klik untuk pilih file...</span>
          </div>
        </div>
      </div>

      <!-- Total Harga -->
      <div v-if="totalHarga > 0" class="total-harga">
        <span class="total-harga__label">Estimasi Total Harga:</span>
        <span class="total-harga__value">{{ formatRupiah(totalHarga) }}</span>
      </div>
    </form>

    <template #footer>
      <button class="btn-secondary" type="button" @click="$emit('close')" :disabled="isSubmitting">Batal</button>
      <button class="btn-primary" type="submit" form="stock-add-form" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="material-symbols-outlined spin">progress_activity</span>
        <span v-else class="material-symbols-outlined">{{ editItem ? 'save' : 'send' }}</span>
        {{ isSubmitting ? (editItem ? 'Menyimpan...' : 'Mengajukan...') : (editItem ? 'Simpan' : 'Ajukan Stok') }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import type { StockSummary, StockItem } from '@/types/stock'
import type { Ingredient } from '@/types/ingredient'
import { stockStoreSchema } from '@/validation/stock.schema'
import { formatRupiah } from '@/utils/format'

const UNITS = ['kg', 'liter', 'gram', 'ml', 'pcs'] as const

const props = defineProps<{
  isOpen: boolean
  isSubmitting: boolean
  ingredientOptions: Pick<Ingredient, 'id' | 'name'>[]
  prefillIngredient?: StockSummary | null
  editItem?: StockItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', formData: FormData): void
}>()

const defaultForm = () => ({
  ingredient_id: null as number | null,
  quantity: '' as number | '',
  unit: 'kg' as (typeof UNITS)[number],
  price_per_unit: '' as number | '',
  purchase_date: '',
  expiry_date: '',
  supplier: '',
  storage_type: 'dry' as 'dry' | 'chilled' | 'frozen',
  storage_location: '',
  sku: '',
  notes: '',
  proof_document: null as File | null,
})

const form = ref(defaultForm())
const errors = ref<Record<string, string>>({})
const proofPreview = ref('')

const totalHarga = computed(() => {
  const q = Number(form.value.quantity)
  const p = Number(form.value.price_per_unit)
  if (!q || !p) return 0
  return q * p
})

watch(() => props.prefillIngredient, (val) => {
  if (val) {
    form.value.ingredient_id = val.ingredient_id
    form.value.unit = val.unit
  }
})

watch(() => props.isOpen, (open) => {
  if (!open) {
    form.value = defaultForm()
    errors.value = {}
    proofPreview.value = ''
  } else if (props.editItem) {
    form.value.ingredient_id = props.editItem.ingredient_id
    form.value.quantity = props.editItem.quantity
    form.value.unit = props.editItem.unit
    form.value.price_per_unit = props.editItem.price_per_unit
    form.value.purchase_date = props.editItem.purchase_date
    form.value.expiry_date = props.editItem.expiry_date
    form.value.supplier = props.editItem.supplier
    form.value.storage_type = props.editItem.storage_type
    form.value.storage_location = props.editItem.storage_location || ''
    form.value.sku = props.editItem.sku || ''
    form.value.notes = props.editItem.notes || ''
    proofPreview.value = props.editItem.proof_document ? 'Bukti pembelian saat ini' : ''
  } else if (props.prefillIngredient) {
    form.value.ingredient_id = props.prefillIngredient.ingredient_id
    form.value.unit = props.prefillIngredient.unit
  }
})

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  form.value.proof_document = file
  proofPreview.value = file ? file.name : ''
}

function validate(): boolean {
  const result = stockStoreSchema.safeParse({
    ingredient_id: form.value.ingredient_id,
    quantity: form.value.quantity,
    unit: form.value.unit,
    price_per_unit: form.value.price_per_unit,
    purchase_date: form.value.purchase_date,
    expiry_date: form.value.expiry_date,
    supplier: form.value.supplier,
    storage_type: form.value.storage_type,
    storage_location: form.value.storage_location || undefined,
    sku: form.value.sku || undefined,
    notes: form.value.notes || undefined,
  })

  if (!result.success) {
    errors.value = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string
      if (!errors.value[key]) errors.value[key] = issue.message
    }
    return false
  }
  errors.value = {}
  return true
}

function onSubmit() {
  if (!validate()) return

  const fd = new FormData()
  fd.append('ingredient_id', String(form.value.ingredient_id))
  fd.append('quantity', String(form.value.quantity))
  fd.append('unit', form.value.unit)
  fd.append('price_per_unit', String(form.value.price_per_unit))
  fd.append('purchase_date', form.value.purchase_date)
  fd.append('expiry_date', form.value.expiry_date)
  fd.append('supplier', form.value.supplier)
  fd.append('storage_type', form.value.storage_type)
  if (form.value.storage_location) fd.append('storage_location', form.value.storage_location)
  if (form.value.sku) fd.append('sku', form.value.sku)
  if (form.value.notes) fd.append('notes', form.value.notes)
  if (form.value.proof_document) fd.append('proof_document', form.value.proof_document)

  emit('submit', fd)
}
</script>

<style scoped lang="scss">
.stock-form {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $space-1.5;

  &--full { grid-column: 1 / -1; }
}

.form-label {
  font-size: $text-xs;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-text-secondary;

  .req { color: $color-danger; }
}

.form-input, .form-select, .form-textarea {
  padding: $space-2-5 $space-3;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  font-size: $text-sm;
  font-family: $font-body;
  color: $color-text-primary;
  background-color: $color-bg-surface;
  outline: none;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-muted;
  }
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right $space-3 center;
  background-size: 1.15rem;
  padding-right: $space-10;
  cursor: pointer;
}

.form-textarea { resize: vertical; min-height: 60px; }

.input-addon {
  display: flex;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
  transition: border-color $transition-fast, box-shadow $transition-fast;

  &:focus-within {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-muted;
  }

  .form-input {
    border: none;
    border-radius: 0;
    flex: 1;
    &:focus { box-shadow: none; }
  }

  .addon-select {
    appearance: none;
    border: none;
    border-left: 1px solid $color-border;
    border-radius: 0;
    padding: $space-2 $space-8 $space-2 $space-3;
    font-size: $text-xs;
    font-weight: 600;
    color: $color-text-secondary;
    background-color: $color-bg-subtle;
    cursor: pointer;
    outline: none;
    min-width: 80px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 0.9rem;
  }
}

.form-error {
  font-size: $text-xs;
  color: $color-danger;
  margin: 0;
  font-weight: 600;
}

.file-upload {
  position: relative;
  border: 2px dashed $color-border;
  border-radius: $radius-md;
  background-color: $color-bg-subtle;
  transition: all $transition-fast;
  cursor: pointer;

  &:hover {
    border-color: $color-primary;
    background-color: rgba(67, 97, 238, 0.04);
  }
  &.has-file {
    border-color: $color-success;
    border-style: solid;
    background-color: rgba(46, 196, 182, 0.04);
  }

  .file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-3 $space-4;
    pointer-events: none;
    font-size: $text-sm;
    color: $color-text-secondary;

    .material-symbols-outlined { font-size: 1.3rem; color: $color-primary; }
  }

  .file-placeholder { color: $color-text-faint; }
}

.total-harga {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-3 $space-4;
  background-color: $color-primary-light;
  border: 1px solid $color-primary-muted;
  border-radius: $radius-md;

  &__label {
    font-size: $text-sm;
    color: $color-text-secondary;
    font-weight: 600;
  }

  &__value {
    font-size: $text-lg;
    font-weight: 800;
    color: $color-primary;
    font-family: $font-mono;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
  padding: $space-2-5 $space-4;
  border: none;
  border-radius: $radius-md;
  background-color: $color-primary;
  color: $color-text-inverse;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  font-family: $font-body;
  transition: background-color $transition-fast;

  &:hover:not(:disabled) { background-color: $color-primary-dark; }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
  .material-symbols-outlined { font-size: 1.1rem; }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: $space-1.5;
  padding: $space-2-5 $space-4;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  background-color: $color-bg-surface;
  color: $color-text-secondary;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  font-family: $font-body;
  transition: background-color $transition-fast;

  &:hover:not(:disabled) { background-color: $color-bg-subtle; }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
