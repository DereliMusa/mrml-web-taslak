// server.js -- MrML Lab Admin Panel Backend
// Calistirma: node server.js
// Port: 3737

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const PORT = 3737;
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, 'db', 'mrml.db');

// ===========================
// VERITABANI
// ===========================
let db;
function getDB() {
  if (!db) {
    if (!fs.existsSync(DB_PATH)) {
      console.error('Veritabani bulunamadi. Once "node db/seed.js" calistirin.');
      process.exit(1);
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// ===========================
// YARDIMCILAR
// ===========================
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(new Error('Gecersiz JSON')); }
    });
    req.on('error', reject);
  });
}

function getSessionUser(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  const database = getDB();
  const session = database.prepare(
    "SELECT s.*, u.id as user_id, u.username, u.email, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now')"
  ).get(token);
  return session || null;
}

function requireAuth(req, res) {
  const user = getSessionUser(req);
  if (!user) {
    sendJSON(res, 401, { error: 'Yetkisiz erisim. Lutfen giris yapin.' });
    return null;
  }
  return user;
}

function requireAdmin(req, res) {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    sendJSON(res, 403, { error: 'Bu islem icin admin yetkisi gereklidir.' });
    return null;
  }
  return user;
}

// OTP gonder (Gmail SMTP veya log modu)
async function sendOTPEmail(email, token, scope) {
  const database = getDB();
  const getSetting = (k) => database.prepare("SELECT value FROM site_settings WHERE key = ?").get(k)?.value || '';
  const mode = getSetting('smtp_mode');
  const expireHours = parseInt(getSetting('otp_expire_hours') || '24');
  const link = `http://localhost:${PORT}/admin/?token=${token}`;

  console.log('\n===== OTP TOKEN =====');
  console.log(`Alici: ${email} | Kapsam: ${scope} | Gecerlilik: ${expireHours}h`);
  console.log(`Token: ${token}`);
  console.log(`Link: ${link}`);
  console.log('=====================\n');

  if (mode === 'smtp') {
    const host = getSetting('smtp_host');
    const port = parseInt(getSetting('smtp_port') || '587');
    const user = getSetting('smtp_user');
    const pass = getSetting('smtp_pass');
    const fromEmail = getSetting('contact_email') || user;

    if (!host || !user || !pass) {
      console.warn('SMTP ayarlari eksik, sadece log modunda calisiliyor.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host, port,
      secure: port === 465,
      auth: { user, pass },
    });

    const scopeLabels = { blog: 'Blog', news: 'Haber', publications: 'Yayin', full: 'Tam Erisim' };
    const scopeLabel = scopeLabels[scope] || scope;

    await transporter.sendMail({
      from: `"MrML Lab" <${user}>`,
      to: email,
      subject: `MrML Lab -- Gecici Giris Linkiniz (${scopeLabel})`,
      html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#111118;border:1px solid rgba(255,255,255,0.07);border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#18181f;padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.07);">
          <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;">
            <span style="color:#f0f0f0;">Mr</span><span style="color:#C69749;">ML</span>
            <span style="color:#5a5d70;font-weight:400;font-size:17px;"> Lab</span>
          </span>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 32px 28px;">
          <p style="color:#b0b3c6;font-size:14px;margin:0 0 8px;">Merhaba,</p>
          <h1 style="color:#f0f0f0;font-size:20px;font-weight:700;margin:0 0 20px;line-height:1.3;">Admin paneline giris icin gecici linkiniz hazir.</h1>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181f;border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:28px;">
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.07);">
                <span style="color:#5a5d70;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Erisim Kapsamı</span>
                <div style="color:#C69749;font-size:14px;font-weight:600;margin-top:4px;">${scopeLabel}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 18px;">
                <span style="color:#5a5d70;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Gecerlilik Suresi</span>
                <div style="color:#f0f0f0;font-size:14px;font-weight:600;margin-top:4px;">${expireHours} saat &bull; Tek kullanimlik</div>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding-bottom:28px;">
              <a href="${link}"
                 style="display:inline-block;background:#C69749;color:#0a0a0f;padding:14px 36px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
                Admin Paneline Giris Yap
              </a>
            </td></tr>
          </table>

          <!-- Token (backup) -->
          <div style="background:#0a0a0f;border:1px solid rgba(255,255,255,0.05);border-radius:6px;padding:12px 16px;margin-bottom:24px;">
            <p style="color:#5a5d70;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Buton calismiyorsa token kodunu girin</p>
            <code style="color:#C69749;font-size:13px;letter-spacing:1px;word-break:break-all;">${token}</code>
            <p style="color:#5a5d70;font-size:11px;margin:6px 0 0;">veya su linki tarayiciniza kopyalayin:</p>
            <p style="color:#6366f1;font-size:11px;word-break:break-all;margin:4px 0 0;"><a href="${link}" style="color:#6366f1;">${link}</a></p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0d0d14;padding:20px 32px;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#3a3d50;font-size:12px;margin:0;line-height:1.6;">
            Bu e-posta MrML Lab admin paneli tarafindan otomatik gonderilmistir.
            Bu istegi siz yapmadiysa dikkate almayin &mdash; link suresi dolunca gecersiz olacaktir.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
    console.log(`E-posta ${email} adresine gonderildi.`);
  }
}

// ===========================
// STATIK DOSYA SUNUMU
// ===========================
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function serveStatic(req, res, urlPath) {
  let filePath = path.join(ROOT, urlPath);

  // Dizin istegi: index.html ara
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  // .html uzantisi yoksa ekle
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath += '.html';
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end('<h1>404 - Sayfa bulunamadi</h1>');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

// ===========================
// API ROTALAR
// ===========================
const routes = {};

function route(method, pattern, handler) {
  const key = `${method}:${pattern}`;
  routes[key] = { pattern: new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$'), handler, paramNames: (pattern.match(/:([^/]+)/g) || []).map(p => p.slice(1)) };
}

function matchRoute(method, urlPath) {
  for (const [key, r] of Object.entries(routes)) {
    if (!key.startsWith(method + ':')) continue;
    const m = urlPath.match(r.pattern);
    if (m) {
      const params = {};
      r.paramNames.forEach((name, i) => { params[name] = m[i + 1]; });
      return { handler: r.handler, params };
    }
  }
  return null;
}

// --- AUTH ---

route('POST', '/api/auth/login', async (req, res) => {
  const { username, password } = await readBody(req);
  if (!username || !password) return sendJSON(res, 400, { error: 'Kullanici adi ve sifre gereklidir.' });

  const database = getDB();
  const user = database.prepare('SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1').get(username, username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return sendJSON(res, 401, { error: 'Kullanici adi veya sifre yanlis.' });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0];
  database.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, user.id, expiresAt);

  sendJSON(res, 200, { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
});

route('POST', '/api/auth/send-token', async (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) return;

  const { email, scope } = await readBody(req);
  if (!email) return sendJSON(res, 400, { error: 'E-posta adresi gereklidir.' });

  const database = getDB();
  const expireHours = parseInt(database.prepare("SELECT value FROM site_settings WHERE key = 'otp_expire_hours'").get()?.value || '24');
  const expiresAt = new Date(Date.now() + expireHours * 60 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0];
  const token = generateToken(16);

  database.prepare('INSERT INTO temp_tokens (token, email, scope, expires_at) VALUES (?, ?, ?, ?)').run(token, email, scope || 'blog', expiresAt);
  await sendOTPEmail(email, token, scope || 'blog');

  const mode = database.prepare("SELECT value FROM site_settings WHERE key = 'smtp_mode'").get()?.value || 'log';
  sendJSON(res, 200, { success: true, message: `Token olusturuldu ve ${email} adresine ${mode === 'smtp' ? 'e-posta ile gonderildi' : 'gonderildi (log modu -- konsola yazildi)'}.` });
});

route('POST', '/api/auth/token-login', async (req, res) => {
  const { token } = await readBody(req);
  if (!token) return sendJSON(res, 400, { error: 'Token gereklidir.' });

  const database = getDB();
  const tempToken = database.prepare(
    "SELECT * FROM temp_tokens WHERE token = ? AND used = 0 AND expires_at > datetime('now')"
  ).get(token);

  if (!tempToken) return sendJSON(res, 401, { error: 'Gecersiz veya suresi dolmus token.' });

  database.prepare('UPDATE temp_tokens SET used = 1 WHERE id = ?').run(tempToken.id);

  const sessionToken = generateToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0];

  // Gecici kullanici bul veya yara
  let memberUser = database.prepare('SELECT * FROM users WHERE email = ?').get(tempToken.email);
  if (!memberUser) {
    const result = database.prepare(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).run(tempToken.email, tempToken.email, '', 'member');
    memberUser = database.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }

  database.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(sessionToken, memberUser.id, expiresAt);
  sendJSON(res, 200, { token: sessionToken, scope: tempToken.scope, user: { email: memberUser.email, role: memberUser.role } });
});

route('POST', '/api/auth/logout', async (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (token) getDB().prepare('DELETE FROM sessions WHERE token = ?').run(token);
  sendJSON(res, 200, { success: true });
});

route('GET', '/api/auth/me', async (req, res) => {
  const user = getSessionUser(req);
  if (!user) return sendJSON(res, 401, { error: 'Oturum yok.' });
  sendJSON(res, 200, { user: { id: user.user_id, username: user.username, email: user.email, role: user.role } });
});

// --- GENERIC CRUD FACTORY ---
function crudRoutes(path, table, { listQuery, getQuery, insertFn, updateFn, deletable = true, adminOnly = false }) {
  route('GET', path, async (req, res) => {
    const user = requireAuth(req, res);
    if (!user) return;
    const rows = getDB().prepare(listQuery).all();
    sendJSON(res, 200, rows);
  });

  route('GET', `${path}/:id`, async (req, res, params) => {
    const user = requireAuth(req, res);
    if (!user) return;
    const row = getDB().prepare(getQuery).get(params.id);
    if (!row) return sendJSON(res, 404, { error: 'Kayit bulunamadi.' });
    sendJSON(res, 200, row);
  });

  route('POST', path, async (req, res) => {
    const user = adminOnly ? requireAdmin(req, res) : requireAuth(req, res);
    if (!user) return;
    const body = await readBody(req);
    try {
      const result = insertFn(getDB(), body);
      sendJSON(res, 201, { success: true, id: result.lastInsertRowid });
    } catch (e) {
      sendJSON(res, 400, { error: e.message });
    }
  });

  route('PUT', `${path}/:id`, async (req, res, params) => {
    const user = adminOnly ? requireAdmin(req, res) : requireAuth(req, res);
    if (!user) return;
    const body = await readBody(req);
    try {
      updateFn(getDB(), params.id, body);
      sendJSON(res, 200, { success: true });
    } catch (e) {
      sendJSON(res, 400, { error: e.message });
    }
  });

  if (deletable) {
    route('DELETE', `${path}/:id`, async (req, res, params) => {
      const user = requireAdmin(req, res);
      if (!user) return;
      getDB().prepare(`DELETE FROM ${table} WHERE id = ?`).run(params.id);
      sendJSON(res, 200, { success: true });
    });
  }
}

// --- RESEARCH AREAS ---
crudRoutes('/api/research-areas', 'research_areas', {
  listQuery: 'SELECT * FROM research_areas ORDER BY order_index, id',
  getQuery: 'SELECT * FROM research_areas WHERE id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO research_areas (name, slug, description, icon, color, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(b.name, b.slug || slugify(b.name), b.description || '', b.icon || 'fa-solid fa-flask', b.color || '#6366f1', b.order_index || 0, b.is_active !== undefined ? b.is_active : 1),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE research_areas SET name=?, slug=?, description=?, icon=?, color=?, order_index=?, is_active=?, updated_at=datetime('now') WHERE id=?"
  ).run(b.name, b.slug || slugify(b.name), b.description || '', b.icon, b.color, b.order_index || 0, b.is_active !== undefined ? b.is_active : 1, id),
  adminOnly: true,
});

// --- MEMBERS ---
crudRoutes('/api/members', 'members', {
  listQuery: 'SELECT * FROM members ORDER BY order_index, id',
  getQuery: 'SELECT * FROM members WHERE id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO members (name, title, role, bio, photo_url, email, research_areas, social_scholar, social_orcid, social_linkedin, social_github, social_researchgate, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.name, b.title || '', b.role || 'student', b.bio || '', b.photo_url || '', b.email || '', b.research_areas || '[]', b.social_scholar || '', b.social_orcid || '', b.social_linkedin || '', b.social_github || '', b.social_researchgate || '', b.is_active !== undefined ? b.is_active : 1, b.order_index || 0),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE members SET name=?, title=?, role=?, bio=?, photo_url=?, email=?, research_areas=?, social_scholar=?, social_orcid=?, social_linkedin=?, social_github=?, social_researchgate=?, is_active=?, order_index=?, updated_at=datetime('now') WHERE id=?"
  ).run(b.name, b.title || '', b.role || 'student', b.bio || '', b.photo_url || '', b.email || '', b.research_areas || '[]', b.social_scholar || '', b.social_orcid || '', b.social_linkedin || '', b.social_github || '', b.social_researchgate || '', b.is_active !== undefined ? b.is_active : 1, b.order_index || 0, id),
  adminOnly: true,
});

