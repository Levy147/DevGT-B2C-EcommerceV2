/* ============================================================
   LUNETTE — Render de páginas
   ============================================================ */

function $(selector, scope) {
  return (scope || document).querySelector(selector);
}

function $all(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

function categoryCardHTML(cat) {
  return `
    <a class="category-card" href="browse.html?cat=${cat.slug}">
      <span class="heart-mini">♡</span>
      <img class="cat-img" src="${IMG[cat.slug]}" alt="${cat.name}" loading="lazy">
      <h3>${cat.emoji} ${cat.name}</h3>
      <p>${cat.blurb}</p>
    </a>
  `;
}

/* ---------------- HOME ---------------- */
function renderHome() {
  const categoryGrid = $('#categoryGrid');
  if (categoryGrid) categoryGrid.innerHTML = CATEGORIES.map(categoryCardHTML).join('');

  const newArrivals = $('#newArrivals');
  if (newArrivals) {
    const list = PRODUCTS.filter(p => p.badge === 'new' || p.badge === 'best').slice(0, 8);
    renderProductGrid(newArrivals, list);
  }

  const bestSellers = $('#bestSellers');
  if (bestSellers) {
    const list = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
    renderProductGrid(bestSellers, list);
  }
}

/* ---------------- BROWSE ---------------- */
const browseState = {
  cat: '',
  badge: '',
  q: '',
  sort: 'featured'
};

function initBrowse() {
  const grid = $('#browseGrid');
  if (!grid) return;

  browseState.cat = param('cat') || '';
  browseState.badge = param('badge') || '';
  browseState.q = param('q') || '';
  browseState.sort = param('sort') || 'featured';

  const chips = $('#categoryChips');
  if (chips) {
    chips.innerHTML = [
      `<button class="chip ${!browseState.cat ? 'active' : ''}" data-cat="">Todo</button>`,
      ...CATEGORIES.map(cat => `<button class="chip ${browseState.cat === cat.slug ? 'active' : ''}" data-cat="${cat.slug}">${cat.emoji} ${cat.name}</button>`)
    ].join('');
  }

  const badgeChips = $('#badgeChips');
  if (badgeChips) {
    const badges = [
      { id: '', label: 'Todo' },
      { id: 'new', label: '✦ Nuevo' },
      { id: 'sale', label: '✧ Oferta' },
      { id: 'best', label: '♡ Bestseller' }
    ];
    badgeChips.innerHTML = badges.map(b =>
      `<button class="chip ${browseState.badge === b.id ? 'active' : ''}" data-badge="${b.id}">${b.label}</button>`
    ).join('');
  }

  const searchInput = $('#browseSearch');
  if (searchInput) searchInput.value = browseState.q;

  const sortSelect = $('#browseSort');
  if (sortSelect) sortSelect.value = browseState.sort;

  applyBrowseFilters(grid);

  chips?.addEventListener('click', event => {
    const chip = event.target.closest('[data-cat]');
    if (!chip) return;
    browseState.cat = chip.dataset.cat;
    $all('.chip', chips).forEach(c => c.classList.toggle('active', c === chip));
    applyBrowseFilters(grid);
  });

  badgeChips?.addEventListener('click', event => {
    const chip = event.target.closest('[data-badge]');
    if (!chip) return;
    browseState.badge = chip.dataset.badge;
    $all('.chip', badgeChips).forEach(c => c.classList.toggle('active', c === chip));
    applyBrowseFilters(grid);
  });

  let timer;
  searchInput?.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      browseState.q = searchInput.value.trim();
      applyBrowseFilters(grid);
    }, 180);
  });

  sortSelect?.addEventListener('change', () => {
    browseState.sort = sortSelect.value;
    applyBrowseFilters(grid);
  });
}

