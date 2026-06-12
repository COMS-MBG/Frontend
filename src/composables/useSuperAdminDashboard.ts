import { useSuperAdminStore } from '@/stores/superadmin.store'
import { getDashboardStats } from '@/api/superadmin-dashboard.api'
import { getSppgs } from '@/api/superadmin-sppg.api'
import { getFinancialReports, approveFinancialReport, rejectFinancialReport } from '@/api/superadmin-finance.api'
import { ref, computed } from 'vue'
import type { SppgItem } from '@/types/superadmin-sppg'
import type { FinancialReport } from '@/types/superadmin-finance'
import { useDashboardCoverage } from './useDashboardCoverage'
import { useDashboardCapacity } from './useDashboardCapacity'
import { useDashboardDistribution } from './useDashboardDistribution'
import { useDashboardDrafts } from './useDashboardDrafts'

/**
 * Composable for the Super Admin Dashboard page.
 * Orchestrates sub-composables to perform parallel frontend analytics
 * and loads financial reports to present a flat aggregated summary.
 */
export function useSuperAdminDashboard() {
  const store = useSuperAdminStore()
  const sppgsList = ref<SppgItem[]>([])
  const isLoadingSppgs = ref(false)

  // Financial reports state
  const reports = ref<FinancialReport[]>([])
  const isLoadingReports = ref(false)

  // Instantiate decoupled sub-composables
  const { coverageData, isLoadingCoverage, fetchCoverage } = useDashboardCoverage()
  const { capacityOverview } = useDashboardCapacity(sppgsList)
  const { sppgDistribution } = useDashboardDistribution(sppgsList)
  const { draftOverview, draftsList, isLoadingDrafts, fetchDrafts } = useDashboardDrafts()

  /** Fetch global high-level counts */
  async function fetchDashboardStats(): Promise<void> {
    store.setLoading(true)
    store.setError(null)
    try {
      const res = await getDashboardStats()
      store.setDashboardStats(res.data)
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal memuat data dashboard.')
    } finally {
      store.setLoading(false)
    }
  }

  /** Fetch SPPG list for distribution and capacity calculations */
  async function fetchSppgList(): Promise<void> {
    isLoadingSppgs.value = true
    try {
      const res = await getSppgs({ per_page: 100 })
      sppgsList.value = res.data || []
    } catch (err) {
      console.error('Error fetching SPPG list for dashboard:', err)
    } finally {
      isLoadingSppgs.value = false
    }
  }

  /** Fetch financial reports list to compute summaries */
  async function fetchFinancialData(): Promise<void> {
    isLoadingReports.value = true
    try {
      const res = await getFinancialReports({ per_page: 100 })
      reports.value = res.data || []
    } catch (err) {
      console.error('Error fetching financial reports for dashboard:', err)
    } finally {
      isLoadingReports.value = false
    }
  }

  /** Actions to approve/reject financial reports inline on the dashboard */
  async function approveReport(id: number | string): Promise<void> {
    store.setError(null)
    try {
      await approveFinancialReport(id)
      await fetchFinancialData()
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menyetujui laporan keuangan.')
      throw err
    }
  }

  async function rejectReport(id: number | string): Promise<void> {
    store.setError(null)
    try {
      await rejectFinancialReport(id)
      await fetchFinancialData()
    } catch (err: unknown) {
      store.setError(err instanceof Error ? err.message : 'Gagal menolak laporan keuangan.')
      throw err
    }
  }

  // Compute aggregated financial summary
  const financialSummary = computed(() => {
    let income = 0
    let expense = 0
    let net = 0
    const pendingList: FinancialReport[] = []

    reports.value.forEach(r => {
      income += Number(r.total_income || 0)
      expense += Number(r.total_expense || 0)
      net += Number(r.net_income || 0)

      if (r.status === 'submitted' || r.status === 'pending') {
        pendingList.push(r)
      }
    })

    return {
      income,
      expense,
      net,
      pending: pendingList.slice(0, 3) // display top 3 pending reports
    }
  })

  /** Load all widgets concurrently using Promise.all() */
  async function loadAllDashboardData(): Promise<void> {
    store.setError(null)
    await Promise.all([
      fetchDashboardStats(),
      fetchCoverage(),
      fetchSppgList(),
      fetchDrafts(),
      fetchFinancialData()
    ])
  }

  return {
    // General reactive state
    dashboardStats: computed(() => store.dashboardStats),
    isLoading: computed(() => {
      return store.isLoading || isLoadingCoverage.value || isLoadingSppgs.value || isLoadingDrafts.value || isLoadingReports.value
    }),
    error: computed(() => store.error),

    // Sub-composable analytics
    coverageData,
    sppgDistribution,
    capacityOverview,
    draftOverview,
    draftsList,
    sppgsList,

    // Financial actions and data
    financialSummary,
    approveReport,
    rejectReport,

    // Orchestrator Action
    loadAllDashboardData
  }
}
