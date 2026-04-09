// composables/useAuth.js

export function useAuth() {
  const user = useState('auth_user', () => null)

  function getToken() {
    if (import.meta.server) return null
    return localStorage.getItem('mrml_token')
  }

  function setToken(t) { localStorage.setItem('mrml_token', t) }

  function setUserFromStorage() {
    try {
      const raw = localStorage.getItem('mrml_user')
      user.value = raw ? JSON.parse(raw) : null
    } catch { user.value = null }
  }

  async function checkAuth() {
    const token = getToken()
    if (!token) {
      await navigateTo('/admin/')
      return null
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const { user: u } = await res.json()
      user.value = u
      localStorage.setItem('mrml_user', JSON.stringify(u))
      return u
    } catch {
      clearAuth()
      await navigateTo('/admin/')
      return null
    }
  }

  function clearAuth() {
    if (import.meta.client) {
      localStorage.removeItem('mrml_token')
      localStorage.removeItem('mrml_user')
    }
    user.value = null
  }

  async function logout() {
    const token = getToken()
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    clearAuth()
    await navigateTo('/admin/')
  }

  async function loginWithPassword(username, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Giris basarisiz.')
    setToken(data.token)
    localStorage.setItem('mrml_user', JSON.stringify(data.user))
    user.value = data.user
    return data.user
  }

  async function loginWithToken(token) {
    const res = await fetch('/api/auth/token-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Gecersiz token.')
    setToken(data.token)
    localStorage.setItem('mrml_user', JSON.stringify(data.user))
    user.value = data.user
    return data.user
  }

  return { user, checkAuth, logout, loginWithPassword, loginWithToken, setUserFromStorage, getToken }
}
