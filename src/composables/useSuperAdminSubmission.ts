import * as submissionApi from '@/api/superadmin-submission.api'
import { ref, computed } from 'vue'
import type { SppgDraft } from '@/types/superadmin-submission'

/**
 * Composable for Super Admin SPPG Submission (draft) management.
 * Handles listing, CRUD, and finalize-submit workflow.
 */
export function useSuperAdminSubmission() {
  // ── Local state ────────────────────────────────────────────────
  const submissions  = ref<SppgDraft[]>([])
  const isLoading    = ref(false)
  const isSubmitting = ref(false)
  const error        = ref<string | null>(null)

  // ── Computed ───────────────────────────────────────────────────
  const draftCount = computed(() => submissions.value.filter(s => s.status === 'draft').length)
  const registeredCount = computed(() => submissions.value.filter(s => s.status === 'registered').length)
  const isEmpty = computed(() => !isLoading.value && submissions.value.length === 0)

  // ── Fetch ──────────────────────────────────────────────────────
  async function fetchSubmissions(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await submissionApi.getSubmissions()
      submissions.value = res.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data pengajuan.'
    } finally {
      isLoading.value = false
    }
  }



  // ── CRUD ───────────────────────────────────────────────────────


  async function deleteSubmission(id: number | string): Promise<void> {
    isSubmitting.value = true
    error.value = null
    try {
      await submissionApi.deleteSubmission(id)
      await fetchSubmissions()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal menghapus pengajuan.'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  /** Finalize draft → SPPG */
  async function submitDraft(id: number | string): Promise<boolean> {
    isSubmitting.value = true
    error.value = null
    try {
      await submissionApi.submitSubmission(id)
      await fetchSubmissions()
      return true
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string }
      error.value = e.response?.data?.message || e.message || 'Gagal memfinalisasi pengajuan draf.'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    submissions,
    isLoading,
    isSubmitting,
    error,
    draftCount,
    registeredCount,
    isEmpty,

    fetchSubmissions,
    deleteSubmission,
    submitDraft,
  }
}
