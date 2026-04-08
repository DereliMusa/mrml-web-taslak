// admin/admin.js -- Ortak yardimci fonksiyonlar

const API = '/api';

// ===========================
// AUTH
// ===========================
function getToken() { return localStorage.getItem('mrml_token'); }
function setToken(t) { localStorage.setItem('mrml_token', t); }
function getUser()  { try { return JSON.parse(localStorage.getItem('mrml_user') || 'null'); } catch { return null; } }
function setUser(u) { localStorage.setItem('mrml_user', JSON.stringify(u)); }

function clearAuth() {
  localStorage.removeItem('mrml_token');
  localStorage.removeItem('mrml_user');
}

async function checkAuth() {
  const token = getToken();
  if (!token) { location.href = '/admin/'; return null; }
  const r = await apiFetch('/auth/me');
  if (!r.ok) { clearAuth(); location.href = '/admin/'; return null; }
  const { user } = await r.json();
  setUser(user);
  return user;
}

async function logout() {
  await apiFetch('/auth/logout', { method: 'POST' });
  clearAuth();
  location.href = '/admin/';
}

// ===========================
// API FETCH YARDIMCISI
// ===========================
async function apiFetch(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (opts.body && typeof opts.body === 'object') opts.body = JSON.stringify(opts.body);
  return fetch(`${API}${path}`, { ...opts, headers });
}

async function apiJSON(path, opts = {}) {
  const r = await apiFetch(path, opts);
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Bir hata olustu.');
  return data;
}

// ===========================
// TOAST
// ===========================
function initToasts() {
  if (!document.getElementById('toast-container')) {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
}

function showToast(msg, type = 'info') {
  initToasts();
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span class="toast-text">${msg}</span>`;
  document.getElementById('toast-container').appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => { t.classList.add('show'); }); });
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

// ===========================
// MODAL
// ===========================
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

// ESC ile modal kapat
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

// Overlay tiklamasinda kapat
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('open');
});

// ===========================
// SIDEBAR (mobil)
// ===========================
function initSidebar() {
  const toggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });
}

// ===========================
// AKTIF NAV ITEM
// ===========================
function setActiveNav() {
  const page = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

// ===========================
// KULLANICI UI GUNCELLE
// ===========================
function renderUserInfo() {
  const user = getUser();
  if (!user) return;
  const nameEl = document.getElementById('sidebar-username');
  const roleEl = document.getElementById('sidebar-role');
  const avatarEl = document.getElementById('sidebar-avatar');
  if (nameEl) nameEl.textContent = user.username || user.email;
  if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Yonetici' : 'Uye';
  if (avatarEl) avatarEl.textContent = (user.username || user.email || '?')[0].toUpperCase();
}

// ===========================
// DOSYA YUKLE
// ===========================
async function uploadFile(file) {
  const token = getToken();
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || 'Yukleme hatasi.');
  return data.url;
}

// Drag & Drop gorsel yukleme baglayici
function initImageUpload(uploadAreaId, previewId, urlInputId, onUrl) {
  const area = document.getElementById(uploadAreaId);
  const preview = previewId ? document.getElementById(previewId) : null;
  const urlInput = urlInputId ? document.getElementById(urlInputId) : null;
  if (!area) return;

  const fileInput = area.querySelector('input[type="file"]');
  if (!fileInput) return;

  const updatePreview = (url) => {
    if (preview && url) {
      preview.innerHTML = `<img src="${url}" class="img-preview" alt="Onizleme">`;
    }
    if (urlInput) urlInput.value = url;
    if (onUrl) onUrl(url);
  };

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      showToast('Gorsel yukleniyor...', 'info');
      const url = await uploadFile(file);
      updatePreview(url);
      showToast('Gorsel yuklendi.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  });

  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', async e => {
    e.preventDefault();
    area.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    try {
      showToast('Gorsel yukleniyor...', 'info');
      const url = await uploadFile(file);
      updatePreview(url);
      showToast('Gorsel yuklendi.', 'success');
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
}

// ===========================
// BASIT RICH TEXT EDITOR
// ===========================
function initEditor(toolbarId, areaId) {
  const toolbar = document.getElementById(toolbarId);
  const area = document.getElementById(areaId);
  if (!toolbar || !area) return;

  area.contentEditable = 'true';

  toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.val || null;
      document.execCommand(cmd, false, val);
      area.focus();
    });
    btn.addEventListener('mousedown', e => e.preventDefault());
  });
}

// Editor HTML degerini al / ayarla
function getEditorHTML(areaId) {
  const el = document.getElementById(areaId);
  return el ? el.innerHTML : '';
}

function setEditorHTML(areaId, html) {
  const el = document.getElementById(areaId);
  if (el) el.innerHTML = html || '';
}

// ===========================
// YARDIMcI: Tarih formatla
// ===========================
function fmtDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===========================
// CONFIRM DIALOG
// ===========================
function confirmAction(msg, onConfirm) {
  const overlay = document.getElementById('confirm-overlay');
  const msgEl = document.getElementById('confirm-msg');
  const okBtn = document.getElementById('confirm-ok');
  if (!overlay) {
    if (confirm(msg)) onConfirm();
    return;
  }
  msgEl.textContent = msg;
  overlay.classList.add('open');
  const handler = () => {
    overlay.classList.remove('open');
    okBtn.removeEventListener('click', handler);
    onConfirm();
  };
  okBtn.addEventListener('click', handler);
}

// ===========================
// INIT (sayfa yuklenmesinde)
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  setActiveNav();
  renderUserInfo();

  // Logout butonlari
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', () => logout());
  });

  // Modal kapat butonlari
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
});
