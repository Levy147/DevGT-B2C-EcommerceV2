/* ============================================================
   LUNETTE — Componentes compartidos
   Header, sidebar, footer, carrito lateral y navegación.
   ============================================================ */

const NAV_ITEMS = [
  { id: 'home', label: 'home', href: 'index.html' },
  { id: 'browse', label: 'browse', href: 'browse.html' },
  { id: 'search', label: 'search', href: 'search.html' },
  { id: 'messages', label: 'messages', href: 'messages.html' },
  { id: 'blog', label: 'blog', href: 'blog.html' },
  { id: 'about', label: 'about', href: 'about.html' }
];

function currentPage() {
  return document.body.dataset.page || 'home';
}

function windowBarHTML() {
  return `
    <div class="window-bar">
      <div class="window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="window-title">♡ lunette.exe — cute styles, y2k vibes</div>
      <div class="window-controls" aria-hidden="true">— □ ×</div>
    </div>
  `;
}

function headerHTML() {
  const page = currentPage();
  const links = NAV_ITEMS.map(item =>
    `<a class="nav-link ${item.id === page ? 'active' : ''}" href="${item.href}">${item.label}</a>`
  ).join('');

  return `
    <header class="top-banner">
      <span class="sparkle" style="top:22px;left:12%">✦</span>
      <span class="sparkle s2" style="top:64px;left:28%">✧</span>
      <span class="sparkle s3" style="bottom:26px;left:8%">♡</span>
      <span class="sparkle" style="top:34px;right:30%">✦</span>
      <span class="sparkle s2" style="bottom:30px;right:12%">✧</span>

      <a class="brand-lockup" href="index.html" aria-label="Lunette — inicio">
        <span class="logo">
          <span class="logo-cursive">Lunette</span>
        </span>
      </a>
      <p class="brand-tagline">cute styles · y2k vibes · guatemala</p>
      <img class="mascot-peek" src="public/img/brand/mascot.png" alt="Mascota Lunette: conejita rosa">
    </header>

    <nav class="navbar" aria-label="Navegación principal">
      <button class="icon-btn nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">☰</button>
      <div class="nav-links" id="navLinks">${links}</div>
      <div class="nav-actions">
        <a class="icon-btn" href="favorites.html" aria-label="Favoritos" title="Favoritos">
          ♡<span class="count-pill" data-fav-count hidden>0</span>
        </a>
        <button class="icon-btn" data-open-cart aria-label="Abrir carrito" title="Carrito">
          🛍<span class="count-pill" data-cart-count hidden>0</span>
        </button>
      </div>
    </nav>
  `;
}

function sidebarHTML() {
  const page = currentPage();
  const activeCat = param('cat') || '';
  const catLinks = CATEGORIES.map(cat => {
    const active = page === 'browse' && activeCat === cat.slug;
    return `
      <a class="side-link ${active ? 'active' : ''}" href="browse.html?cat=${cat.slug}">
        <span class="ico">${cat.icon}</span> ${cat.name}
      </a>`;
  }).join('');

  return `
    <aside class="sidebar" aria-label="Barra lateral">
      <section class="side-card side-account">
        <img class="side-avatar" src="public/img/brand/avatar.png" alt="Avatar de la conejita Lunette">
        <div class="side-hello">Hola, Bunny!</div>
        <p class="side-sub">Welcome to your account ♡</p>
        <div class="side-links">
          <a class="side-link" href="account.html"><span class="ico">👤</span> Mi cuenta</a>
          <a class="side-link" href="account.html#pedidos"><span class="ico">📦</span> Mis pedidos</a>
          <a class="side-link" href="favorites.html"><span class="ico">♡</span> Favoritos</a>
          <a class="side-link" href="cart.html"><span class="ico">🛍</span> Mi carrito</a>
          <a class="side-link" href="#" data-logout><span class="ico">🚪</span> Cerrar sesión</a>
        </div>
      </section>

      <section class="side-card">
        <h3 class="side-title">Categories</h3>
        <div class="side-links">
          ${catLinks}
          <a class="side-link" href="browse.html?badge=new"><span class="ico">✦</span> Novedades</a>
          <a class="side-link" href="browse.html?badge=sale"><span class="ico">✧</span> Ofertas</a>
        </div>
      </section>

      <section class="side-card">
        <h3 class="side-title">Contáctanos</h3>
        <div class="side-contact">
          <a href="mailto:${STORE.email}"><span>✉</span> ${STORE.email}</a>
          <a href="${STORE.instagramUrl}" target="_blank" rel="noopener"><span>♡</span> ${STORE.instagram}</a>
          <a href="${STORE.instagramUrl}" target="_blank" rel="noopener"><span>✦</span> tiktok ${STORE.tiktok}</a>
          <a href="messages.html"><span>💬</span> Envíanos un mensaje</a>
        </div>
      </section>

      <a class="side-banner" href="browse.html">
        <img src="public/img/brand/inspo.jpg" alt="Lookbook Y2K de Lunette">
        <span>✦ Y2K LOOKBOOK ✦</span>
      </a>
    </aside>
  `;
}

