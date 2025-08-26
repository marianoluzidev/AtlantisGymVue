import { storeToRefs } from 'pinia'
import { useAlertStore } from '../stores/alert.js'   // 👈 relativa

export function useAlert() {
  const store = useAlertStore()
  const { isOpen, title, message, type, confirmText, cancelText, closeOnBackdrop } = storeToRefs(store)
  return { isOpen, title, message, type, confirmText, cancelText, closeOnBackdrop, open: store.open, close: store.close }
}

// Alert de un botón
export function alert(options = {}) {
  const store = useAlertStore()
  const opts = { ...options, cancelText: null } // forzamos 1 botón
  return store.open(opts)
}

// Confirm de dos botones (Promise<boolean>)
export function confirm(options = {}) {
  const store = useAlertStore()
  const opts = { ...options }
  if (!('confirmText' in opts)) opts.confirmText = 'Aceptar'
  if (!('cancelText' in opts))  opts.cancelText  = 'Cancelar'
  return store.open(opts)
}
