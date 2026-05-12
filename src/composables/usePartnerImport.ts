import { ref } from 'vue'
import { parseCsvFile, validateFileFormat } from '@/services/partnerServices'
import { partnerApi } from '@/api/partner.api'
import { usePartnerStore } from '@/stores/partner.store'
import type { PartnerImportRow, PartnerImportResult } from '@/types/partner'

export type ImportStep = 'upload' | 'preview' | 'uploading' | 'result'

export interface ColumnStatusItem {
  key: string
  label: string
  found: boolean
}

export function usePartnerImport() {
  // ── State ──────────────────────────────────────────────
  const step             = ref<ImportStep>('upload')
  const isDragging       = ref(false)
  const fileName         = ref('')
  const fileRef          = ref<File | null>(null)
  const fileError        = ref('')
  const validationErrors = ref<string[]>([])
  const previewRows      = ref<PartnerImportRow[]>([])
  const importResult     = ref<PartnerImportResult | null>(null)
  const columnStatus     = ref<ColumnStatusItem[]>([])

  // ── Actions ────────────────────────────────────────────

  /** Reset the entire import flow back to step 1. */
  function reset(): void {
    step.value             = 'upload'
    fileRef.value          = null
    fileName.value         = ''
    fileError.value        = ''
    validationErrors.value = []
    previewRows.value      = []
    importResult.value     = null
    columnStatus.value     = []
  }

  /** Process a selected/dropped file — validate, parse, move to preview. */
  async function processFile(file: File): Promise<void> {
    fileError.value        = ''
    validationErrors.value = []
    columnStatus.value     = []

    // 1. Validate format + size
    const formatErr = validateFileFormat(file)
    if (formatErr) {
      fileError.value = formatErr
      return
    }

    fileName.value = file.name
    fileRef.value  = file

    // 2. Client-side CSV parsing (delegates to utility)
    const result = await parseCsvFile(file)

    // Track column status for checklist UI
    columnStatus.value = result.columnStatus

    if (!result.isValid) {
      validationErrors.value = result.errors
      if (result.rows.length === 0) {
        // Stay on upload step — show column checklist
        return
      }
    } else {
      validationErrors.value = []
    }

    previewRows.value = result.rows
    step.value = 'preview'
  }

  /** Upload the file to the server and get import results. */
  async function confirmImport(): Promise<boolean> {
    if (!fileRef.value) return false

    step.value = 'uploading'

    try {
      const res = await partnerApi.importFile(fileRef.value)
      importResult.value = res.data
      step.value = 'result'

      // Refresh store data after successful import
      const store = usePartnerStore()
      await store.refreshAfterImport()

      return true
    } catch {
      fileError.value = 'Gagal mengimport data. Silakan coba lagi.'
      step.value = 'preview'
      return false
    }
  }

  // ── Expose ─────────────────────────────────────────────
  return {
    // State (reactive)
    step,
    isDragging,
    fileName,
    fileRef,
    fileError,
    validationErrors,
    previewRows,
    importResult,
    columnStatus,

    // Actions
    reset,
    processFile,
    confirmImport,
  }
}
