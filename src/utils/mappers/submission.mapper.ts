import type { SppgDraft } from '@/types/superadmin-submission'

/**
 * Scalable submission mapper structure.
 * Placeholder for future submission data transformation logic.
 */
export function mapSppgDraft(raw: unknown): SppgDraft {
  if (!raw || typeof raw !== 'object') {
    return {} as SppgDraft
  }
  const r = raw as Record<string, any>
  return {
    ...r,
    id: r.id ? Number(r.id) : undefined,
    submission_number: r.submission_number || '',
    status: r.status || 'draft',
    source: r.source || 'map',
    map_confirmed: Boolean(r.map_confirmed),
    latitude: r.latitude ? Number(r.latitude) : 0,
    longitude: r.longitude ? Number(r.longitude) : 0,
    created_at: r.created_at || '',
    updated_at: r.updated_at || '',
  } as SppgDraft
}
