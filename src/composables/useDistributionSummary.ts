import { storeToRefs } from 'pinia'
import { useDistributionStore } from '@/stores/distribution.store'

export function useDistributionSummary() {
  const store = useDistributionStore()
  const { totalToday, inProgressCount, onTimeRate } = storeToRefs(store)

  return {
    totalToday,
    inProgressCount,
    onTimeRate
  }
}
