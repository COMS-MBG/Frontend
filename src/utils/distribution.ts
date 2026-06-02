import type { DeliverySchedule, DistributionItem, ScheduleStatus } from '@/types/distribution'

// ── Status Display Info ──────────────────────────────────────────────────────
// Maps all 7 backend status constants to display info using CSS variant names
// instead of hardcoded hex colors — fully design-system compliant.

export interface StatusDisplayInfo {
  variant: 'warning' | 'info' | 'danger' | 'primary' | 'success'
  label: string
  icon: string
}

const STATUS_MAP: Record<ScheduleStatus, StatusDisplayInfo> = {
  in_order:          { variant: 'warning', label: 'Menunggu',      icon: 'hourglass_top' },
  accepted:          { variant: 'info',    label: 'Diterima',      icon: 'check_circle' },
  rejected:          { variant: 'danger',  label: 'Ditolak',       icon: 'cancel' },
  delivering:        { variant: 'primary', label: 'Di Perjalanan', icon: 'local_shipping' },
  delivered:         { variant: 'success', label: 'Terkirim',      icon: 'inventory' },
  confirmed:         { variant: 'success', label: 'Dikonfirmasi',  icon: 'verified' },
  revision_required: { variant: 'warning', label: 'Revisi Bukti',  icon: 'edit_note' },
}

export function getStatusInfo(status: ScheduleStatus): StatusDisplayInfo {
  return STATUS_MAP[status] ?? { variant: 'warning', label: 'Unknown', icon: 'help' }
}

// ── Vehicle Type Label Mapping ───────────────────────────────────────────────

const VEHICLE_LABELS: Record<string, string> = {
  motorcycle: 'Motor',
  car:        'Mobil',
  van:        'Van',
  truck:      'Truk',
}

export function getVehicleLabel(type: string): string {
  return VEHICLE_LABELS[type] ?? type
}

// ── Transform: DeliverySchedule → DistributionItem (flat format for Row) ─────

export function toDistributionItem(schedule: DeliverySchedule): DistributionItem {
  return {
    id: schedule.id,
    sekolah: schedule.school?.name ?? 'Sekolah Tidak Diketahui',
    alamat: schedule.school?.address ?? undefined,
    porsi: 0,
    jarakKm: 0,
    kurir: schedule.courier?.name ?? 'Belum Ditugaskan',
    kendaraan: getVehicleLabel(schedule.vehicle_type),
    status: schedule.status,
    lat: schedule.school?.latitude ?? 0,
    lng: schedule.school?.longitude ?? 0,
    scheduledAt: schedule.scheduled_at,
  }
}

// ── On-Time Rate Subtitle ────────────────────────────────────────────────────
// Derive a dynamic subtitle based on the actual on-time percentage

export function getOnTimeSubtitle(rate: number): string {
  if (rate >= 80) return 'Sangat Baik'
  if (rate >= 50) return 'Baik'
  if (rate > 0) return 'Perlu Perhatian'
  return '—'
}
