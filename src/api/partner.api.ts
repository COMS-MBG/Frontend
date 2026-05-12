import api from '@/api/axios'
import type {
  Partner,
  PartnerListResponse,
  PartnerSummaryResponse,
  PartnerDetailResponse,
  PartnerMutationResponse,
  PartnerDeleteResponse,
  PartnerImportResponse,
} from '@/types/partner'

const BASE = '/admin-sppg/partners'

export const partnerApi = {

  /** GET /admin-sppg/partners — List with filters & pagination */
  async getAll(params?: Record<string, string | number | undefined>): Promise<PartnerListResponse> {
    const { data } = await api.get<PartnerListResponse>(BASE, { params })
    return data
  },

  /** GET /admin-sppg/partners/summary — Summary statistics */
  async getSummary(): Promise<PartnerSummaryResponse> {
    const { data } = await api.get<PartnerSummaryResponse>(`${BASE}/summary`)
    return data
  },

  /** GET /admin-sppg/partners/:id — Show single partner */
  async getById(id: string): Promise<PartnerDetailResponse> {
    const { data } = await api.get<PartnerDetailResponse>(`${BASE}/${id}`)
    return data
  },

  /** POST /admin-sppg/partners — Create new partner */
  async create(payload: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<PartnerMutationResponse> {
    const { data } = await api.post<PartnerMutationResponse>(BASE, payload)
    return data
  },

  /** PUT /admin-sppg/partners/:id — Update partner */
  async update(id: string, payload: Partial<Partner>): Promise<PartnerMutationResponse> {
    const { data } = await api.put<PartnerMutationResponse>(`${BASE}/${id}`, payload)
    return data
  },

  /** DELETE /admin-sppg/partners/:id — Delete partner */
  async delete(id: string): Promise<PartnerDeleteResponse> {
    const { data } = await api.delete<PartnerDeleteResponse>(`${BASE}/${id}`)
    return data
  },

  /** POST /admin-sppg/partners/import — Import CSV file */
  async importFile(file: File): Promise<PartnerImportResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await api.post<PartnerImportResponse>(`${BASE}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000, // 60s for large uploads
    })
    return data
  },
}