// --- EQUIPMENT ---
crudRoutes('/api/equipment', 'equipment', {
  listQuery: 'SELECT * FROM equipment ORDER BY order_index, id',
  getQuery: 'SELECT * FROM equipment WHERE id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO equipment (name, category, description, specs, photo_url, research_areas, is_active, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.name, b.category || 'lab', b.description || '', b.specs || '', b.photo_url || '', b.research_areas || '[]', b.is_active !== undefined ? b.is_active : 1, b.order_index || 0),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE equipment SET name=?, category=?, description=?, specs=?, photo_url=?, research_areas=?, is_active=?, order_index=?, updated_at=datetime('now') WHERE id=?"
  ).run(b.name, b.category || 'lab', b.description || '', b.specs || '', b.photo_url || '', b.research_areas || '[]', b.is_active !== undefined ? b.is_active : 1, b.order_index || 0, id),
  adminOnly: true,
});

// --- PROJECTS ---
crudRoutes('/api/projects', 'projects', {
  listQuery: 'SELECT p.*, r.name as research_area_name FROM projects p LEFT JOIN research_areas r ON p.research_area_id = r.id ORDER BY p.created_at DESC',
  getQuery: 'SELECT p.*, r.name as research_area_name FROM projects p LEFT JOIN research_areas r ON p.research_area_id = r.id WHERE p.id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO projects (title, slug, summary, description, status, funding_source, funding_amount, start_date, end_date, research_area_id, is_featured, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.title, b.slug || slugify(b.title), b.summary || '', b.description || '', b.status || 'active', b.funding_source || '', b.funding_amount || '', b.start_date || '', b.end_date || '', b.research_area_id || null, b.is_featured ? 1 : 0, b.cover_image || ''),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE projects SET title=?, slug=?, summary=?, description=?, status=?, funding_source=?, funding_amount=?, start_date=?, end_date=?, research_area_id=?, is_featured=?, cover_image=?, updated_at=datetime('now') WHERE id=?"
  ).run(b.title, b.slug || slugify(b.title), b.summary || '', b.description || '', b.status || 'active', b.funding_source || '', b.funding_amount || '', b.start_date || '', b.end_date || '', b.research_area_id || null, b.is_featured ? 1 : 0, b.cover_image || '', id),
  adminOnly: true,
});

