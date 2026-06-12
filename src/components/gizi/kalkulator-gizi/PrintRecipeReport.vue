<template>
  <Teleport to="body">
    <div v-if="modelValue" class="prr-overlay" aria-hidden="true">

      <!-- WATERMARK — position:fixed → repeats every printed page -->
      <div class="prr-watermark" aria-hidden="true">
        <p class="prr-watermark__line1">{{ printedBy }}</p>
        <p class="prr-watermark__line2">DOKUMEN INTERNAL</p>
      </div>

      <div class="prr-page">

        <!-- ══════════════════════════════════════════════════════════
             KOP SURAT — Institutional Letterhead
        ═══════════════════════════════════════════════════════════ -->
        <header class="prr-kop">
          <p class="prr-kop__instansi">PROGRAM MAKANAN BERGIZI GRATIS</p>
          <h1 class="prr-kop__lembaga">SISTEM PENGELOLAAN PROGRAM GIZI (SPPG)</h1>
          <p class="prr-kop__alamat">MBG Supply Dashboard &mdash; Enterprise Supply Chain Management</p>
        </header>
        <div class="prr-kop-line"></div>

        <!-- ══════════════════════════════════════════════════════════
             JUDUL DOKUMEN
        ═══════════════════════════════════════════════════════════ -->
        <div class="prr-judul">
          <h2>LAPORAN ANALISIS GIZI RESEP</h2>
          <p>Nomor: {{ docNumber }}</p>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             INFORMASI UMUM
        ═══════════════════════════════════════════════════════════ -->
        <div class="prr-section">
          <h3 class="prr-section__title">I. Informasi Umum</h3>
          <table class="prr-kv-table">
            <tbody>
              <tr>
                <td class="prr-kv-table__label">Nama Resep</td>
                <td class="prr-kv-table__sep">:</td>
                <td class="prr-kv-table__value">{{ recipeName || '—' }}</td>
              </tr>
              <tr>
                <td class="prr-kv-table__label">Tanggal Cetak</td>
                <td class="prr-kv-table__sep">:</td>
                <td class="prr-kv-table__value">{{ printDate }}</td>
              </tr>
              <tr>
                <td class="prr-kv-table__label">Dicetak Oleh</td>
                <td class="prr-kv-table__sep">:</td>
                <td class="prr-kv-table__value">{{ printedBy }}</td>
              </tr>
              <tr>
                <td class="prr-kv-table__label">Total Energi</td>
                <td class="prr-kv-table__sep">:</td>
                <td class="prr-kv-table__value">{{ formatNum(Math.round(totalCalories)) }} kkal</td>
              </tr>
              <tr>
                <td class="prr-kv-table__label">Target Energi Harian</td>
                <td class="prr-kv-table__sep">:</td>
                <td class="prr-kv-table__value">2.000 – 2.700 kkal (Permenkes RI)</td>
              </tr>
              <tr>
                <td class="prr-kv-table__label">Status</td>
                <td class="prr-kv-table__sep">:</td>
                <td class="prr-kv-table__value">{{ calorieStatusText }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             DAFTAR BAHAN BAKU
        ═══════════════════════════════════════════════════════════ -->
        <div class="prr-section" v-if="ingredients.length > 0">
          <h3 class="prr-section__title">II. Daftar Bahan Baku yang Digunakan</h3>
          <p class="prr-section__desc">
            Berikut adalah daftar bahan baku beserta berat yang digunakan dalam resep ini.
          </p>
          <table class="prr-bordered-table">
            <thead>
              <tr>
                <th class="col-no">No.</th>
                <th>Nama Bahan Baku</th>
                <th class="col-right">Berat (gram)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in ingredients" :key="item.id">
                <td class="col-no">{{ idx + 1 }}</td>
                <td>{{ item.namaIngredient }}</td>
                <td class="col-right">{{ item.gram }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             HASIL ANALISIS MAKRONUTRISI
        ═══════════════════════════════════════════════════════════ -->
        <div class="prr-section">
          <h3 class="prr-section__title">{{ ingredients.length > 0 ? 'III' : 'II' }}. Hasil Analisis Komposisi Makronutrisi</h3>
          <p class="prr-section__desc">
            Tabel berikut menyajikan hasil kalkulasi kandungan makronutrisi berdasarkan
            bahan baku yang digunakan, dengan rujukan rentang ideal dari Pedoman Gizi Seimbang
            Kementerian Kesehatan RI (Permenkes No. 41 Tahun 2014).
          </p>
          <table class="prr-bordered-table">
            <thead>
              <tr>
                <th class="col-no">No.</th>
                <th>Makronutrisi</th>
                <th class="col-right">Jumlah (gram)</th>
                <th class="col-right">Kontribusi Energi (%)</th>
                <th class="col-right">Rentang Ideal (%)</th>
                <th class="col-center">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="col-no">1</td>
                <td>Protein</td>
                <td class="col-right">{{ formatDec(protein.val) }}</td>
                <td class="col-right">{{ protein.percent }}%</td>
                <td class="col-right">15 – 20%</td>
                <td class="col-center">{{ evalText(protein.percent, 15, 20) }}</td>
              </tr>
              <tr>
                <td class="col-no">2</td>
                <td>Karbohidrat</td>
                <td class="col-right">{{ formatDec(karbohidrat.val) }}</td>
                <td class="col-right">{{ karbohidrat.percent }}%</td>
                <td class="col-right">45 – 60%</td>
                <td class="col-center">{{ evalText(karbohidrat.percent, 45, 60) }}</td>
              </tr>
              <tr>
                <td class="col-no">3</td>
                <td>Lemak</td>
                <td class="col-right">{{ formatDec(lemak.val) }}</td>
                <td class="col-right">{{ lemak.percent }}%</td>
                <td class="col-right">20 – 30%</td>
                <td class="col-center">{{ evalText(lemak.percent, 20, 30) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             KESIMPULAN & REKOMENDASI
        ═══════════════════════════════════════════════════════════ -->
        <div class="prr-section">
          <h3 class="prr-section__title">{{ ingredients.length > 0 ? 'IV' : 'III' }}. Kesimpulan dan Rekomendasi</h3>

          <p class="prr-paragraph">{{ conclusionParagraph }}</p>

          <p class="prr-paragraph" v-if="recommendationParagraph">
            <strong>Rekomendasi:</strong> {{ recommendationParagraph }}
          </p>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             TANDA TANGAN
        ═══════════════════════════════════════════════════════════ -->
        <div class="prr-ttd">
          <div class="prr-ttd__col prr-ttd__col--left">
            <p class="prr-ttd__role">Dibuat oleh,</p>
            <div class="prr-ttd__space"></div>
            <p class="prr-ttd__name">{{ printedBy }}</p>
            <p class="prr-ttd__jabatan">Operator Sistem</p>
          </div>
          <div class="prr-ttd__col prr-ttd__col--right">
            <p class="prr-ttd__role">Mengetahui,</p>
            <div class="prr-ttd__space"></div>
            <p class="prr-ttd__name">(_________________________)</p>
            <p class="prr-ttd__jabatan">Penanggung Jawab Program Gizi</p>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             FOOTER
        ═══════════════════════════════════════════════════════════ -->
        <footer class="prr-footer">
          <p>Dokumen ini dicetak secara otomatis oleh sistem MBG Supply Dashboard dan merupakan dokumen internal.</p>
          <p>{{ docNumber }} &mdash; Halaman 1</p>
        </footer>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MacroNutrient, BahanItemData } from '@/types/gizi'
import { formatNum, formatDec } from '@/utils/format'

const props = defineProps<{
  modelValue: boolean
  recipeName: string
  totalCalories: number
  protein: MacroNutrient
  karbohidrat: MacroNutrient
  lemak: MacroNutrient
  printedBy: string
  ingredients: Array<BahanItemData & { namaIngredient: string }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

// ── Document number ───────────────────────────────────────────────────────────
const docNumber = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(now.getTime() / 1000) % 10000).padStart(4, '0')
  return `MBG/GIZI/${y}${m}${d}-${seq}`
})

// ── Date ──────────────────────────────────────────────────────────────────────
const printDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// ── Calorie status ────────────────────────────────────────────────────────────
const calorieStatusText = computed(() => {
  const c = props.totalCalories
  if (c <= 0) return 'Belum dikalkulasi'
  if (c >= 2000 && c <= 2700) return 'Memenuhi target (dalam rentang 2.000–2.700 kkal)'
  if (c < 2000) return `Belum memenuhi target — kurang ${(2000 - c).toFixed(0)} kkal dari batas minimum`
  return `Melebihi target — lebih ${(c - 2700).toFixed(0)} kkal dari batas maksimum`
})

// ── Evaluation text ───────────────────────────────────────────────────────────
function evalText(val: number, min: number, max: number): string {
  if (val >= min && val <= max) return 'Sesuai'
  return val > max ? 'Melebihi batas' : 'Di bawah batas'
}

// ── Score level ───────────────────────────────────────────────────────────────
type Level = 'balanced' | 'high-fat' | 'high-protein' | 'high-carb' | 'empty'

const level = computed<Level>(() => {
  if (props.totalCalories <= 0) return 'empty'
  const pOk = props.protein.percent >= 15 && props.protein.percent <= 20
  const kOk = props.karbohidrat.percent >= 45 && props.karbohidrat.percent <= 60
  const lOk = props.lemak.percent >= 20 && props.lemak.percent <= 30
  if (pOk && kOk && lOk) return 'balanced'
  if (props.lemak.percent > 30) return 'high-fat'
  if (props.protein.percent > 20) return 'high-protein'
  if (props.karbohidrat.percent > 60) return 'high-carb'
  return 'balanced'
})

// ── Conclusion paragraph ──────────────────────────────────────────────────────
const conclusionParagraph = computed(() => {
  const map: Record<Level, string> = {
    balanced:
      `Berdasarkan hasil analisis, resep "${props.recipeName}" memiliki komposisi makronutrisi yang seimbang dengan total energi ${formatNum(Math.round(props.totalCalories))} kkal. Seluruh parameter makronutrisi (protein, karbohidrat, dan lemak) berada dalam rentang ideal yang dianjurkan oleh Pedoman Gizi Seimbang Kementerian Kesehatan RI. Resep ini memenuhi persyaratan untuk digunakan dalam Program Makanan Bergizi Gratis (MBG).`,
    'high-protein':
      `Berdasarkan hasil analisis, resep "${props.recipeName}" memiliki kandungan protein sebesar ${props.protein.percent}% dari total kontribusi energi, yang melebihi rentang ideal 15–20%. Meskipun asupan protein tinggi bermanfaat untuk pertumbuhan, komposisi ini belum sepenuhnya seimbang sesuai anjuran Kemenkes.`,
    'high-fat':
      `Berdasarkan hasil analisis, resep "${props.recipeName}" memiliki kontribusi lemak sebesar ${props.lemak.percent}% dari total energi, melebihi batas anjuran maksimum 30%. Kondisi ini menunjukkan bahwa resep perlu penyesuaian agar komposisi makronutrisi lebih seimbang.`,
    'high-carb':
      `Berdasarkan hasil analisis, resep "${props.recipeName}" memiliki kontribusi karbohidrat sebesar ${props.karbohidrat.percent}% dari total energi, melebihi batas anjuran maksimum 60%. Resep memerlukan penambahan sumber protein atau lemak sehat untuk mencapai keseimbangan gizi.`,
    empty:
      'Analisis gizi belum dapat dilakukan karena kalkulasi belum dijalankan. Silakan tambahkan bahan baku dan lakukan kalkulasi terlebih dahulu.',
  }
  return map[level.value]
})

const recommendationParagraph = computed<string>(() => {
  const map: Record<Level, string> = {
    balanced: '',
    'high-protein':
      'Disarankan untuk menambah sumber karbohidrat kompleks (nasi, kentang, ubi jalar) agar kontribusi energi dari protein kembali ke rentang 15–20%.',
    'high-fat':
      'Disarankan untuk mengurangi penggunaan bahan berlemak tinggi (minyak goreng, mentega, santan) atau mengganti metode pengolahan dari menggoreng ke mengukus/memanggang.',
    'high-carb':
      'Disarankan untuk menambah sumber protein hewani maupun nabati (telur, dada ayam, tahu, tempe) agar kontribusi energi dari karbohidrat kembali ke rentang 45–60%.',
    empty: '',
  }
  return map[level.value]
})
</script>
