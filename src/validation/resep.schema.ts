import { z } from 'zod'
import type { ResepFormErrors } from '@/types/gizi'

// ── Bahan (Ingredient) Schema ──────────────────────────────
export const bahanSchema = z.object({
  id: z.string(),

  bahanId: z
    .union([
      z.string().min(1, { message: 'Bahan wajib dipilih' }),
      z.number({ message: 'Bahan wajib dipilih' }),
    ]),

  gram: z.coerce
    .number({ message: 'Gram harus angka' })
    .min(1, { message: 'Gram minimal 1' }),
})

// ── Main Recipe Schema ─────────────────────────────────────
export const resepSchema = z.object({
  nama: z
    .string()
    .min(1, { message: 'Nama resep wajib diisi' }),

  bahanList: z
    .array(bahanSchema)
    .min(1, { message: 'Minimal 1 bahan harus ditambahkan' }),
})

// ── Inferred Types ─────────────────────────────────────────
export type ResepForm = z.infer<typeof resepSchema>
export type BahanForm = z.infer<typeof bahanSchema>

// ── Error Mapper ───────────────────────────────────────────
/** Maps Zod issues into a typed ResepFormErrors object */
export function mapResepErrors(error: z.ZodError): ResepFormErrors {
  const fieldErrors: ResepFormErrors = {}

  for (const issue of error.issues) {
    const path = issue.path

    if (path[0] === 'bahanList' && typeof path[1] === 'number') {
      const index = path[1]
      const field = path[2] as 'bahanId' | 'gram' | undefined

      if (!fieldErrors.bahanList) fieldErrors.bahanList = []
      if (!fieldErrors.bahanList[index]) fieldErrors.bahanList[index] = {}

      if (field) {
        fieldErrors.bahanList[index][field] = issue.message
      }
    } else if (path[0] === 'nama') {
      fieldErrors.nama = issue.message
    }
  }

  return fieldErrors
}