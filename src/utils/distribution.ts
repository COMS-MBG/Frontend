import type { DeliveryStatus } from '@/types/distribution'

export function getStatusColor(status: DeliveryStatus) {
  switch (status) {
    case 'pending':
      return { class: 'warning', hex: '#d97706', label: 'Menunggu' }
    case 'in_progress':
      return { class: 'primary', hex: '#2563eb', label: 'Diperjalanan' }
    case 'completed':
      return { class: 'success', hex: '#10b981', label: 'Selesai' }
    default:
      return { class: 'secondary', hex: '#64748b', label: 'Unknown' }
  }
}
