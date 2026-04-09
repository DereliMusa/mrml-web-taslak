// composables/useToast.js

export function useToast() {
  const toasts = useState('toasts', () => [])

  function showToast(msg, type = 'info', duration = 3500) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, msg, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, showToast, removeToast }
}
