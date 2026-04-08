// db/seed.js -- Veritabani baslangic verisi
// Calistirma: node db/seed.js

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'mrml.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// DB yeniden olusturulacaksa eski dosyayi sil
if (process.argv.includes('--fresh')) {
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('Eski veritabani silindi.');
  }
}

const db = new Database(DB_PATH);

// Schema yukle
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);
console.log('Schema olusturuldu.');

// Admin kullanicisi
const adminPassword = bcrypt.hashSync('admin123', 12);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (username, email, password_hash, role)
  VALUES (?, ?, ?, ?)
`);

insertUser.run('admin', 'admin@mrml-lab.edu', adminPassword, 'admin');
console.log('Admin kullanicisi olusturuldu. (admin / admin123)');

// Sosyal medya linkleri
const insertSocial = db.prepare(`
  INSERT OR IGNORE INTO social_links (platform, url, label, icon_class, is_active, order_index)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const socials = [
  ['scholar', '', 'Google Scholar', 'fa-brands fa-google', 1, 0],
  ['orcid', '', 'ORCID', 'fa-brands fa-orcid', 1, 1],
  ['researchgate', '', 'ResearchGate', 'fa-brands fa-researchgate', 1, 2],
  ['linkedin', '', 'LinkedIn', 'fa-brands fa-linkedin-in', 1, 3],
  ['github', '', 'GitHub', 'fa-brands fa-github', 1, 4],
  ['twitter', '', 'Twitter/X', 'fa-brands fa-x-twitter', 0, 5],
];
for (const s of socials) insertSocial.run(...s);
console.log('Sosyal medya linkleri olusturuldu.');

// Site ayarlari
const insertSetting = db.prepare(`
  INSERT OR IGNORE INTO site_settings (key, value, label, group_name)
  VALUES (?, ?, ?, ?)
`);
const settings = [
  ['lab_name', 'MrML Lab', 'Lab Adi', 'general'],
  ['lab_slogan', 'Mekatronigin, Robotik ve Makine Ogreniminin Kesisiminde', 'Lab Slogani', 'general'],
  ['lab_university', 'Global Muhendislik Universitesi', 'Universite', 'general'],
  ['lab_founded', '2016', 'Kurulus Yili', 'general'],
  ['contact_email', 'contact@mrml-lab.edu', 'Iletisim E-postasi', 'contact'],
  ['contact_phone', '+90 312 123 45 67', 'Telefon', 'contact'],
  ['contact_address', 'Muhendislik Binasi B-Blok Kat 3', 'Adres', 'contact'],
  ['contact_hours', 'Pzt-Cum, 09:00-18:00', 'Calisma Saatleri', 'contact'],
  ['maps_embed_url', '', 'Google Maps Embed URL', 'contact'],
  ['smtp_mode', 'log', 'E-posta Modu (log/smtp)', 'email'],
  ['smtp_host', 'smtp.gmail.com', 'SMTP Sunucu', 'email'],
  ['smtp_port', '587', 'SMTP Port', 'email'],
  ['smtp_user', '', 'Gmail Adresi', 'email'],
  ['smtp_pass', '', 'Gmail App Password', 'email'],
  ['otp_expire_hours', '24', 'OTP Gecerlilik Suresi (saat)', 'email'],
];
for (const s of settings) insertSetting.run(...s);
console.log('Site ayarlari olusturuldu.');

// Ornek arastirma alanlari
const insertArea = db.prepare(`
  INSERT OR IGNORE INTO research_areas (name, slug, description, icon, color, order_index)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const areas = [
  ['Termoelektrik Arastirma', 'termoelektrik', 'BiSbTe ve PbTe esasli malzemelerde nanoyapilanma ile ZT degerinin iyilestirilmesi.', 'fa-solid fa-bolt', '#f59e0b', 0],
  ['Mikro Robotik', 'mikro-robotik', 'Manyetik yumusak mikro robotlar araciligiyla hedefe yonelik ilac tasimi.', 'fa-solid fa-robot', '#6366f1', 1],
  ['Biyomekanik', 'biyomekanik', 'Biyomedikal implantlarin sonlu elemanlar analiziyle modellenmesi.', 'fa-solid fa-bone', '#10b981', 2],
  ['Mekatronik Tasarim', 'mekatronik', 'Giyilebilir rehabilitasyon cihazlari ve ekzoskeleton sistemleri.', 'fa-solid fa-microchip', '#ec4899', 3],
];
for (const a of areas) insertArea.run(...a);
console.log('Arastirma alanlari olusturuldu.');

db.close();
console.log('\nVeritabani hazir: db/mrml.db');
console.log('Admin paneline giris: http://localhost:3737/admin/');
console.log('Kullanici: admin | Sifre: admin123');
