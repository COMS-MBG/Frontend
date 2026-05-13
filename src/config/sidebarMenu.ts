export interface MenuItem {
  id: string
  title: string
  icon: string
  routeName?: string
  children?: MenuItem[]
}

export const sidebarMenu: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    routeName: 'dashboard',
  },
  {
    id: 'manajemen-gizi',
    title: 'Manajemen Gizi',
    icon: 'settings_accessibility',
    children: [
      {
        id: 'master-resep',
        title: 'Master Data Resep',
        icon: 'receipt_long',
        routeName: 'master-resep',
      },
      {
        id: 'master-bahan',
        title: 'Master Data Bahan Baku',
        icon: 'kitchen',
        routeName: 'master-bahan',
      },
      {
        id: 'perencanaan-menu',
        title: 'Perencanaan Menu',
        icon: 'restaurant_menu',
        routeName: 'perencanaan-menu',
      },
    ],
  },
  {
    id: 'distribusi',
    title: 'Distribusi',
    icon: 'local_shipping',
    children: [
      {
        id: 'jadwal-pengiriman',
        title: 'Jadwal Pengiriman',
        icon: 'calendar_month',
        routeName: 'jadwal-pengiriman',
      },
      {
        id: 'peta-spasial',
        title: 'Peta Spasial & Analitik',
        icon: 'map',
        routeName: 'peta-spasial',
      },
    ],
  },
  {
    id: 'sekolah-mitra',
    title: 'Sekolah Mitra',
    icon: 'school',
    routeName: 'sekolah-mitra',
  },
  {
    id: 'laporan',
    title: 'Laporan',
    icon: 'bar_chart',
    children: [
      {
        id: 'laporan-operasional',
        title: 'Operasional',
        icon: 'analytics',
        routeName: 'laporan',
      },
      {
        id: 'laporan-keuangan',
        title: 'Keuangan',
        icon: 'account_balance_wallet',
        routeName: 'laporan-keuangan',
      },
    ],
  },
  {
    id: 'hr',
    title: 'Data Karyawan',
    icon: 'badge',
    children: [
      {
        id: 'karyawan',
        title: 'Manajemen Karyawan',
        icon: 'group',
        routeName: 'karyawan',
      },
      {
        id: 'hak-akses',
        title: 'Hak Akses',
        icon: 'admin_panel_settings',
        routeName: 'hak-akses',
      },
    ],
  },
]
