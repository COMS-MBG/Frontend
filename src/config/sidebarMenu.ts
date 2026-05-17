export interface MenuItem {
  id: string
  title: string
  icon: string
  routeName?: string
  permission?: string
  children?: MenuItem[]
}

export const sidebarMenu: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    routeName: 'dashboard',
    permission: 'dashboard.read',
  },
  {
    id: 'manajemen-gizi',
    title: 'Manajemen Gizi',
    icon: 'settings_accessibility',
    permission: 'nutrition.read',
    children: [
      {
        id: 'master-resep',
        title: 'Master Data Resep',
        icon: 'receipt_long',
        routeName: 'master-resep',
        permission: 'recipes.read',
      },
      {
        id: 'master-bahan',
        title: 'Master Data Bahan Baku',
        icon: 'kitchen',
        routeName: 'master-bahan',
        permission: 'ingredients.read',
      },
      {
        id: 'perencanaan-menu',
        title: 'Perencanaan Menu',
        icon: 'restaurant_menu',
        routeName: 'perencanaan-menu',
        permission: 'menus.read',
      },
    ],
  },
  {
    id: 'distribusi',
    title: 'Distribusi',
    icon: 'local_shipping',
    permission: 'distribution.read',
    children: [
      {
        id: 'jadwal-pengiriman',
        title: 'Jadwal Pengiriman',
        icon: 'calendar_month',
        routeName: 'jadwal-pengiriman',
        permission: 'distribution.read',
      },
      {
        id: 'peta-spasial',
        title: 'Peta Spasial & Analitik',
        icon: 'map',
        routeName: 'peta-spasial',
        permission: 'distribution.read',
      },
    ],
  },
  {
    id: 'sekolah-mitra',
    title: 'Sekolah Mitra',
    icon: 'school',
    routeName: 'sekolah-mitra',
    permission: 'partner.read',
  },
  {
    id: 'laporan',
    title: 'Laporan',
    icon: 'bar_chart',
    permission: 'report.read',
    children: [
      {
        id: 'laporan-operasional',
        title: 'Operasional',
        icon: 'analytics',
        routeName: 'laporan',
        permission: 'report.read',
      },
      {
        id: 'laporan-keuangan',
        title: 'Keuangan',
        icon: 'account_balance_wallet',
        routeName: 'laporan-keuangan',
        permission: 'finance.read',
      },
    ],
  },
  {
    id: 'hr',
    title: 'Data Karyawan',
    icon: 'badge',
    permission: 'employee.read',
    children: [
      {
        id: 'karyawan',
        title: 'Manajemen Karyawan',
        icon: 'group',
        routeName: 'karyawan',
        permission: 'employee.read',
      },
      {
        id: 'hak-akses',
        title: 'Hak Akses',
        icon: 'admin_panel_settings',
        routeName: 'hak-akses',
        permission: 'employee.update',
      },
    ],
  },
]
