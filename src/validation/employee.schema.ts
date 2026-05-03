import { z } from 'zod'

export const employeeSchema = z.object({
  nama: z.string().min(1, { message: 'Nama wajib diisi' }),
  nrp: z.string().min(1, { message: 'NRP wajib diisi' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  jabatan: z.string().min(1, { message: 'Jabatan wajib diisi' }),
  departemen: z.string().min(1, { message: 'Departemen wajib diisi' }),
  role: z.string().min(1, { message: 'Role wajib dipilih' }),
})
