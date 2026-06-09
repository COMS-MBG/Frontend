import { ref } from 'vue'
import { getSubmissions } from '@/api/superadmin-submission.api'
import type { SppgDraft } from '@/types/superadmin-submission'

export function useDashboardDrafts() {
  const draftOverview = ref({ total: 0, lastUpdated: '', latestName: '' })
  const draftsList = ref<SppgDraft[]>([])
  const isLoadingDrafts = ref(false)

  async function fetchDrafts() {
    isLoadingDrafts.value = true
    try {
      const res = await getSubmissions()
      const drafts = (res.data || []).filter((d: SppgDraft) => d.status === 'draft')
      draftsList.value = drafts
      const total = drafts.length
      let lastUpdated = ''
      let latestName = ''

      if (drafts.length > 0) {
        const sorted = [...drafts].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        const latest = sorted[0]
        if (latest) {
          lastUpdated = latest.updated_at
          latestName = latest.submission_number
        }
      }

      draftOverview.value = { total, lastUpdated, latestName }
    } catch (err) {
      console.error('Error fetching dashboard drafts:', err)
    } finally {
      isLoadingDrafts.value = false
    }
  }

  return {
    draftOverview,
    draftsList,
    isLoadingDrafts,
    fetchDrafts
  }
}
