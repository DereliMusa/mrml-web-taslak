-- MrML Lab Admin Panel -- SQLite Schema

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ===========================
-- KIMLIK DOGRULAMA
-- ===========================

CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT NOT NULL UNIQUE,
    email       TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'member', -- 'admin' | 'member'
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    token       TEXT NOT NULL UNIQUE,
    user_id     INTEGER NOT NULL,
    expires_at  TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS temp_tokens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    token       TEXT NOT NULL UNIQUE,
    email       TEXT NOT NULL,
    scope       TEXT NOT NULL DEFAULT 'blog', -- 'blog' | 'news' | 'full'
    expires_at  TEXT NOT NULL,
    used        INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===========================
-- ICERIK
-- ===========================

CREATE TABLE IF NOT EXISTS research_areas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    description TEXT,
    icon        TEXT DEFAULT 'fa-flask',
    color       TEXT DEFAULT '#6366f1',
    order_index INTEGER DEFAULT 0,
    is_active   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS members (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    title           TEXT,         -- Prof. Dr., Dr., vb.
    role            TEXT NOT NULL DEFAULT 'student', -- 'pi' | 'postdoc' | 'phd' | 'msc' | 'researcher' | 'alumni'
    bio             TEXT,
    photo_url       TEXT,
    email           TEXT,
    research_areas  TEXT,         -- JSON array of area IDs
    social_scholar  TEXT,
    social_orcid    TEXT,
    social_linkedin TEXT,
    social_github   TEXT,
    social_researchgate TEXT,
    is_active       INTEGER NOT NULL DEFAULT 1,
    order_index     INTEGER DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS equipment (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'lab', -- 'lab' | 'test' | 'simulation' | 'measurement'
    description     TEXT,
    specs           TEXT,         -- JSON or plain text
    photo_url       TEXT,
    research_areas  TEXT,         -- JSON array of area IDs
    is_active       INTEGER NOT NULL DEFAULT 1,
    order_index     INTEGER DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    summary         TEXT,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'active', -- 'active' | 'completed' | 'cancelled'
    funding_source  TEXT,         -- 'tubitak' | 'ab' | 'bap' | 'industry' | 'other'
    funding_amount  TEXT,
    start_date      TEXT,
    end_date        TEXT,
    research_area_id INTEGER,
    is_featured     INTEGER NOT NULL DEFAULT 0,
    cover_image     TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (research_area_id) REFERENCES research_areas(id)
);

CREATE TABLE IF NOT EXISTS publications (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    authors         TEXT NOT NULL,  -- "A. Yilmaz, Z. Arslan"
    journal         TEXT,
    year            INTEGER,
    pub_type        TEXT NOT NULL DEFAULT 'article', -- 'article' | 'conference' | 'thesis_msc' | 'thesis_phd'
    doi             TEXT,
    abstract        TEXT,
    keywords        TEXT,           -- comma separated
    research_area_id INTEGER,
    is_featured     INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (research_area_id) REFERENCES research_areas(id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    content         TEXT,
    author_id       INTEGER,
    category        TEXT,
    tags            TEXT,           -- comma separated
    cover_image     TEXT,
    status          TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published' | 'archived'
    published_at    TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (author_id) REFERENCES members(id)
);

CREATE TABLE IF NOT EXISTS news (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    content         TEXT,
    category        TEXT,           -- 'project' | 'publication' | 'collaboration' | 'award' | 'general'
    tags            TEXT,
    cover_image     TEXT,
    status          TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published' | 'archived'
    published_at    TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS social_links (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    platform    TEXT NOT NULL UNIQUE, -- 'scholar' | 'orcid' | 'researchgate' | 'linkedin' | 'github' | 'twitter'
    url         TEXT,
    label       TEXT,
    icon_class  TEXT,
    is_active   INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_settings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    key         TEXT NOT NULL UNIQUE,
    value       TEXT,
    label       TEXT,
    group_name  TEXT DEFAULT 'general',
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===========================
-- INDEKSLER
-- ===========================

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_temp_tokens_token ON temp_tokens(token);
CREATE INDEX IF NOT EXISTS idx_temp_tokens_email ON temp_tokens(email);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
