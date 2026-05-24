import { z } from 'zod'

/** Skema validasi untuk satu baris bahan baku di form resep */
export const bahanSchema = z.object({
  id: z.string(),
  bahanId: z.union([
    z.string().min(1, { message: 'Bahan wajib dipilih' }),
    z.number({ message: 'Bahan wajib dipilih' }),
  ]),
  gram: z.coerce
    .number({ message: 'Gram harus angka' })
    .min(1, { message: 'Gram minimal 1' }),
})

/** Skema validasi untuk form resep (nama + daftar bahan) */
export const resepSchema = z.object({
  nama: z.string().min(1, { message: 'Nama resep wajib diisi' }),
  bahanList: z.array(bahanSchema).min(1, { message: 'Minimal 1 bahan harus ditambahkan' }),
})

/** Inferred type untuk data satu baris bahan */
export type BahanFormData = z.infer<typeof bahanSchema>

/** Inferred type untuk data form resep */
export type ResepFormData = z.infer<typeof resepSchema>