function applyBrowseFilters(grid) {
  let list = productsByCategory(browseState.cat);

  if (browseState.badge) list = list.filter(p => p.badge === browseState.badge);

  if (browseState.q) {
    const q = browseState.q.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (categoryBySlug(p.category)?.name || '').toLowerCase().includes(q)
    );
  }

  switch (browseState.sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'newest': list.sort((a, b) => b.id - a.id); break;
    case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: list.sort((a, b) => b.reviews - a.reviews);
  }

  renderProductGrid(grid, list);

  const count = $('#browseCount');
  if (count) count.textContent = `${list.length} producto${list.length === 1 ? '' : 's'}`;

  const title = $('#browseTitle');
  if (title) {
    const cat = categoryBySlug(browseState.cat);
    title.textContent = cat ? cat.name : 'Browse Collection';
  }

  const url = new URL(window.location.href);
  ['cat', 'badge', 'q', 'sort'].forEach(key => {
    if (browseState[key] && browseState[key] !== 'featured') url.searchParams.set(key, browseState[key]);
    else url.searchParams.delete(key);
  });
  window.history.replaceState({}, '', url);
}

/* ---------------- PRODUCT ---------------- */
function initProduct() {
  const root = $('#productDetail');
  if (!root) return;

  const id = Number(param('id'));
  const product = productById(id);

  if (!product) {
    root.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <span class="big">🎀</span>
        <p>No encontramos ese producto. Puede que ya no esté disponible.</p>
        <a class="btn" href="browse.html">Volver al catálogo</a>
      </div>`;
    return;
  }

  document.title = `${product.name} · ${STORE.name}`;
  const cat = categoryBySlug(product.category);
  const fav = isFavorite(product.id);
  const filters = ['none', 'hue-rotate(18deg) saturate(1.15)', 'hue-rotate(-22deg) saturate(.9)'];
  const badgeLabels = { new: 'Nuevo', sale: 'Oferta', best: 'Bestseller', low: 'Últimas piezas' };
  const detailBadge = product.badge ? badgeLabels[product.badge] : '';

  root.innerHTML = `
    <div class="detail-media">
      <img id="detailMainImage" src="${product.image}" alt="${escapeHTML(product.name)}">
      <div class="detail-thumbs" id="detailThumbs">
        ${filters.map((filter, index) => `
          <button class="${index === 0 ? 'active' : ''}" data-filter="${filter}" aria-label="Vista ${index + 1}">
            <img src="${product.image}" alt="" style="filter:${filter}">
          </button>
        `).join('')}
      </div>
    </div>

    <div class="detail-info">
      <span class="product-cat">${cat ? cat.emoji + ' ' + cat.name : ''}</span>
      <h1>${escapeHTML(product.name)}</h1>
      <div class="product-rating" style="font-size:1rem;">${stars(product.rating)} <span>${product.rating} · ${product.reviews} reseñas</span></div>

      <div class="detail-price">
        <strong>${money(product.price)}</strong>
        ${product.oldPrice ? `<span class="price-old">${money(product.oldPrice)}</span>` : ''}
        ${detailBadge ? `<span class="product-badge" style="position:static;display:inline-block;">${detailBadge}</span>` : ''}
      </div>

      <p class="detail-desc">${escapeHTML(product.description)}</p>

      <div class="detail-block">
        <label>Talla</label>
        <div class="size-list" id="sizeList">
          ${product.sizes.map((size, index) =>
            `<button class="size-btn ${index === 0 ? 'active' : ''}" data-size="${escapeHTML(size)}">${escapeHTML(size)}</button>`
          ).join('')}
        </div>
      </div>

      <div class="detail-block">
        <label>Cantidad</label>
        <div class="qty">
          <button type="button" data-qty="-1" aria-label="Quitar uno">−</button>
          <span id="qtyValue">1</span>
          <button type="button" data-qty="1" aria-label="Agregar uno">+</button>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn" id="addToCartBtn">🛍 Agregar al carrito</button>
        <button class="btn btn-ghost ${fav ? 'active' : ''}" data-fav="${product.id}" data-label id="detailFavBtn">
          ${fav ? '♥ En favoritos' : '♡ Favorito'}
        </button>
      </div>

      <ul class="detail-perks">
        <li><span>🚚</span> Envío a todo Guatemala · Q${STORE.shipping} (gratis desde ${money(STORE.freeShippingFrom)})</li>
        <li><span>💌</span> Coordinamos entrega y pago por WhatsApp</li>
        <li><span>✨</span> Piezas seleccionadas estilo Y2K / Coquette</li>
      </ul>

      <div class="detail-block">
        <label>Detalles</label>
        <ul class="detail-perks">
          ${product.details.map(d => `<li><span>✦</span> ${escapeHTML(d)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  let selectedSize = product.sizes[0];
  let qty = 1;

  const mainImage = $('#detailMainImage');
  $('#detailThumbs')?.addEventListener('click', event => {
    const btn = event.target.closest('[data-filter]');
    if (!btn) return;
    mainImage.style.filter = btn.dataset.filter === 'none' ? '' : btn.dataset.filter;
    $all('#detailThumbs button').forEach(b => b.classList.toggle('active', b === btn));
  });

  $('#sizeList')?.addEventListener('click', event => {
    const btn = event.target.closest('[data-size]');
    if (!btn) return;
    selectedSize = btn.dataset.size;
    $all('#sizeList .size-btn').forEach(b => b.classList.toggle('active', b === btn));
  });

  $all('[data-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      qty = Math.max(1, qty + Number(btn.dataset.qty));
      $('#qtyValue').textContent = qty;
    });
  });

  $('#addToCartBtn')?.addEventListener('click', () => addToCart(product.id, selectedSize, qty));

  renderRelated(product);
}

function renderRelated(product) {
  const related = $('#relatedGrid');
  if (!related) return;
  let list = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id);
  if (list.length < 4) {
    list = list.concat(PRODUCTS.filter(p => p.category !== product.category && p.id !== product.id));
  }
  renderProductGrid(related, list.slice(0, 4));
}

/* ---------------- CART ---------------- */
function renderCart() {
  const list = $('#cartList');
  const summary = $('#cartSummary');
  if (!list || !summary) return;

  const cart = getCart();
  const checkout = $('#checkoutSection');

  if (!cart.length) {
    list.innerHTML = `
      <div class="cart-empty">
        <span class="big">🛍️</span>
        <h2 style="font-family:var(--font-cursive);font-size:2rem;color:var(--pink-300);">Tu carrito está vacío</h2>
        <p style="color:var(--muted);margin:6px 0 18px;">Agrega algo cute y vuelve a vernos ♡</p>
        <a class="btn" href="browse.html">Explorar tienda</a>
      </div>`;
    summary.innerHTML = '';
    if (checkout) checkout.hidden = true;
    const success = $('#orderSuccess');
    if (success) success.hidden = true;
    return;
  }

  if (checkout) checkout.hidden = false;

  list.innerHTML = cart.map(item => {
    const product = productById(item.id);
    if (!product) return '';
    return `
      <div class="cart-row">
        <img src="${product.image}" alt="${escapeHTML(product.name)}">
        <div>
          <div class="cart-row-name"><a href="${productUrl(product)}">${escapeHTML(product.name)}</a></div>
          <div class="cart-row-meta">Talla ${escapeHTML(item.size)}</div>
          <div class="qty" style="margin-top:8px;">
            <button type="button" data-cart-qty="${item.key}" data-delta="-1" aria-label="Quitar uno">−</button>
            <span>${item.qty}</span>
            <button type="button" data-cart-qty="${item.key}" data-delta="1" aria-label="Agregar uno">+</button>
          </div>
        </div>
        <div class="cart-row-actions">
          <span class="cart-row-price">${money(product.price * item.qty)}</span>
          <button class="cart-remove" data-cart-remove="${item.key}">Quitar</button>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = cartSubtotal();
  const shipping = subtotal >= STORE.freeShippingFrom ? 0 : STORE.shipping;
  const total = subtotal + shipping;

  summary.innerHTML = `
    <h2 class="section-title" style="font-size:1rem;">Resumen</h2>
    <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="summary-row"><span>Envío</span><span>${shipping === 0 ? 'GRATIS ♡' : money(shipping)}</span></div>
    ${shipping > 0 ? `<p style="font-size:.8rem;color:var(--muted);">Te faltan ${money(STORE.freeShippingFrom - subtotal)} para envío gratis.</p>` : ''}
    <div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div>
    <a class="btn btn-block" href="#checkoutSection">Finalizar compra</a>
    <button class="btn btn-ghost btn-block btn-sm" data-clear-cart>Vaciar carrito</button>
  `;

  $all('[data-cart-qty]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.cartQty;
      const item = getCart().find(i => i.key === key);
      if (!item) return;
      updateCartQty(key, item.qty + Number(btn.dataset.delta));
    });
  });

  $('[data-clear-cart]')?.addEventListener('click', () => {
    if (window.confirm('¿Vaciar todo el carrito?')) {
      clearCart();
    }
  });

  syncCheckoutTotals(subtotal, shipping, total);
}

