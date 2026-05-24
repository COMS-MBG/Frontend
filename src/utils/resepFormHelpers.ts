import type { z } from 'zod'
import type { BahanItemData, ResepFormErrors, NutritionResult } from '@/types/gizi'

// ── Debounce utility ────────────────────────────────────────
// Generic debounce — pure function, no reactivity.
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

// ── Default empty nutrition result ──────────────────────────
export function createEmptyResult(): NutritionResult {
  return {
    calories: 0,
    protein: { val: 0, percent: 0 },
    karbo: { val: 0, percent: 0 },
    lemak: { val: 0, percent: 0 },
  }
}

// ── Default empty bahan row ─────────────────────────────────
export function createEmptyBahan(): BahanItemData {
  return { id: Date.now().toString(), bahanId: '', gram: 0 }
}

// ── Zod error → typed form errors ───────────────────────────
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