// --- PUBLICATIONS ---
crudRoutes('/api/publications', 'publications', {
  listQuery: 'SELECT p.*, r.name as research_area_name FROM publications p LEFT JOIN research_areas r ON p.research_area_id = r.id ORDER BY p.year DESC, p.id DESC',
  getQuery: 'SELECT * FROM publications WHERE id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO publications (title, authors, journal, year, pub_type, doi, abstract, keywords, research_area_id, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.title, b.authors || '', b.journal || '', b.year || new Date().getFullYear(), b.pub_type || 'article', b.doi || '', b.abstract || '', b.keywords || '', b.research_area_id || null, b.is_featured ? 1 : 0),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE publications SET title=?, authors=?, journal=?, year=?, pub_type=?, doi=?, abstract=?, keywords=?, research_area_id=?, is_featured=?, updated_at=datetime('now') WHERE id=?"
  ).run(b.title, b.authors || '', b.journal || '', b.year, b.pub_type || 'article', b.doi || '', b.abstract || '', b.keywords || '', b.research_area_id || null, b.is_featured ? 1 : 0, id),
  adminOnly: false,
});

// --- BLOG POSTS ---
crudRoutes('/api/blog', 'blog_posts', {
  listQuery: 'SELECT b.*, m.name as author_name FROM blog_posts b LEFT JOIN members m ON b.author_id = m.id ORDER BY b.created_at DESC',
  getQuery: 'SELECT * FROM blog_posts WHERE id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO blog_posts (title, slug, content, author_id, category, tags, cover_image, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.title, b.slug || slugify(b.title), b.content || '', b.author_id || null, b.category || '', b.tags || '', b.cover_image || '', b.status || 'draft', b.status === 'published' ? new Date().toISOString().split('T')[0] : null),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE blog_posts SET title=?, slug=?, content=?, author_id=?, category=?, tags=?, cover_image=?, status=?, published_at=COALESCE(CASE WHEN ? = 'published' THEN datetime('now') END, published_at), updated_at=datetime('now') WHERE id=?"
  ).run(b.title, b.slug || slugify(b.title), b.content || '', b.author_id || null, b.category || '', b.tags || '', b.cover_image || '', b.status || 'draft', b.status, id),
  adminOnly: false,
});