function syncCheckoutTotals(subtotal, shipping, total) {
  const box = $('#checkoutTotals');
  if (!box) return;
  box.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="summary-row"><span>Envío</span><span>${shipping === 0 ? 'GRATIS' : money(shipping)}</span></div>
    <div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div>
  `;
}

function initCartPage() {
  renderCart();

  document.addEventListener('lunette:updated', renderCart);

  const form = $('#checkoutForm');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
      toast('Tu carrito está vacío.');
      return;
    }

    const customer = {
      name: $('#orderName').value.trim(),
      phone: $('#orderPhone').value.trim(),
      address: $('#orderAddress').value.trim(),
      note: $('#orderNote').value.trim(),
      payment: $('#orderPayment').value
    };

    if (!customer.name || !customer.phone || !customer.address) {
      toast('Completa tu nombre, teléfono y dirección.');
      return;
    }

    const subtotal = cartSubtotal();
    const shipping = subtotal >= STORE.freeShippingFrom ? 0 : STORE.shipping;
    const items = cart.map(item => {
      const product = productById(item.id);
      return {
        id: item.id,
        name: product ? product.name : 'Producto',
        size: item.size,
        qty: item.qty,
        price: product ? product.price : 0
      };
    });

    const order = {
      code: 'LF-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      customer,
      status: 'pendiente'
    };

    saveOrder(order);
    clearCart();
    form.hidden = true;

    const success = $('#orderSuccess');
    success.hidden = false;
    success.innerHTML = `
      <div class="contact-card" style="text-align:center;">
        <div style="font-size:3rem;">🎀</div>
        <h2 style="font-family:var(--font-cursive);font-size:2.4rem;color:var(--pink-300);">¡Pedido creado!</h2>
        <p style="color:var(--muted);">Tu pedido <strong style="color:var(--pink-200);">${order.code}</strong> quedó guardado.
        Envíanos el detalle por WhatsApp para confirmar stock, pago y entrega.</p>
        <p style="font-family:var(--font-display);font-size:1.3rem;color:var(--pink-200);">Total: ${money(order.total)}</p>
        <div class="detail-actions" style="justify-content:center;">
          <a class="btn" href="${whatsappHref(orderWhatsAppMessage(order))}" target="_blank" rel="noopener">💬 Enviar por WhatsApp</a>
          <a class="btn btn-ghost" href="mailto:${STORE.email}?subject=Pedido ${order.code}&body=${encodeURIComponent(orderWhatsAppMessage(order))}">✉ Enviar por correo</a>
        </div>
        <a class="btn btn-sm btn-ghost" href="browse.html">Seguir comprando</a>
      </div>
    `;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('¡Pedido creado con éxito! ♡', 'success');
  });
}

/* ---------------- SEARCH ---------------- */
function initSearch() {
  const input = $('#searchInput');
  const results = $('#searchResults');
  if (!input || !results) return;

  input.value = param('q') || '';

  function run() {
    const q = input.value.trim().toLowerCase();
    const count = $('#searchCount');

    if (!q) {
      const popular = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
      renderProductGrid(results, popular);
      if (count) count.textContent = 'Populares ahora';
      return;
    }

    const list = PRODUCTS.filter(p => {
      const cat = categoryBySlug(p.category)?.name || '';
      return (p.name + ' ' + p.description + ' ' + cat + ' ' + p.sizes.join(' '))
        .toLowerCase().includes(q);
    });
    renderProductGrid(results, list);
    if (count) count.textContent = `${list.length} resultado${list.length === 1 ? '' : 's'} para “${input.value.trim()}”`;
  }

  let timer;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(run, 160);
  });

  run();
}

/* ---------------- FAVORITES ---------------- */
function renderFavorites() {
  const grid = $('#favoritesGrid');
  if (!grid) return;
  const list = getFavorites().map(productById).filter(Boolean);
  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <span class="big">💔</span>
        <h2 style="font-family:var(--font-cursive);font-size:2rem;color:var(--pink-300);">Aún no tienes favoritos</h2>
        <p>Toca el corazón de las piezas que te roben el aliento.</p>
        <a class="btn" href="browse.html">Descubrir productos</a>
      </div>`;
    return;
  }
  renderProductGrid(grid, list);
}

