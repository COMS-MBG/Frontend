import type { SppgItem, SppgPartner, SppgEmployee } from '@/types/superadmin-sppg'

/**
 * Maps raw backend SPPG data to frontend SppgItem type.
 */
export function mapSppgItem(raw: unknown): SppgItem {
  if (!raw || typeof raw !== 'object') {
    return {} as SppgItem
  }
  const r = raw as Record<string, any>
  return {
    ...r,
    id: Number(r.id),
    name: r.name || '',
    address: r.address || '',
    latitude: r.coordinates?.lat ?? Number(r.latitude) ?? 0,
    longitude: r.coordinates?.lng ?? Number(r.longitude) ?? 0,
    capacity: Number(r.capacity) ?? 0,
    phone: r.phone || null,
    email: r.email || null,
    owner: r.owner ? { id: Number(r.owner.id), name: r.owner.name } : null,
  } as SppgItem
}

/**
 * Maps raw backend SPPG partner data to SppgPartner type.
 */
export function mapSppgPartner(raw: unknown): SppgPartner {
  if (!raw || typeof raw !== 'object') {
    return {} as SppgPartner
  }
  const r = raw as Record<string, any>
  return {
    ...r,
    latitude: r.coordinates?.lat ?? Number(r.latitude) ?? 0,
    longitude: r.coordinates?.lng ?? Number(r.longitude) ?? 0,
    portion_count: Number(r.portion_count) ?? 0,
    distance_km: Number(r.distance_km) ?? 0,
    estimated_minutes: r.estimated_minutes !== null ? Number(r.estimated_minutes) : null,
  } as SppgPartner
}

/**
 * Maps raw backend employee data to SppgEmployee type.
 */
export function mapSppgEmployee(raw: unknown): SppgEmployee {
  if (!raw || typeof raw !== 'object') {
    return {} as SppgEmployee
  }
  const r = raw as Record<string, any>
  return {
    id: Number(r.id),
    name: r.name || '',
    email: r.user?.email || r.email || '',
    phone: r.phone || null,
    position: r.position || '',
    is_active: r.status === 'active' || r.is_active === true,
  }
}