// --- NEWS ---
crudRoutes('/api/news', 'news', {
  listQuery: 'SELECT * FROM news ORDER BY created_at DESC',
  getQuery: 'SELECT * FROM news WHERE id = ?',
  insertFn: (db, b) => db.prepare(
    'INSERT INTO news (title, slug, content, category, tags, cover_image, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(b.title, b.slug || slugify(b.title), b.content || '', b.category || 'general', b.tags || '', b.cover_image || '', b.status || 'draft', b.status === 'published' ? new Date().toISOString().split('T')[0] : null),
  updateFn: (db, id, b) => db.prepare(
    "UPDATE news SET title=?, slug=?, content=?, category=?, tags=?, cover_image=?, status=?, published_at=COALESCE(CASE WHEN ? = 'published' THEN datetime('now') END, published_at), updated_at=datetime('now') WHERE id=?"
  ).run(b.title, b.slug || slugify(b.title), b.content || '', b.category || 'general', b.tags || '', b.cover_image || '', b.status || 'draft', b.status, id),
  adminOnly: false,
});

// --- SOCIAL LINKS ---
route('GET', '/api/social', async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  sendJSON(res, 200, getDB().prepare('SELECT * FROM social_links ORDER BY order_index').all());
});

route('PUT', '/api/social/:id', async (req, res, params) => {
  const user = requireAdmin(req, res);
  if (!user) return;
  const b = await readBody(req);
  getDB().prepare('UPDATE social_links SET url=?, is_active=?, order_index=? WHERE id=?').run(b.url || '', b.is_active !== undefined ? b.is_active : 1, b.order_index || 0, params.id);
  sendJSON(res, 200, { success: true });
});

