import type { BahanItem } from '@/types/gizi'

/**
 * Seed data for Master Bahan Baku.
 *
 * This is the single source of truth for local development / demo.
 * Replace `bahanStore.setItems(bahanDummy)` with
 * `bahanStore.fetchItems()` when the backend is ready.
 */
export const bahanDummy: BahanItem[] = [
  { id: 1,  nama: 'Daging Ayam',   kategori: 'protein', satuan: 'kg',    stok: 25,  kalori: 239,  protein: 27.3, karbohidrat: 0.0,   lemak: 13.6,  image: '' },
  { id: 2,  nama: 'Daging Sapi',   kategori: 'protein', satuan: 'kg',    stok: 12,  kalori: 250,  protein: 26.0, karbohidrat: 0.0,   lemak: 15.0,  image: '' },
  { id: 3,  nama: 'Beras Putih',   kategori: 'karbo',   satuan: 'kg',    stok: 50,  kalori: 365,  protein: 7.1,  karbohidrat: 80.0,  lemak: 0.6,   image: '' },
  { id: 4,  nama: 'Minyak Goreng', kategori: 'lemak',   satuan: 'liter', stok: 3,   kalori: 884,  protein: 0.0,  karbohidrat: 0.0,   lemak: 100.0, image: '' },
  { id: 5,  nama: 'Bayam Segar',   kategori: 'serat',   satuan: 'kg',    stok: 8,   kalori: 23,   protein: 2.9,  karbohidrat: 3.6,   lemak: 0.4,   image: '' },
  { id: 6,  nama: 'Wortel',        kategori: 'serat',   satuan: 'kg',    stok: 15,  kalori: 41,   protein: 0.9,  karbohidrat: 9.6,   lemak: 0.2,   image: '' },
  { id: 7,  nama: 'Tahu Putih',    kategori: 'protein', satuan: 'pcs',   stok: 0,   kalori: 76,   protein: 8.1,  karbohidrat: 1.9,   lemak: 4.8,   image: '' },
  { id: 8,  nama: 'Tempe',         kategori: 'protein', satuan: 'pcs',   stok: 5,   kalori: 192,  protein: 18.5, karbohidrat: 7.6,   lemak: 10.8,  image: '' },
  { id: 9,  nama: 'Kentang',       kategori: 'karbo',   satuan: 'kg',    stok: 20,  kalori: 77,   protein: 2.0,  karbohidrat: 17.0,  lemak: 0.1,   image: '' },
  { id: 10, nama: 'Santan Kelapa', kategori: 'lemak',   satuan: 'liter', stok: 2,   kalori: 230,  protein: 2.3,  karbohidrat: 5.5,   lemak: 24.0,  image: '' },
  { id: 11, nama: 'Telur Ayam',    kategori: 'protein', satuan: 'pcs',   stok: 100, kalori: 155,  protein: 13.0, karbohidrat: 1.1,   lemak: 11.0,  image: '' },
  { id: 12, nama: 'Gula Pasir',    kategori: 'lainnya', satuan: 'kg',    stok: 10,  kalori: 387,  protein: 0.0,  karbohidrat: 100.0, lemak: 0.0,   image: '' },
  { id: 13, nama: 'Garam',         kategori: 'lainnya', satuan: 'kg',    stok: 4,   kalori: 0,    protein: 0.0,  karbohidrat: 0.0,   lemak: 0.0,   image: '' },
  { id: 14, nama: 'Ikan Tuna',     kategori: 'protein', satuan: 'kg',    stok: 1,   kalori: 132,  protein: 28.0, karbohidrat: 0.0,   lemak: 1.3,   image: '' },
]
