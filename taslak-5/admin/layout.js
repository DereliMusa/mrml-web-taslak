// admin/layout.js -- Sidebar HTML'i dinamik olarak yerlestirir
// Her modul sayfasi bu dosyayi yukler

function getAdminSidebar(activePage) {
    return `
    <aside class="admin-sidebar" id="admin-sidebar">
        <div class="sidebar-logo">
            <div class="sidebar-logo-text">
                <span class="logo-mr">Mr</span><span class="logo-ml">ML</span><span class="logo-lab"> Lab</span>
            </div>
            <div class="sidebar-badge">Admin Paneli</div>
        </div>
        <nav class="sidebar-nav">
            <div class="nav-section">
                <span class="nav-section-label">Genel</span>
                <a href="/admin/dashboard.html" class="nav-item ${activePage==='dashboard'?'active':''}" data-page="dashboard.html">
                    <i class="fa-solid fa-chart-line"></i> Dashboard
                </a>
            </div>
            <div class="nav-section">
                <span class="nav-section-label">Icerik</span>
                <a href="/admin/modules/uyeler.html" class="nav-item ${activePage==='uyeler'?'active':''}" data-page="uyeler.html">
                    <i class="fa-solid fa-users"></i> Uyeler
                </a>
                <a href="/admin/modules/arastirma.html" class="nav-item ${activePage==='arastirma'?'active':''}" data-page="arastirma.html">
                    <i class="fa-solid fa-flask"></i> Arastirma Alanlari
                </a>
                <a href="/admin/modules/projeler.html" class="nav-item ${activePage==='projeler'?'active':''}" data-page="projeler.html">
                    <i class="fa-solid fa-diagram-project"></i> Projeler
                </a>
                <a href="/admin/modules/yayinlar.html" class="nav-item ${activePage==='yayinlar'?'active':''}" data-page="yayinlar.html">
                    <i class="fa-regular fa-file-lines"></i> Yayinlar
                </a>
                <a href="/admin/modules/donanim.html" class="nav-item ${activePage==='donanim'?'active':''}" data-page="donanim.html">
                    <i class="fa-solid fa-microscope"></i> Donanim
                </a>
            </div>
            <div class="nav-section">
                <span class="nav-section-label">Medya</span>
                <a href="/admin/modules/blog.html" class="nav-item ${activePage==='blog'?'active':''}" data-page="blog.html">
                    <i class="fa-solid fa-pen-nib"></i> Blog
                </a>
                <a href="/admin/modules/haberler.html" class="nav-item ${activePage==='haberler'?'active':''}" data-page="haberler.html">
                    <i class="fa-solid fa-newspaper"></i> Haberler
                </a>
            </div>
            <div class="nav-section">
                <span class="nav-section-label">Ayarlar</span>
                <a href="/admin/modules/sosyal.html" class="nav-item ${activePage==='sosyal'?'active':''}" data-page="sosyal.html">
                    <i class="fa-solid fa-share-nodes"></i> Sosyal Medya
                </a>
                <a href="/admin/modules/ayarlar.html" class="nav-item ${activePage==='ayarlar'?'active':''}" data-page="ayarlar.html">
                    <i class="fa-solid fa-gear"></i> Genel Ayarlar
                </a>
                <a href="/admin/modules/hesaplar.html" class="nav-item ${activePage==='hesaplar'?'active':''}" data-page="hesaplar.html">
                    <i class="fa-solid fa-shield-halved"></i> Hesaplar
                </a>
            </div>
        </nav>
        <div class="sidebar-user">
            <div class="user-avatar" id="sidebar-avatar">A</div>
            <div class="user-info">
                <div class="user-name" id="sidebar-username">admin</div>
                <div class="user-role" id="sidebar-role">Yonetici</div>
            </div>
            <button class="logout-btn" title="Cikis Yap" data-action="logout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        </div>
    </aside>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    `;
}

function getTopbar(title) {
    return `
    <header class="admin-topbar">
        <button class="mobile-menu-toggle" id="mobile-toggle">
            <i class="fa-solid fa-bars"></i>
        </button>
        <div class="topbar-title">${title}</div>
        <div class="topbar-actions">
            <a href="/" target="_blank" class="btn btn-outline btn-sm">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Siteyi Gor
            </a>
        </div>
    </header>
    `;
}

// Confirm dialog HTML
function getConfirmDialog() {
    return `
    <div class="modal-overlay" id="confirm-overlay">
        <div class="modal" style="max-width: 380px;">
            <div class="modal-header">
                <h3>Emin misiniz?</h3>
                <button class="modal-close" data-close-modal="confirm-overlay"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
                <p id="confirm-msg" style="color: var(--text-body); margin: 0;"></p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" data-close-modal="confirm-overlay">Iptal</button>
                <button class="btn btn-danger" id="confirm-ok">Sil</button>
            </div>
        </div>
    </div>
    `;
}
