import { formatDate, formatDateTime, formatDec } from './format'
import { getVehicleLabel } from './distribution'

export function formatDeliveryDate(iso: string | null): string {
  if (!iso) return '-'
  return formatDate(iso)
}

export function formatDeliveryTime(iso: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatDuration(minutes: number | null): string {
  if (minutes === null || minutes === undefined) return '-'
  return `${minutes} menit`
}

export function formatDistance(km: number | null): string {
  if (km === null || km === undefined) return '-'
  return `${formatDec(km, 1)} km`
}

export function formatVehicleType(type: string): string {
  return getVehicleLabel(type)
}

export function formatConfirmationDate(iso: string | null): string {
  if (!iso) return '-'
  return formatDateTime(iso)
}

export function getStartOfMonthISO(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${yyyy}-${mm}-01`
}

export function getTodayISO(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