function initFavorites() {
  renderFavorites();
  document.addEventListener('lunette:favorites', renderFavorites);
  document.addEventListener('lunette:updated', renderFavorites);
}

/* ---------------- ACCOUNT ---------------- */
function initAccount() {
  const ordersList = $('#ordersList');
  if (!ordersList) return;

  const orders = getOrders();
  const count = $('#orderCount');
  if (count) count.textContent = orders.length;

  const favCount = $('#favTotal');
  if (favCount) favCount.textContent = getFavorites().length;

  if (!orders.length) {
    ordersList.innerHTML = `
      <div class="empty-state">
        <span class="big">📦</span>
        <p>Todavía no tienes pedidos. Cuando confirmes uno aparecerá aquí.</p>
        <a class="btn" href="browse.html">Empezar a comprar</a>
      </div>`;
    return;
  }

  ordersList.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-card-head">
        <strong>${order.code}</strong>
        <span>${new Date(order.createdAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        <span>${order.status === 'pendiente' ? '🕐 Por confirmar' : order.status}</span>
      </div>
      <div style="margin:10px 0;font-size:.9rem;color:var(--muted);">
        ${order.items.map(i => `${escapeHTML(i.name)} ×${i.qty} (${escapeHTML(i.size)})`).join(' · ')}
      </div>
      <div class="summary-row total" style="border:0;padding-top:0;">
        <span>${order.items.reduce((s, i) => s + i.qty, 0)} artículos</span>
        <strong>${money(order.total)}</strong>
      </div>
    </div>
  `).join('');
}

/* ---------------- MESSAGES ---------------- */
function initMessages() {
  const form = $('#messageForm');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#msgName').value.trim();
    const email = $('#msgEmail').value.trim();
    const message = $('#msgText').value.trim();
    if (!name || !message) {
      toast('Cuéntanos tu nombre y tu mensaje ♡');
      return;
    }
    const body = `Hola Lunette, soy ${name} (${email || 'sin correo'}).\n\n${message}`;
    window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent('Mensaje desde la web')}&body=${encodeURIComponent(body)}`;
    toast('Abriendo tu correo… ♡', 'success');
    form.reset();
  });

  const wa = $('#whatsappContact');
  if (wa) wa.href = whatsappHref('¡Hola Lunette! Quiero más información sobre sus productos 🎀');
}

