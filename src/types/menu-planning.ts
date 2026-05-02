export type StatusPublikasi = 'draft' | 'scheduled' | 'published'

export interface MenuDayItem {
  date: string
  dayName: string
  menuId: number | null
  status: StatusPublikasi
}

export interface WeeklyMenu {
  weekStart: string
  items: MenuDayItem[]
}

export const MENU_STATUS_CONFIG: Record<StatusPublikasi, { label: string, variant: 'neutral' | 'warning' | 'success' }> = {
  draft: { label: 'Rencana Ditampilkan', variant: 'neutral' },
  scheduled: { label: 'Segera Ditampilkan', variant: 'warning' },
  published: { label: 'Ditampilkan', variant: 'success' }
}
