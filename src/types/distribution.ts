// ── Backend Status Constants ─────────────────────────────────────────────────
// Mirrors DeliverySchedule model constants from Laravel backend
export type ScheduleStatus =
  | 'in_order'
  | 'accepted'
  | 'rejected'
  | 'delivering'
  | 'delivered'
  | 'confirmed'
  | 'revision_required'


// ── Vehicle Types ────────────────────────────────────────────────────────────
export type VehicleType = 'motorcycle' | 'car' | 'van' | 'truck'

// ── Backend Resource Shapes ──────────────────────────────────────────────────

export interface CourierInfo {
  id: number
  name: string
}

export interface SchoolInfo {
  id: number
  name: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
}

export interface RejectionInfo {
  reason: string
  photo_url: string | null
  rejected_at: string | null
}

export interface ProofInfo {
  photo_url: string | null
  submitted_at: string | null
}

export interface ConfirmationInfo {
  confirmed_by: string | null
  confirmed_at: string | null
  notes: string | null
}

export interface LatestLocationInfo {
  latitude: number
  longitude: number
  recorded_at: string
}

/** Matches DeliveryScheduleResource from backend */
export interface DeliverySchedule {
  id: number
  status: ScheduleStatus
  vehicle_type: VehicleType
  vehicle_plate: string | null
  scheduled_at: string | null
  departed_at: string | null
  arrived_at: string | null
  courier: CourierInfo | null
  school: SchoolInfo | null
  assigned_by: string | null
  submitted_by: string | null
  delivery_notes: string | null
  rejection: RejectionInfo | null
  proof: ProofInfo | null
  confirmation: ConfirmationInfo | null
  revision_notes: string | null
  latest_location: LatestLocationInfo | null
  created_at: string
  updated_at: string
}

/** Matches DeliveryHistoryResource from backend */
export interface DeliveryHistory {
  id: number
  schedule_id: number
  courier_name: string
  school_name: string
  school_address: string
  vehicle_type: VehicleType
  vehicle_plate: string | null
  departed_at: string | null
  arrived_at: string | null
  duration_minutes: number | null
  distance_km: number | null
  proof_photo_url: string | null
  route_snapshot: unknown
  confirmed_by: string | null
  confirmed_at: string | null
  notes: string | null
  created_at: string
}

/** Available courier for schedule creation dropdown */
export interface AvailableCourier {
  id: number
  name: string
  phone: string | null
  position: string
}

/** Analytics summary from DeliveryHistoryController::analytics */
export interface DistributionAnalytics {
  period: { from: string; to: string }
  total_deliveries: number
  total_distance_km: number
  avg_duration_minutes: number
  deliveries_per_courier: Record<string, number>
  deliveries_per_school: Record<string, number>
  vehicle_breakdown: Record<string, number>
}

/** Active courier location for live map */
export interface ActiveCourierLocation {
  schedule_id: number
  courier_id: number
  courier_name: string
  latitude: number
  longitude: number
  recorded_at: string
  status: ScheduleStatus
}

/** GPS trail point for route replay */
export interface LocationTrailPoint {
  latitude: number
  longitude: number
  recorded_at: string
}

export interface GeoJsonLineString {
  type: 'LineString'
  coordinates: Array<[number, number]>
}

/** Route optimization result */
export interface OptimizedRoute {
  ordered_waypoints: Array<{
    lat: number
    lng: number
    school_id: string
    name?: string
  }>
  geojson: GeoJsonLineString | null
  total_distance_km: number
  total_duration_min: number
}

/** Depot location from config */
export interface DepotLocation {
  name: string
  latitude: number
  longitude: number
}

// ── Payload Types for mutations ──────────────────────────────────────────────

export interface CreateSchedulePayload {
  courier_id: number
  school_id: number
  vehicle_type: VehicleType
  vehicle_plate?: string
  scheduled_at: string
  delivery_notes?: string
}

export interface UpdateSchedulePayload {
  courier_id?: number
  school_id?: number
  vehicle_type?: VehicleType
  vehicle_plate?: string
  scheduled_at?: string
  delivery_notes?: string
}

export interface OptimizeRoutePayload {
  origin: { lat: number; lng: number }
  waypoints: Array<{
    lat: number
    lng: number
    school_id: string
    name?: string
  }>
}

// ── Legacy Flat Type ─────────────────────────────────────────────────────────
// Used by existing DistributionRow.vue — will be derived from DeliverySchedule
export interface DistributionItem {
  id: number
  sekolah: string
  alamat?: string
  porsi: number
  jarakKm: number
  kurir: string
  kendaraan: string
  status: ScheduleStatus
  lat: number
  lng: number
  scheduledAt?: string | null
}

// ── Paginated API Response ───────────────────────────────────────────────────
export interface PaginationMeta {
  current_page: number
  last_page: number
  total: number
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
}

export interface SingleResponse<T> {
  success: boolean
  data: T
}

export interface MessageResponse {
  success: boolean
  message: string
}
