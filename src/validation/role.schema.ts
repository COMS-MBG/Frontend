import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string()
    .min(3, { message: 'Nama role minimal 3 karakter' })
    .max(255, { message: 'Nama role maksimal 255 karakter' }),
  description: z.string()
    .max(500, { message: 'Deskripsi maksimal 500 karakter' })
    .optional()
    .or(z.literal('')),
  permissions: z.array(z.number()).optional(),
})
