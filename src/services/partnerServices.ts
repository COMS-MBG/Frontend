import type { PartnerImportRow } from '@/types/partner'

const COLUMN_MAP: Record<string, keyof PartnerImportRow | null> = {
  // school_name
  'nama sekolah':      'school_name',
  'nama_sekolah':      'school_name',
  'school name':       'school_name',
  'school_name':       'school_name',
  // npsn
  'npsn':              'npsn',
  // school_type
  'bentuk':            'school_type',
  'jenis':             'school_type',
  'school type':       'school_type',
  'school_type':       'school_type',
  // ownership_status
  'status':            'ownership_status',
  'ownership status':  'ownership_status',
  'ownership_status':  'ownership_status',
  // address
  'alamat':            'address',
  'address':           'address',
  // district
  'kecamatan':         'district',
  'district':          'district',
  // city
  'kabupaten/kota':    'city',
  'kabupaten kota':    'city',
  'kabupaten_kota':    'city',
  'kota':              'city',
  'city':              'city',
  // latitude
  'latitude':          'latitude',
  'lat':               'latitude',
  'lintang':           'latitude',
  // longitude
  'longitude':         'longitude',
  'lng':               'longitude',
  'long':              'longitude',
  'bujur':             'longitude',
  // portion_count
  'jumlah porsi':      'portion_count',
  'jumlah_porsi':      'portion_count',
  'porsi':             'portion_count',
  'total porsi':       'portion_count',
  'portion count':     'portion_count',
  'portion_count':     'portion_count',
  // skip-only
  'no':                null,
}

/** Internal keys that must be covered by at least one CSV header alias */
const REQUIRED_KEYS: Array<keyof PartnerImportRow> = [
  'school_name', 'school_type', 'ownership_status', 'portion_count',
]

/** Human-readable labels for required keys (error messages) */
const REQUIRED_LABELS: Record<string, string> = {
  school_name:      'Nama Sekolah',
  school_type:      'Bentuk',
  ownership_status: 'Status',
  portion_count:    'Jumlah Porsi',
}

export interface CsvValidationResult {
  isValid: boolean
  errors: string[]
  headers: string[]
  /** Which required columns are present (for checklist UI) */
  columnStatus: Array<{ key: string; label: string; found: boolean }>
  rows: PartnerImportRow[]
  totalRows: number
}

function normalizeHeader(raw: string): string {
  // Strip UTF-8 BOM (U+FEFF)
  let h = raw.replace(/^\uFEFF/, '')
  h = h.trim().toLowerCase()
  h = h.replace(/_/g, ' ')
  h = h.replace(/\s+/g, ' ')
  return h
}

/**
 * Detect CSV delimiter from the first line.
 * Supports comma, semicolon (European Excel), and tab.
 */
function detectDelimiter(firstLine: string): string {
  const semicolons = (firstLine.match(/;/g) || []).length
  const commas     = (firstLine.match(/,/g) || []).length
  const tabs       = (firstLine.match(/\t/g) || []).length

  if (semicolons > commas) return ';'
  if (tabs > commas) return '\t'
  return ','
}

/**
 * Parse a CSV file for client-side preview.
 * Normalization logic is aligned 1:1 with backend PartnerService::parseCsv.
 */