/* ---------------- BLOG ---------------- */
const POSTS = [
  {
    emoji: '🎀', date: '12 feb 2026',
    title: 'Cómo armar un outfit Coquette sin gastar de más',
    excerpt: 'Lazos, encaje y una falda plisada: las tres piezas que transforman cualquier look básico.'
  },
  {
    emoji: '💿', date: '03 feb 2026',
    title: 'Y2K revival: las tendencias que volvieron para quedarse',
    excerpt: 'Lentes de corazón, bolsos metálicos y baby tees. Repasamos el lookbook de la temporada.'
  },
  {
    emoji: '🐰', date: '24 ene 2026',
    title: 'Conoce a la conejita Lunette',
    excerpt: 'La mascota de la marca y los detalles escondidos que encontrarás en cada pedido.'
  }
];

function initBlog() {
  const grid = $('#blogGrid');
  if (grid) {
    grid.innerHTML = POSTS.map(post => `
      <article class="post-card">
        <div class="post-cover">${post.emoji}</div>
        <div class="post-body">
          <time>${post.date}</time>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <button class="btn btn-ghost btn-sm" data-soon>Leer más</button>
        </div>
      </article>
    `).join('');

    grid.addEventListener('click', event => {
      if (event.target.closest('[data-soon]')) toast('Muy pronto: este artículo se está escribiendo ♡');
    });
  }
}

/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  switch (document.body.dataset.page) {
    case 'home': renderHome(); break;
    case 'browse': initBrowse(); break;
    case 'product': initProduct(); break;
    case 'cart': initCartPage(); break;
    case 'search': initSearch(); break;
    case 'favorites': initFavorites(); break;
    case 'account': initAccount(); break;
    case 'messages': initMessages(); break;
    case 'blog': initBlog(); break;
    default: break;
  }
});
