export type DeliveryStatus = 'pending' | 'in_progress' | 'completed'

export interface DistributionItem {
  id: number
  sekolah: string
  alamat?: string
  porsi: number
  jarakKm: number
  kurir: string
  kendaraan: string
  status: DeliveryStatus
  lat: number
  lng: number
}
