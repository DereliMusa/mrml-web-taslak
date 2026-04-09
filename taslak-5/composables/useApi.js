// composables/useApi.js
// Fetch wrapper -- auth token ile

export function useApi() {
  function getToken() {
    if (import.meta.server) return null
    return localStorage.getItem('mrml_token')
  }

  async function apiFetch(path, opts = {}) {
    const token = getToken()
    const headers = { 'Content-Type': 'application/json', ...opts.headers }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const body = opts.body && typeof opts.body === 'object'
      ? JSON.stringify(opts.body)
      : opts.body

    const res = await fetch(`/api${path}`, { ...opts, headers, body })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || data.error || 'Bir hata olustu.')
    return data
  }

  async function uploadFile(file) {
    const token = getToken()
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: fd,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Yukleme hatasi.')
    return data.url
  }

  return { apiFetch, uploadFile }
}