// --- SITE SETTINGS ---
route('GET', '/api/settings', async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  sendJSON(res, 200, getDB().prepare('SELECT * FROM site_settings ORDER BY group_name, key').all());
});

route('PUT', '/api/settings/:key', async (req, res, params) => {
  const user = requireAdmin(req, res);
  if (!user) return;
  const { value } = await readBody(req);
  getDB().prepare("UPDATE site_settings SET value=?, updated_at=datetime('now') WHERE key=?").run(value || '', params.key);
  sendJSON(res, 200, { success: true });
});

// --- USERS (Admin) ---
route('GET', '/api/users', async (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) return;
  const users = getDB().prepare('SELECT id, username, email, role, is_active, created_at FROM users ORDER BY role, username').all();
  sendJSON(res, 200, users);
});

route('POST', '/api/users', async (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) return;
  const b = await readBody(req);
  if (!b.username || !b.email || !b.password) return sendJSON(res, 400, { error: 'Kullanici adi, e-posta ve sifre gereklidir.' });
  const hash = bcrypt.hashSync(b.password, 12);
  try {
    const result = getDB().prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)').run(b.username, b.email, hash, b.role || 'member');
    sendJSON(res, 201, { success: true, id: result.lastInsertRowid });
  } catch (e) {
    sendJSON(res, 400, { error: 'Bu kullanici adi veya e-posta zaten kayitli.' });
  }
});

route('PUT', '/api/users/:id', async (req, res, params) => {
  const user = requireAdmin(req, res);
  if (!user) return;
  const b = await readBody(req);
  const database = getDB();
  if (b.password) {
    const hash = bcrypt.hashSync(b.password, 12);
    database.prepare("UPDATE users SET username=?, email=?, password_hash=?, role=?, is_active=?, updated_at=datetime('now') WHERE id=?").run(b.username, b.email, hash, b.role || 'member', b.is_active !== undefined ? b.is_active : 1, params.id);
  } else {
    database.prepare("UPDATE users SET username=?, email=?, role=?, is_active=?, updated_at=datetime('now') WHERE id=?").run(b.username, b.email, b.role || 'member', b.is_active !== undefined ? b.is_active : 1, params.id);
  }
  sendJSON(res, 200, { success: true });
});

route('DELETE', '/api/users/:id', async (req, res, params) => {
  const user = requireAdmin(req, res);
  if (!user) return;
  if (parseInt(params.id) === user.user_id) return sendJSON(res, 400, { error: 'Kendi hesabinizi silemezsiniz.' });
  getDB().prepare('DELETE FROM users WHERE id = ?').run(params.id);
  sendJSON(res, 200, { success: true });
});

