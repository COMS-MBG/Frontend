import api from '@/api/axios'
import type {
  DeliverySchedule,
  DeliveryHistory,
  AvailableCourier,
  DistributionAnalytics,
  ActiveCourierLocation,
  LocationTrailPoint,
  OptimizedRoute,
  DepotLocation,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  OptimizeRoutePayload,
  PaginatedResponse,
  SingleResponse,
  MessageResponse,
} from '@/types/distribution'

const SCHEDULES = '/distribution/schedules'
const HISTORIES = '/distribution/histories'
const MAP = '/distribution/map'

// ═══════════════════════════════════════════════════════════════
//  DELIVERY SCHEDULE API
// ═══════════════════════════════════════════════════════════════

export const scheduleApi = {
  /**
   * Fetch paginated active schedules with optional filters.
   * GET /api/distribution/schedules
   */
  async getAll(params?: {
    page?: number
    per_page?: number
    status?: string
    courier_id?: number
    school_id?: number
  }): Promise<PaginatedResponse<DeliverySchedule>> {
    const { data } = await api.get(SCHEDULES, { params })
    return data
  },

  /**
   * Fetch a single schedule detail.
   * GET /api/distribution/schedules/{id}
   */
  async getOne(id: number): Promise<SingleResponse<DeliverySchedule>> {
    const { data } = await api.get(`${SCHEDULES}/${id}`)
    return data
  },

  /**
   * Create a new delivery schedule.
   * POST /api/distribution/schedules
   */
  async create(payload: CreateSchedulePayload): Promise<SingleResponse<DeliverySchedule>> {
    const { data } = await api.post(SCHEDULES, payload)
    return data
  },

  /**
   * Update an existing schedule (draft only).
   * PUT /api/distribution/schedules/{id}
   */
  async update(id: number, payload: UpdateSchedulePayload): Promise<SingleResponse<DeliverySchedule>> {
    const { data } = await api.put(`${SCHEDULES}/${id}`, payload)
    return data
  },

  /**
   * Delete a schedule (in_order status only).
   * DELETE /api/distribution/schedules/{id}
   */
  async destroy(id: number): Promise<MessageResponse> {
    const { data } = await api.delete(`${SCHEDULES}/${id}`)
    return data
  },

  // ── Workflow Actions ─────────────────────────────────────────

  /**
   * Admin SPPG submits task to courier.
   * POST /api/distribution/schedules/{id}/submit
   */
  async submitTask(id: number): Promise<SingleResponse<DeliverySchedule>> {
    const { data } = await api.post(`${SCHEDULES}/${id}/submit`)
    return data
  },

  /**
   * Courier accepts a task.
   * POST /api/distribution/schedules/{id}/accept
   */
  async acceptTask(id: number): Promise<SingleResponse<DeliverySchedule>> {
    const { data } = await api.post(`${SCHEDULES}/${id}/accept`)
    return data
  },

  /**
   * Courier rejects a task with reason and optional photo.
   * POST /api/distribution/schedules/{id}/reject
   */
  async rejectTask(id: number, reason: string, photo?: File): Promise<SingleResponse<DeliverySchedule>> {
    const formData = new FormData()
    formData.append('rejection_reason', reason)
    if (photo) formData.append('rejection_photo', photo)

    const { data } = await api.post(`${SCHEDULES}/${id}/reject`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /**
   * Courier submits delivery proof photo.
   * POST /api/distribution/schedules/{id}/proof
   */
  async submitProof(id: number, photo: File): Promise<SingleResponse<DeliverySchedule>> {
    const formData = new FormData()
    formData.append('proof_photo', photo)

    const { data } = await api.post(`${SCHEDULES}/${id}/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /**
   * Courier resubmits proof after revision request.
   * POST /api/distribution/schedules/{id}/proof/resubmit
   */
  async resubmitProof(id: number, photo: File): Promise<SingleResponse<DeliverySchedule>> {
    const formData = new FormData()
    formData.append('proof_photo', photo)

    const { data } = await api.post(`${SCHEDULES}/${id}/proof/resubmit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  /**
   * Admin confirms a delivery (archives to history).
   * POST /api/distribution/schedules/{id}/confirm
   */
  async confirmDelivery(id: number, notes?: string): Promise<SingleResponse<DeliveryHistory>> {
    const { data } = await api.post(`${SCHEDULES}/${id}/confirm`, { notes })
    return data
  },

  /**
   * Admin requests revision of proof from courier.
   * POST /api/distribution/schedules/{id}/revision
   */
  async requestRevision(id: number, notes: string): Promise<SingleResponse<DeliverySchedule>> {
    const { data } = await api.post(`${SCHEDULES}/${id}/revision`, { notes })
    return data
  },

  // ── Helpers ──────────────────────────────────────────────────

  /**
   * Fetch available couriers for schedule creation dropdown.
   * GET /api/distribution/schedules/meta/couriers
   */
  async getAvailableCouriers(): Promise<{ success: boolean; data: AvailableCourier[] }> {
    const { data } = await api.get(`${SCHEDULES}/meta/couriers`)
    return data
  },
}

// ═══════════════════════════════════════════════════════════════
//  DELIVERY HISTORY API
// ═══════════════════════════════════════════════════════════════

export const historyApi = {
  /**
   * Fetch paginated delivery histories.
   * GET /api/distribution/histories
   */
  async getAll(params?: {
    page?: number
    per_page?: number
    courier_id?: number
    school_id?: number
    date_from?: string
    date_to?: string
  }): Promise<PaginatedResponse<DeliveryHistory>> {
    const { data } = await api.get(HISTORIES, { params })
    return data
  },

  /**
   * Fetch a single history detail.
   * GET /api/distribution/histories/{id}
   */
  async getOne(id: number): Promise<SingleResponse<DeliveryHistory>> {
    const { data } = await api.get(`${HISTORIES}/${id}`)
    return data
  },

  /**
   * Fetch analytics summary for a date range.
   * GET /api/distribution/histories/analytics
   */
  async getAnalytics(params?: {
    date_from?: string
    date_to?: string
  }): Promise<{ success: boolean; data: DistributionAnalytics }> {
    const { data } = await api.get(`${HISTORIES}/analytics`, { params })
    return data
  },
}

// ═══════════════════════════════════════════════════════════════
//  SPATIAL MAP API
// ═══════════════════════════════════════════════════════════════

export const spatialApi = {
  /**
   * Fetch all active courier locations for live map.
   * GET /api/distribution/map/active-couriers
   */
  async getActiveCouriers(): Promise<{
    success: boolean
    data: ActiveCourierLocation[]
    count: number
  }> {
    const { data } = await api.get(`${MAP}/active-couriers`)
    return data
  },

  /**
   * Fetch GPS trail for a specific delivery.
   * GET /api/distribution/map/trail/{scheduleId}
   */
  async getLocationTrail(scheduleId: number): Promise<{
    success: boolean
    schedule_id: number
    data: LocationTrailPoint[]
    total_pings: number
  }> {
    const { data } = await api.get(`${MAP}/trail/${scheduleId}`)
    return data
  },

  /**
   * Fetch depot (SPPG) location from config.
   * GET /api/distribution/map/depot
   */
  async getDepotLocation(): Promise<SingleResponse<DepotLocation>> {
    const { data } = await api.get(`${MAP}/depot`)
    return data
  },

  /**
   * Record courier GPS ping during delivery.
   * POST /api/distribution/map/location/{scheduleId}
   */
  async recordLocation(scheduleId: number, payload: {
    latitude: number
    longitude: number
  }): Promise<{ success: boolean; recorded_at: string }> {
    const { data } = await api.post(`${MAP}/location/${scheduleId}`, payload)
    return data
  },

  /**
   * Request route optimization (TSP + OSRM).
   * POST /api/distribution/map/optimize-route
   */
  async optimizeRoute(payload: OptimizeRoutePayload): Promise<{
    success: boolean
    data: OptimizedRoute
  }> {
    const { data } = await api.post(`${MAP}/optimize-route`, payload)
    return data
  },
}
