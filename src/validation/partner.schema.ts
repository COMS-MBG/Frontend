import { z } from 'zod'

export const partnerSchema = z.object({
  nama_sekolah:   z.string().min(1, { message: 'Nama sekolah wajib diisi' }),
  npsn:           z.string().optional().or(z.literal('')),
  bentuk:         z.string().min(1, { message: 'Bentuk sekolah wajib dipilih' }),
  status:         z.string().min(1, { message: 'Status wajib dipilih' }),
  alamat:         z.string().optional().or(z.literal('')),
  kecamatan:      z.string().optional().or(z.literal('')),
  kabupaten_kota: z.string().optional().or(z.literal('')),
  latitude:       z.number()
                   .min(-90,  { message: 'Latitude harus antara -90 dan 90' })
                   .max(90,   { message: 'Latitude harus antara -90 dan 90' })
                   .nullable()
                   .optional(),
  longitude:      z.number()
                   .min(-180, { message: 'Longitude harus antara -180 dan 180' })
                   .max(180,  { message: 'Longitude harus antara -180 dan 180' })
                   .nullable()
                   .optional(),
  jumlah_porsi:   z.number({ message: 'Jumlah porsi harus berupa angka' })
                   .int({ message: 'Jumlah porsi harus bilangan bulat' })
                   .min(0, { message: 'Jumlah porsi tidak boleh negatif' }),
})