// --- FILE UPLOAD ---
route('POST', '/api/upload', async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return sendJSON(res, 400, { error: 'multipart/form-data bekleniyor.' });
  }

  const boundary = contentType.split('boundary=')[1];
  if (!boundary) return sendJSON(res, 400, { error: 'Boundary bulunamadi.' });

  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on('data', c => chunks.push(c));
    req.on('end', resolve);
    req.on('error', reject);
  });

  const buf = Buffer.concat(chunks);
  const boundaryBuf = Buffer.from('--' + boundary);

  // Dosyayi parse et
  let fileData = null;
  let fileName = 'upload';
  const parts = [];
  let start = 0;
  while (true) {
    const idx = buf.indexOf(boundaryBuf, start);
    if (idx === -1) break;
    if (start > 0) parts.push(buf.slice(start, idx - 2));
    start = idx + boundaryBuf.length + 2;
  }

  for (const part of parts) {
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    const headerStr = part.slice(0, headerEnd).toString();
    const body = part.slice(headerEnd + 4);
    if (headerStr.includes('filename=')) {
      const fnMatch = headerStr.match(/filename="([^"]+)"/);
      if (fnMatch) fileName = fnMatch[1];
      fileData = body;
    }
  }

  if (!fileData || fileData.length === 0) {
    return sendJSON(res, 400, { error: 'Dosya bulunamadi.' });
  }

  const uploadDir = path.join(ROOT, 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const ext = path.extname(fileName) || '.bin';
  const safeName = Date.now() + '_' + crypto.randomBytes(6).toString('hex') + ext;
  const filePath = path.join(uploadDir, safeName);
  fs.writeFileSync(filePath, fileData);

  const url = `/uploads/${safeName}`;
  sendJSON(res, 200, { success: true, url, filename: safeName });
});

// Uploads klasoru sunumu
function serveUpload(req, res, urlPath) {
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(path.join(ROOT, 'uploads'))) {
    res.writeHead(403); return res.end('Forbidden');
  }
  if (!fs.existsSync(filePath)) {
    res.writeHead(404); return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  fs.createReadStream(filePath).pipe(res);
}

// --- STATS ---
route('GET', '/api/stats', async (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return;
  const db2 = getDB();
  sendJSON(res, 200, {
    members: db2.prepare('SELECT COUNT(*) as c FROM members WHERE is_active = 1').get().c,
    equipment: db2.prepare('SELECT COUNT(*) as c FROM equipment WHERE is_active = 1').get().c,
    publications: db2.prepare('SELECT COUNT(*) as c FROM publications').get().c,
    projects: db2.prepare("SELECT COUNT(*) as c FROM projects WHERE status = 'active'").get().c,
    blog_published: db2.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'").get().c,
    blog_draft: db2.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'draft'").get().c,
    news_published: db2.prepare("SELECT COUNT(*) as c FROM news WHERE status = 'published'").get().c,
    research_areas: db2.prepare('SELECT COUNT(*) as c FROM research_areas WHERE is_active = 1').get().c,
  });
});

// ===========================
// ANA SUNUCU
// ===========================
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const urlPath = decodeURIComponent(url.pathname);

  // OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  // API rotalar
  if (urlPath.startsWith('/api/')) {
    const match = matchRoute(req.method, urlPath);
    if (match) {
      try {
        await match.handler(req, res, match.params);
      } catch (e) {
        console.error('API hatasi:', e.message);
        sendJSON(res, 500, { error: 'Sunucu hatasi: ' + e.message });
      }
      return;
    }
    return sendJSON(res, 404, { error: 'API endpointi bulunamadi.' });
  }

  // Uploads
  if (urlPath.startsWith('/uploads/')) {
    return serveUpload(req, res, urlPath);
  }

  // Statik dosyalar
  serveStatic(req, res, urlPath);
});

// Baslat
getDB(); // DB'yi erken ac
server.listen(PORT, () => {
  console.log(`\nMrML Lab Admin Sunucusu calisiyor`);
  console.log(`Ana site:    http://localhost:${PORT}/`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/`);
  console.log(`\nCtrl+C ile durdurun.\n`);
});

server.on('error', (e) => {
  console.error('Sunucu hatasi:', e.message);
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} kullaniliyor. Baska bir port deneyin.`);
  }
});
