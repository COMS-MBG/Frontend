import type { BahanItem } from '@/types/gizi'

/**
 * Seed data for Master Bahan Baku.
 *
 * This is the single source of truth for local development / demo.
 * Replace `bahanStore.setItems(bahanDummy)` with
 * `bahanStore.fetchItems()` when the backend is ready.
 */
export const bahanDummy: BahanItem[] = [
  { id: 1,  nama: 'Daging Ayam',   satuan: 'kg',    kalori: 239,  protein: 27.3, karbohidrat: 0.0,   lemak: 13.6,  status: 'aktif',    image: '' },
  { id: 2,  nama: 'Daging Sapi',   satuan: 'kg',    kalori: 250,  protein: 26.0, karbohidrat: 0.0,   lemak: 15.0,  status: 'aktif',    image: '' },
  { id: 3,  nama: 'Beras Putih',   satuan: 'kg',    kalori: 365,  protein: 7.1,  karbohidrat: 80.0,  lemak: 0.6,   status: 'aktif',    image: '' },
  { id: 4,  nama: 'Minyak Goreng', satuan: 'liter', kalori: 884,  protein: 0.0,  karbohidrat: 0.0,   lemak: 100.0, status: 'aktif',    image: '' },
  { id: 5,  nama: 'Bayam Segar',   satuan: 'kg',    kalori: 23,   protein: 2.9,  karbohidrat: 3.6,   lemak: 0.4,   status: 'aktif',    image: '' },
  { id: 6,  nama: 'Wortel',        satuan: 'kg',    kalori: 41,   protein: 0.9,  karbohidrat: 9.6,   lemak: 0.2,   status: 'aktif',    image: '' },
  { id: 7,  nama: 'Tahu Putih',    satuan: 'pcs',   kalori: 76,   protein: 8.1,  karbohidrat: 1.9,   lemak: 4.8,   status: 'aktif',    image: '' },
  { id: 8,  nama: 'Tempe',         satuan: 'pcs',   kalori: 192,  protein: 18.5, karbohidrat: 7.6,   lemak: 10.8,  status: 'aktif',    image: '' },
  { id: 9,  nama: 'Kentang',       satuan: 'kg',    kalori: 77,   protein: 2.0,  karbohidrat: 17.0,  lemak: 0.1,   status: 'nonaktif', image: '' },
  { id: 10, nama: 'Santan Kelapa', satuan: 'liter', kalori: 230,  protein: 2.3,  karbohidrat: 5.5,   lemak: 24.0,  status: 'aktif',    image: '' },
  { id: 11, nama: 'Telur Ayam',    satuan: 'pcs',   kalori: 155,  protein: 13.0, karbohidrat: 1.1,   lemak: 11.0,  status: 'aktif',    image: '' },
  { id: 12, nama: 'Gula Pasir',    satuan: 'kg',    kalori: 387,  protein: 0.0,  karbohidrat: 100.0, lemak: 0.0,   status: 'aktif',    image: '' },
  { id: 13, nama: 'Garam',         satuan: 'kg',    kalori: 0,    protein: 0.0,  karbohidrat: 0.0,   lemak: 0.0,   status: 'aktif',    image: '' },
  { id: 14, nama: 'Ikan Tuna',     satuan: 'kg',    kalori: 132,  protein: 28.0, karbohidrat: 0.0,   lemak: 1.3,   status: 'nonaktif', image: '' },
]
