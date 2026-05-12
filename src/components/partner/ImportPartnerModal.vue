<template>
  <BaseModal v-model="isOpenModel" title="Import Data Partner" size="lg" @close="onClose">
    <!-- Step 1: File Upload -->
    <div v-if="step === 'upload'" class="import-step">
      <div class="upload-zone" :class="{ 'upload-zone--drag': isDragging }" @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="onDrop">
        <span class="material-symbols-outlined upload-zone__icon">cloud_upload</span>
        <p class="upload-zone__title">Drag & drop file CSV di sini</p>
        <p class="upload-zone__sub">atau</p>
        <label class="btn-primary btn-with-icon upload-zone__btn">
          <span class="material-symbols-outlined">folder_open</span>
          Pilih File
          <input type="file" accept=".csv,.txt,.xlsx,.xls" class="sr-only" @change="onFileSelect" />
        </label>
        <p class="upload-zone__hint">Format: CSV • Maks 10MB</p>
      </div>

      <!-- Column validation error with checklist -->
      <div v-if="columnStatus.length > 0 && !isAllColumnsFound" class="import-column-check">
        <p class="import-column-check__title">
          <span class="material-symbols-outlined">info</span>
          File CSV tidak sesuai template. Status kolom:
        </p>
        <ul class="import-column-check__list">
          <li v-for="col in columnStatus" :key="col.key" :class="col.found ? 'col-found' : 'col-missing'">
            <span class="material-symbols-outlined">{{ col.found ? 'check_circle' : 'cancel' }}</span>
            {{ col.label }}
          </li>
        </ul>
      </div>

      <!-- Generic file error (format, size) -->
      <div v-else-if="fileError" class="import-error">
        <span class="material-symbols-outlined">error</span> {{ fileError }}
      </div>

      <!-- Download template link -->
      <div class="template-hint">
        <button type="button" class="btn-link" @click="onDownloadTemplate">
          <span class="material-symbols-outlined">download</span>
          Download Template CSV
        </button>
      </div>
    </div>

    <!-- Step 2: Preview -->
    <div v-if="step === 'preview'" class="import-step">
      <div class="preview-header">
        <div class="preview-info"><span class="material-symbols-outlined">description</span><strong>{{ fileName }}</strong><span class="preview-count">{{ previewRows.length }} baris terdeteksi</span></div>
        <button class="btn-secondary btn-sm" @click="importer.reset()">Ganti File</button>
      </div>
      <div v-if="validationErrors.length > 0" class="import-errors-list">
        <p v-for="(err, i) in validationErrors" :key="i" class="import-error-item"><span class="material-symbols-outlined">warning</span> {{ err }}</p>
      </div>

      <!-- Column status checklist (when partially valid) -->
      <div v-if="columnStatus.length > 0" class="import-column-check import-column-check--compact">
        <ul class="import-column-check__list">
          <li v-for="col in columnStatus" :key="col.key" :class="col.found ? 'col-found' : 'col-missing'">
            <span class="material-symbols-outlined">{{ col.found ? 'check_circle' : 'cancel' }}</span>
            {{ col.label }}
          </li>
        </ul>
      </div>

      <div class="preview-table-wrap">
        <table class="preview-table">
          <thead><tr><th>No</th><th>Nama Sekolah</th><th>NPSN</th><th>Bentuk</th><th>Status</th><th>Kecamatan</th><th>Kab/Kota</th><th>Porsi</th></tr></thead>
          <tbody>
            <tr v-for="(row, i) in previewRows.slice(0, 20)" :key="i">
              <td>{{ i + 1 }}</td><td>{{ row.nama_sekolah }}</td><td>{{ row.npsn || '—' }}</td><td>{{ row.bentuk }}</td><td>{{ row.status }}</td><td>{{ row.kecamatan || '—' }}</td><td>{{ row.kabupaten_kota || '—' }}</td><td>{{ row.jumlah_porsi }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="previewRows.length > 20" class="preview-more">... dan {{ previewRows.length - 20 }} baris lainnya</p>
    </div>

    <!-- Step 3: Uploading -->
    <div v-if="step === 'uploading'" class="import-step import-step--center">
      <div class="upload-progress"><div class="spinner" /><p>Mengimport {{ previewRows.length }} data partner...</p></div>
    </div>

    <!-- Step 4: Result -->
    <div v-if="step === 'result'" class="import-step">
      <div class="import-result">
        <span class="material-symbols-outlined import-result__icon">check_circle</span>
        <h3 class="import-result__title">Import Selesai</h3>
        <div class="result-stats">
          <div class="result-stat"><span class="result-stat__num result-stat__num--created">{{ importResult?.created ?? 0 }}</span><span class="result-stat__label">Ditambahkan</span></div>
          <div class="result-stat"><span class="result-stat__num result-stat__num--updated">{{ importResult?.updated ?? 0 }}</span><span class="result-stat__label">Diperbarui</span></div>
          <div class="result-stat"><span class="result-stat__num result-stat__num--skipped">{{ importResult?.skipped ?? 0 }}</span><span class="result-stat__label">Dilewati</span></div>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="onClose">{{ step === 'result' ? 'Tutup' : 'Batal' }}</button>
      <button v-if="step === 'preview'" class="btn-primary" :disabled="validationErrors.length > 0" @click="onConfirmImport">
        <span class="material-symbols-outlined">upload</span> Import {{ previewRows.length }} Data
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { usePartnerImport } from '@/composables/usePartnerImport'
import { generateCsvTemplate } from '@/services/partnerServices'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'update:isOpen', v: boolean): void; (e: 'imported'): void }>()

