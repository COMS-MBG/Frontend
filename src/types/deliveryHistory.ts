import type { DeliveryHistory, DistributionAnalytics } from './distribution'

export type { DeliveryHistory, DistributionAnalytics }

export interface DeliveryHistoryFilters {
  date_from: string
  date_to: string
}

export interface DeliveryHistoryListMeta {
  current_page: number
  last_page: number
  total: number
  per_page: number
}
