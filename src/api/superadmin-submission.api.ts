import api from '@/api/axios'
import type {
  DraftPartner,
  SppgDraft,
  SubmissionListResponse,
  SubmissionDetailResponse,
  SubmissionMutationResponse,
  SubmissionDeleteResponse,
  SubmissionSubmitResponse,
} from '@/types/superadmin-submission'

// Re-export types for backward compatibility during migration
export type {
  DraftPartner,
  SppgDraft,
  SubmissionListResponse,
  SubmissionDetailResponse,
  SubmissionMutationResponse,
  SubmissionDeleteResponse,
  SubmissionSubmitResponse,
} from '@/types/superadmin-submission'

// ── API ──────────────────────────────────────────────────────────────────────

const BASE = '/super-admin/sppg-submissions'

/** GET /api/super-admin/sppg-submissions — List all drafts */
export async function getSubmissions(): Promise<SubmissionListResponse> {
  const { data } = await api.get<SubmissionListResponse>(BASE)
  return data
}

/** GET /api/super-admin/sppg-submissions/{id} — Draft detail */
export async function getSubmission(id: number | string): Promise<SubmissionDetailResponse> {
  const { data } = await api.get<SubmissionDetailResponse>(`${BASE}/${id}`)
  return data
}

/** POST /api/super-admin/sppg-submissions — Auto-save draft */
export async function saveSubmission(payload: Record<string, unknown>): Promise<SubmissionMutationResponse> {
  const { data } = await api.post<SubmissionMutationResponse>(BASE, payload)
  return data
}

/** PUT /api/super-admin/sppg-submissions/{id} — Manual update draft */
export async function updateSubmission(id: number | string, payload: Record<string, unknown>): Promise<SubmissionMutationResponse> {
  const { data } = await api.put<SubmissionMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/** DELETE /api/super-admin/sppg-submissions/{id} — Delete draft */
export async function deleteSubmission(id: number | string): Promise<SubmissionDeleteResponse> {
  const { data } = await api.delete<SubmissionDeleteResponse>(`${BASE}/${id}`)
  return data
}

/** POST /api/super-admin/sppg-submissions/{id}/submit — Finalize draft → SPPG */
export async function submitSubmission(id: number | string): Promise<SubmissionSubmitResponse> {
  const { data } = await api.post<SubmissionSubmitResponse>(`${BASE}/${id}/submit`, {}, {
    timeout: 60_000 // 60 seconds for heavy database seeding & cloud DB latency
  })
  return data
}