const isOpenModel = computed({ get: () => props.isOpen, set: (v) => emit('update:isOpen', v) })

// ── Composable (owns ALL import logic) ─────────────────
const importer = usePartnerImport()
const {
  step, isDragging, fileName, fileError, validationErrors,
  previewRows, importResult, columnStatus,
} = importer

const isAllColumnsFound = computed(() => columnStatus.value.every((c) => c.found))

// Reset composable state when modal reopens
watch(() => props.isOpen, (open) => { if (open) importer.reset() })

function onClose() { importer.reset(); emit('update:isOpen', false) }
function onFileSelect(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) importer.processFile(f) }
function onDrop(e: DragEvent) { isDragging.value = false; const f = e.dataTransfer?.files?.[0]; if (f) importer.processFile(f) }

async function onConfirmImport() {
  const success = await importer.confirmImport()
  if (success) emit('imported')
}

function onDownloadTemplate() {
  const csv = generateCsvTemplate()
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template_import_partner.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped lang="scss">
.import-step { min-height: 200px; }
.import-step--center { display: flex; align-items: center; justify-content: center; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }

.upload-zone { border: 2px dashed $color-border; border-radius: $radius-lg; padding: $space-10 $space-6; text-align: center; transition: all $transition-base; cursor: pointer;
  &--drag { border-color: $color-primary; background: $color-primary-subtle; }
  &__icon { font-size: 3rem; color: $color-text-faint; margin-bottom: $space-3; display: block; }
  &__title { font-size: $text-lg; font-weight: 700; color: $color-text-primary; margin: 0 0 $space-1; }
  &__sub { font-size: $text-sm; color: $color-text-muted; margin: 0 0 $space-3; }
  &__btn { cursor: pointer; }
  &__hint { font-size: $text-xs; color: $color-text-faint; margin: $space-3 0 0; }
}

.import-error { display: flex; align-items: center; gap: $space-2; margin-top: $space-3; padding: $space-3; background: rgba($color-danger, 0.08); border-radius: $radius-md; color: $color-danger; font-size: $text-sm; font-weight: 500;
  .material-symbols-outlined { font-size: 1.2rem; }
}

// ── Column checklist ──
.import-column-check {
  margin-top: $space-4;
  padding: $space-4;
  background: $color-bg-subtle;
  border-radius: $radius-md;
  border: 1px solid $color-border-light;

  &--compact {
    margin-top: 0;
    margin-bottom: $space-3;
    padding: $space-3;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text-secondary;
    margin: 0 0 $space-3;

    .material-symbols-outlined { font-size: 1.1rem; color: $color-warning; }
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: $space-2;
  }
}

.col-found, .col-missing {
  display: flex;
  align-items: center;
  gap: $space-1;
  font-size: $text-sm;
  font-weight: 500;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;

  .material-symbols-outlined { font-size: 1rem; }
}

.col-found {
  color: $color-success;
  background: $color-success-subtle;
}

.col-missing {
  color: $color-danger;
  background: rgba($color-danger, 0.08);
}

// ── Template download ──
.template-hint {
  margin-top: $space-4;
  text-align: center;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  background: none;
  border: none;
  color: $color-primary;
  font-size: $text-sm;
  font-weight: 600;
  cursor: pointer;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  transition: background $transition-base;

  &:hover { background: $color-primary-subtle; }

  .material-symbols-outlined { font-size: 1.1rem; }
}

.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: $space-3; }
.preview-info { display: flex; align-items: center; gap: $space-2; font-size: $text-sm; .material-symbols-outlined { color: $color-primary; } }
.preview-count { color: $color-text-muted; margin-left: $space-1; }
.import-errors-list { margin-bottom: $space-3; }
.import-error-item { display: flex; align-items: center; gap: $space-1; font-size: $text-xs; color: $color-warning; margin: $space-1 0; .material-symbols-outlined { font-size: 1rem; } }

.preview-table-wrap { max-height: 320px; overflow: auto; border: 1px solid $color-border; border-radius: $radius-md; }
.preview-table { width: 100%; border-collapse: collapse; font-size: $text-xs;
  th { padding: $space-2 $space-3; background: $color-bg-subtle; font-weight: 700; text-transform: uppercase; color: $color-text-muted; text-align: left; white-space: nowrap; position: sticky; top: 0; z-index: 1; }
  td { padding: $space-2 $space-3; border-top: 1px solid $color-border-light; white-space: nowrap; }
}
.preview-more { font-size: $text-xs; color: $color-text-muted; text-align: center; margin-top: $space-2; }

.upload-progress { text-align: center; p { margin-top: $space-3; color: $color-text-secondary; } }
.spinner { width: 40px; height: 40px; border: 3px solid $color-border; border-top-color: $color-primary; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.import-result { text-align: center;
  &__icon { font-size: 3rem; color: $color-success; }
  &__title { font-size: $text-xl; font-weight: 700; margin: $space-2 0 $space-4; }
}
.result-stats { display: flex; justify-content: center; gap: $space-6; }
.result-stat { display: flex; flex-direction: column; align-items: center; gap: $space-1;
  &__num { font-size: $text-2xl; font-weight: 800;
    &--created { color: $color-success; }
    &--updated { color: $color-primary; }
    &--skipped { color: $color-text-muted; }
  }
  &__label { font-size: $text-xs; color: $color-text-muted; font-weight: 600; text-transform: uppercase; }
}
</style>
