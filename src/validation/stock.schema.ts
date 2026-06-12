/**
 * validation/stock.schema.ts — Zod schema untuk form stok bahan baku
 */
import { z } from 'zod'

const UNITS = ['kg', 'liter', 'gram', 'ml', 'pcs'] as const
const STORAGE_TYPES = ['dry', 'chilled', 'frozen'] as const

export const stockStoreSchema = z
  .object({
    ingredient_id: z
      .number({ required_error: 'Bahan baku wajib dipilih.' })
      .int()
      .positive('Bahan baku wajib dipilih.'),

    quantity: z
      .number({ required_error: 'Jumlah wajib diisi.' })
      .positive('Jumlah harus lebih dari 0.'),

    unit: z.enum(UNITS, { required_error: 'Satuan wajib dipilih.' }),

    price_per_unit: z
      .number({ required_error: 'Harga per satuan wajib diisi.' })
      .min(0, 'Harga tidak boleh negatif.'),

    purchase_date: z
      .string()
      .min(1, 'Tanggal pembelian wajib diisi.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid.'),

    expiry_date: z
      .string()
      .min(1, 'Tanggal kadaluarsa wajib diisi.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid.'),

    supplier: z.string().min(1, 'Nama supplier wajib diisi.').max(255),

    storage_type: z.enum(STORAGE_TYPES, { required_error: 'Jenis penyimpanan wajib dipilih.' }),

    storage_location: z.string().max(255).optional(),
    sku: z.string().max(100).optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => !data.expiry_date || !data.purchase_date || data.expiry_date >= data.purchase_date,
    {
      message: 'Tanggal kadaluarsa harus sama atau setelah tanggal pembelian.',
      path: ['expiry_date'],
    },
  )

export const stockMinimumSchema = z.object({
  minimum_quantity: z
    .number({ required_error: 'Stok minimum wajib diisi.' })
    .min(0, 'Stok minimum tidak boleh negatif.'),
  unit: z.enum(UNITS, { required_error: 'Satuan wajib dipilih.' }),
})

export type StockStoreSchema = z.infer<typeof stockStoreSchema>
export type StockMinimumSchema = z.infer<typeof stockMinimumSchema>
