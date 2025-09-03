import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => ({
    isOpen: false,
    title: 'Aviso',
    message: '',
    type: 'info',          // success | info | warning | error
    confirmText: 'Aceptar',
    cancelText: null,      // si tiene valor, aparece botón "Cancelar"
    closeOnBackdrop: true,
    _resolver: null,
    _lastFocused: null,
  }),
  actions: {
    open(opts = {}) {
      const { title, message, type, confirmText, cancelText, closeOnBackdrop } = opts
      this.title = title ?? 'Aviso'
      this.message = message ?? ''
      this.type = type ?? 'info'
      this.confirmText = confirmText ?? 'Aceptar'
      this.cancelText = cancelText ?? null
      this.closeOnBackdrop = closeOnBackdrop ?? true
      this.isOpen = true
      this._lastFocused = document.activeElement || null

      return new Promise((resolve) => {
        this._resolver = resolve
        requestAnimationFrame(() => {
          const btn = document.getElementById('app-alert-confirm')
          if (btn) btn.focus()
        })
      })
    },
    close(result = true) {
      this.isOpen = false
      if (this._resolver) this._resolver(result)
      this._resolver = null
      if (this._lastFocused && typeof this._lastFocused.focus === 'function') {
        this._lastFocused.focus()
      }
      this._lastFocused = null
    },
  },
})
