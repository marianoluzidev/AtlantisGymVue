<template>
  <teleport to="body">
    <div
      v-show="isOpen"
      class="am-backdrop"
      :aria-hidden="!isOpen"
      @click="onBackdrop"
    >
      <div
        class="am-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="am-title"
        aria-describedby="am-message"
        :data-type="type"
        @keydown.escape.prevent.stop="close(false)"
        @keydown.enter.prevent.stop="close(true)"
        @keydown.tab.prevent
        @click.stop
      >
        <div class="am-header">
          <span class="am-icon" aria-hidden="true" v-html="iconSvg"></span>
          <h2 id="am-title" class="am-title">{{ title }}</h2>
        </div>

        <p id="am-message" class="am-message">{{ message }}</p>

        <div class="am-actions">
          <button
            v-if="cancelText"
            id="app-alert-cancel"
            type="button"
            class="am-btn am-btn-cancel"
            @click="close(false)"
          >
            {{ cancelText }}
          </button>
          <button
            id="app-alert-confirm"
            type="button"
            class="am-btn am-btn-confirm"
            @click="close(true)"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useAlert } from '../composables/useAlert.js'   // 👈 relativa

const { isOpen, title, message, type, confirmText, cancelText, closeOnBackdrop, close } = useAlert()

function onBackdrop(e) {
  if (!closeOnBackdrop.value) return
  if (e.target.classList.contains('am-backdrop')) close(false)
}

const iconSvg = computed(() => {
  const common = 'width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
  switch (type.value) {
    case 'success':
      return `<svg ${common}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`
    case 'warning':
      return `<svg ${common}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    case 'error':
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    default:
      return `<svg ${common}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
})
</script>

<style scoped>
.am-backdrop {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .5);
  z-index: 2147483647;
}
.am-backdrop[aria-hidden="false"],
.am-backdrop:not([aria-hidden]) { display: flex; }

.am-dialog {
  width: 50%;
  max-width: 420px;
  min-width: 260px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
  padding: 16px;
  transform: translateY(8px);
  opacity: 0;
  transition: opacity .15s ease, transform .15s ease;
}
.am-backdrop[aria-hidden="false"] .am-dialog,
.am-backdrop:not([aria-hidden]) .am-dialog {
  opacity: 1; transform: translateY(0);
}

.am-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.am-icon   { display: inline-flex; padding: 6px; border-radius: 50%; background: var(--am-icon-bg, #eef2ff); color: var(--am-icon-fg, #3b82f6); }

.am-dialog[data-type="success"] .am-icon { --am-icon-bg: #ecfdf5; --am-icon-fg: #10b981; }
.am-dialog[data-type="info"]    .am-icon { --am-icon-bg: #eff6ff; --am-icon-fg: #3b82f6; }
.am-dialog[data-type="warning"] .am-icon { --am-icon-bg: #fffbeb; --am-icon-fg: #f59e0b; }
.am-dialog[data-type="error"]   .am-icon { --am-icon-bg: #fef2f2; --am-icon-fg: #ef4444; }

.am-title { margin: 0; font-size: 18px; font-weight: 700; }
.am-message { margin: 8px 0 16px; line-height: 1.5; color: #333; }
.am-actions { display: flex; justify-content: flex-end; gap: 8px; }

.am-btn { border: 0; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.am-btn-confirm { background: #111; color: #fff; }
.am-btn-cancel  { background: #e5e7eb; color: #111; }
</style>
