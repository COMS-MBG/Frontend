import { ref, readonly } from 'vue'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
}

// Module-level singleton so all components share the same toast queue
const toasts = ref<ToastMessage[]>([])
let _nextId = 1

export function useToast() {
  function show(message: string, variant: ToastVariant, duration = 3500): void {
    const id = _nextId++
    toasts.value.push({ id, message, variant })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: number): void {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function success(message: string): void { show(message, 'success') }
  function error(message: string): void   { show(message, 'error', 5000) }
  function warning(message: string): void { show(message, 'warning') }
  function info(message: string): void    { show(message, 'info') }

  return {
    toasts: readonly(toasts),
    show,
    dismiss,
    success,
    error,
    warning,
    info,
  }
}
