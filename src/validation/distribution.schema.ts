import { z } from 'zod'

// ── Revision Notes Schema ────────────────────────────────────────────────────
// Used by ConfirmActionModal when requesting revision from courier

export const revisionNotesSchema = z
  .string()
  .refine(
    (val) => val.trim().length >= 10,
    { message: 'Catatan revisi harus minimal 10 karakter.' },
  )

// ── Schedule Create Schema ───────────────────────────────────────────────────

export const createScheduleSchema = z.object({
  courier_id: z.number({ required_error: 'Kurir wajib dipilih.' }).min(1, 'Kurir wajib dipilih.'),
  school_id: z.number({ required_error: 'Sekolah wajib dipilih.' }).min(1, 'Sekolah wajib dipilih.'),
  vehicle_type: z.enum(['motorcycle', 'car', 'van', 'truck'], {
    required_error: 'Tipe kendaraan wajib dipilih.',
  }),
  vehicle_plate: z.string().optional(),
  scheduled_at: z.string().min(1, 'Tanggal jadwal wajib diisi.'),
  delivery_notes: z.string().optional(),
})

// ── Schedule Update Schema ───────────────────────────────────────────────────

export const updateScheduleSchema = createScheduleSchema.partial()

// ── Type Exports ─────────────────────────────────────────────────────────────

export type CreateScheduleForm = z.infer<typeof createScheduleSchema>
export type UpdateScheduleForm = z.infer<typeof updateScheduleSchema>
