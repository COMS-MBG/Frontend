import type { FeatureAccess, RoleKey } from '@/types/access'
/** Dummy data for initial development and testing. Replace with API calls when backend is ready. */
export const featureAccessDummy: FeatureAccess[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    permissions: {
      Admin:    { view: true,  create: true,  edit: true,  delete: true  },
      Operator: { view: true,  create: false, edit: false, delete: false },
      Viewer:   { view: true,  create: false, edit: false, delete: false },
    },
  },
  {
    id: 'manajemen-gizi',
    name: 'Manajemen Gizi',
    icon: 'settings_accessibility',
    permissions: {
      Admin:    { view: true,  create: true,  edit: true,  delete: true  },
      Operator: { view: true,  create: true,  edit: true,  delete: false },
      Viewer:   { view: true,  create: false, edit: false, delete: false },
    },
  },
  {
    id: 'distribusi',
    name: 'Distribusi',
    icon: 'local_shipping',
    permissions: {
      Admin:    { view: true,  create: true,  edit: true,  delete: true  },
      Operator: { view: true,  create: true,  edit: true,  delete: false },
      Viewer:   { view: true,  create: false, edit: false, delete: false },
    },
  },
  {
    id: 'peta-spasial',
    name: 'Peta Spasial',
    icon: 'map',
    permissions: {
      Admin:    { view: true,  create: true,  edit: true,  delete: true  },
      Operator: { view: true,  create: false, edit: false, delete: false },
      Viewer:   { view: true,  create: false, edit: false, delete: false },
    },
  },
  {
    id: 'data-karyawan',
    name: 'Data Karyawan',
    icon: 'badge',
    permissions: {
      Admin:    { view: true,  create: true,  edit: true,  delete: true  },
      Operator: { view: true,  create: false, edit: true,  delete: false },
      Viewer:   { view: false, create: false, edit: false, delete: false },
    },
  },
]

/** Available roles for the selector. */
export const availableRoles: RoleKey[] = ['Admin', 'Operator', 'Viewer']