function footerHTML() {
  return `
    <footer class="footer">
      <div class="footer-brand">
        <span class="logo">
          <span class="logo-cursive">Lunette</span>
        </span>
        <p class="footer-tag">cute styles, y2k vibes ♡</p>
      </div>

      <div class="footer-links">
        <a href="index.html">home</a>
        <a href="browse.html">browse</a>
        <a href="search.html">search</a>
        <a href="messages.html">messages</a>
        <a href="blog.html">blog</a>
        <a href="about.html">about</a>
        <a href="favorites.html">favoritos</a>
        <a href="cart.html">carrito</a>
      </div>

      <div class="footer-social">
        <a href="${STORE.instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">◎</a>
        <a href="${STORE.instagramUrl}" target="_blank" rel="noopener" aria-label="TikTok">♪</a>
        <a href="mailto:${STORE.email}" aria-label="Correo">✉</a>
      </div>

      <img class="footer-mascot" src="public/img/brand/mascot.png" alt="Mascota Lunette">
      <p class="footer-bottom">© ${new Date().getFullYear()} ${STORE.name} · ${STORE.city} · Hecho con mucho rosa ♡</p>
    </footer>
  `;
}

function drawerHTML() {
  return `
    <div class="overlay" id="drawerOverlay" data-close-cart></div>
    <aside class="drawer" id="cartDrawer" aria-label="Carrito de compras" aria-hidden="true">
      <div class="drawer-head">
        <h3>♡ Tu carrito</h3>
        <button class="icon-close" data-close-cart aria-label="Cerrar carrito">×</button>
      </div>
      <div class="drawer-body" id="drawerBody"></div>
      <div class="drawer-foot" id="drawerFoot"></div>
    </aside>
  `;
}

function renderChrome() {
  const slots = {
    windowbar: windowBarHTML,
    header: headerHTML,
    sidebar: sidebarHTML,
    footer: footerHTML,
    drawer: drawerHTML
  };

  document.querySelectorAll('[data-chrome]').forEach(slot => {
    const name = slot.dataset.chrome;
    if (slots[name]) slot.outerHTML = slots[name]();
  });

  refreshCounts();
  renderCartDrawer();
}

/* ---------- interacciones globales ---------- */
document.addEventListener('click', event => {
  const addBtn = event.target.closest('[data-add]');
  if (addBtn) {
    event.preventDefault();
    addToCart(Number(addBtn.dataset.add));
    return;
  }

  const favBtn = event.target.closest('[data-fav]');
  if (favBtn) {
    event.preventDefault();
    const id = Number(favBtn.dataset.fav);
    toggleFavorite(id);
    const active = isFavorite(id);
    favBtn.classList.toggle('active', active);
    favBtn.textContent = favBtn.hasAttribute('data-label')
      ? (active ? '♥ En favoritos' : '♡ Favorito')
      : (active ? '♥' : '♡');
    favBtn.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Agregar a favoritos');
    return;
  }

  const removeBtn = event.target.closest('[data-cart-remove]');
  if (removeBtn) {
    event.preventDefault();
    removeFromCart(removeBtn.dataset.cartRemove);
    return;
  }

  if (event.target.closest('[data-open-cart]')) {
    event.preventDefault();
    openCart();
    return;
  }

  if (event.target.closest('[data-close-cart]')) {
    closeCart();
    return;
  }

  const logout = event.target.closest('[data-logout]');
  if (logout) {
    event.preventDefault();
    toast('Sesión demo cerrada. ¡Vuelve pronto, Bunny! ♡');
    return;
  }

  const toggle = event.target.closest('#navToggle');
  if (toggle) {
    const links = document.getElementById('navLinks');
    const open = links?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(Boolean(open)));
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeCart();
});

document.addEventListener('DOMContentLoaded', () => {
  renderChrome();
});