export function parseCsvFile(file: File): Promise<CsvValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      let text = event.target?.result as string
      if (!text) {
        resolve({ isValid: false, errors: ['File kosong.'], headers: [], columnStatus: [], rows: [], totalRows: 0 })
        return
      }

      // Strip UTF-8 BOM
      text = text.replace(/^\uFEFF/, '')

      const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '')
      if (lines.length < 2) {
        resolve({ isValid: false, errors: ['File harus memiliki header dan minimal 1 baris data.'], headers: [], columnStatus: [], rows: [], totalRows: 0 })
        return
      }

      // Detect delimiter
      const delimiter = detectDelimiter(lines[0]!)

      // Parse header
      const rawHeaders = parseCsvLine(lines[0]!, delimiter)

      // Normalize + map headers (same logic as backend)
      const mappedHeaders: Array<keyof PartnerImportRow | null> = []
      const coveredKeys = new Set<string>()

      for (const raw of rawHeaders) {
        const normalized = normalizeHeader(raw)

        // Try normalized form first
        let mapped = COLUMN_MAP[normalized] ?? undefined

        // Fallback: try raw lowercase+trim (for "kabupaten/kota" where / stays)
        if (mapped === undefined) {
          const rawLower = raw.replace(/^\uFEFF/, '').trim().toLowerCase()
          mapped = COLUMN_MAP[rawLower] ?? undefined
        }

        const internal = mapped ?? null
        mappedHeaders.push(internal)
        if (internal) coveredKeys.add(internal)
      }

      // Build column status checklist
      const columnStatus = REQUIRED_KEYS.map((key) => ({
        key,
        label: REQUIRED_LABELS[key] ?? key,
        found: coveredKeys.has(key),
      }))

      // Validate required columns
      const missingLabels = columnStatus.filter((c) => !c.found).map((c) => c.label)

      if (missingLabels.length > 0) {
        resolve({
          isValid: false,
          errors: [`Kolom wajib tidak ditemukan: ${missingLabels.join(', ')}.`],
          headers: rawHeaders,
          columnStatus,
          rows: [],
          totalRows: 0,
        })
        return
      }

      // Map column indexes
      const columnIndexes: Record<string, number> = {}
      mappedHeaders.forEach((key, index) => {
        if (key) columnIndexes[key] = index
      })

      // Parse data rows
      const rows: PartnerImportRow[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]!, delimiter)
        const row: PartnerImportRow = {
          school_name:      getVal(values, columnIndexes, 'school_name'),
          npsn:             getVal(values, columnIndexes, 'npsn'),
          school_type:      getVal(values, columnIndexes, 'school_type'),
          ownership_status: getVal(values, columnIndexes, 'ownership_status'),
          address:          getVal(values, columnIndexes, 'address'),
          district:         getVal(values, columnIndexes, 'district'),
          city:             getVal(values, columnIndexes, 'city'),
          latitude:         getVal(values, columnIndexes, 'latitude'),
          longitude:        getVal(values, columnIndexes, 'longitude'),
          portion_count:    parseInt(getVal(values, columnIndexes, 'portion_count') || '0', 10) || 0,
        }

        // Skip rows with empty school name
        if (row.school_name.trim()) {
          rows.push(row)
        }
      }

      resolve({
        isValid: true,
        errors: [],
        headers: rawHeaders,
        columnStatus,
        rows,
        totalRows: rows.length,
      })
    }

    reader.onerror = () => {
      resolve({ isValid: false, errors: ['Gagal membaca file.'], headers: [], columnStatus: [], rows: [], totalRows: 0 })
    }

    reader.readAsText(file, 'UTF-8')
  })
}

/** Validate that a file has an acceptable extension and size */
export function validateFileFormat(file: File): string | null {
  const validExtensions = ['csv', 'txt', 'xlsx', 'xls']
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (!validExtensions.includes(ext)) {
    return `Format file "${ext}" tidak didukung. Gunakan CSV atau Excel.`
  }

  if (file.size > 10 * 1024 * 1024) {
    return 'Ukuran file melebihi batas 10MB.'
  }

  return null
}

/**
 * Generate a CSV template string for download.
 * Headers match the expected backend column names exactly.
 */
export function generateCsvTemplate(): string {
  const headers = ['Nama Sekolah', 'NPSN', 'Bentuk', 'Status', 'Alamat', 'Kecamatan', 'Kabupaten/Kota', 'Latitude', 'Longitude', 'Jumlah Porsi']
  const example = ['SMA Negeri 1 Bandung', '20219157', 'SMA', 'Negeri', 'Jl. Merdeka No. 1', 'Sumur Bandung', 'Kota Bandung', '-6.9175', '107.6191', '150']
  return headers.join(',') + '\n' + example.join(',') + '\n'
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseCsvLine(line: string, delimiter = ','): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function getVal(values: string[], indexes: Record<string, number>, key: string): string {
  const idx = indexes[key]
  return idx !== undefined && idx < values.length && values[idx] !== undefined ? values[idx] : ''
}
