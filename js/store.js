/* ============================================================
   LUNETTE — Lógica de tienda
   Carrito, favoritos, render de tarjetas, toasts y utilidades.
   ============================================================ */

const CART_KEY = 'lunette_cart_v1';
const FAVS_KEY = 'lunette_favs_v1';
const ORDERS_KEY = 'lunette_orders_v1';

/* ---------- storage ---------- */
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('No se pudo guardar en localStorage', err);
  }
}

/* ---------- formato ---------- */
function money(amount) {
  const n = Number(amount) || 0;
  return 'Q' + n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escapeHTML(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stars(rating) {
  const full = Math.round(Number(rating) || 0);
  return '★'.repeat(Math.min(5, full)) + '☆'.repeat(Math.max(0, 5 - full));
}

function param(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- carrito ---------- */
function getCart() {
  const cart = readJSON(CART_KEY, []);
  return Array.isArray(cart) ? cart : [];
}

function saveCart(cart) {
  writeJSON(CART_KEY, cart);
  refreshCounts();
  renderCartDrawer();
  document.dispatchEvent(new CustomEvent('lunette:updated'));
}

function cartKey(id, size) {
  return `${id}::${size || 'unica'}`;
}

function addToCart(id, size, qty) {
  const product = productById(id);
  if (!product) return;
  const chosenSize = size || product.sizes[0];
  const amount = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const key = cartKey(product.id, chosenSize);
  const existing = cart.find(item => item.key === key);

  if (existing) {
    existing.qty += amount;
  } else {
    cart.push({
      key,
      id: product.id,
      size: chosenSize,
      qty: amount
    });
  }

  saveCart(cart);
  toast(`¡${product.name} agregado al carrito! ♡`, 'success');
  openCart();
}

function updateCartQty(key, nextQty) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(0, Number(nextQty) || 0);
  const next = item.qty <= 0 ? cart.filter(i => i.key !== key) : cart;
  saveCart(next);
}

function removeFromCart(key) {
  saveCart(getCart().filter(item => item.key !== key));
  toast('Producto eliminado del carrito.');
}

function clearCart() {
  saveCart([]);
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => {
    const product = productById(item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

/* ---------- favoritos ---------- */
function getFavorites() {
  const favs = readJSON(FAVS_KEY, []);
  return Array.isArray(favs) ? favs : [];
}

function isFavorite(id) {
  return getFavorites().includes(Number(id));
}

function toggleFavorite(id) {
  const product = productById(id);
  if (!product) return;
  let favs = getFavorites();
  if (favs.includes(product.id)) {
    favs = favs.filter(f => f !== product.id);
    toast(`${product.name} salió de favoritos.`);
  } else {
    favs.push(product.id);
    toast(`¡${product.name} está en tus favoritos! ♡`, 'success');
  }
  writeJSON(FAVS_KEY, favs);
  refreshCounts();
  renderCartDrawer();
  document.dispatchEvent(new CustomEvent('lunette:favorites'));
}

/* ---------- contadores ---------- */
function refreshCounts() {
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    const count = cartCount();
    el.textContent = count;
    el.hidden = count === 0;
  });
  document.querySelectorAll('[data-fav-count]').forEach(el => {
    const count = getFavorites().length;
    el.textContent = count;
    el.hidden = count === 0;
  });
}

/* ---------- tarjetas de producto ---------- */
function badgeHTML(product) {
  if (!product.badge) return '';
  const map = {
    new: ['new', 'Nuevo'],
    sale: ['sale', 'Oferta'],
    best: ['best', 'Bestseller'],
    low: ['low', 'Últimas piezas']
  };
  const [cls, label] = map[product.badge] || ['', 'Nuevo'];
  return `<span class="product-badge ${cls}">${label}</span>`;
}

function productCardHTML(product) {
  const fav = isFavorite(product.id);
  return `
    <article class="product-card" data-product="${product.id}">
      <div class="product-media">
        ${badgeHTML(product)}
        <button class="product-fav ${fav ? 'active' : ''}" data-fav="${product.id}"
                aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
                title="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${fav ? '♥' : '♡'}</button>
        <a href="${productUrl(product)}" aria-label="Ver ${escapeHTML(product.name)}">
          <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
        </a>
      </div>
      <div class="product-info">
        <span class="product-cat">${escapeHTML(categoryBySlug(product.category)?.name || product.category)}</span>
        <h3 class="product-name"><a href="${productUrl(product)}">${escapeHTML(product.name)}</a></h3>
        <div class="product-rating">${stars(product.rating)} <span>(${product.reviews})</span></div>
        <div class="product-price-row">
          <span class="product-price">${money(product.price)}</span>
          ${product.oldPrice ? `<span class="price-old">${money(product.oldPrice)}</span>` : ''}
        </div>
        <button class="add-btn" data-add="${product.id}">+ Agregar al carrito</button>
      </div>
    </article>
  `;
}

function renderProductGrid(container, products) {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <span class="big">🫧</span>
        <p>No encontramos productos con esos filtros.</p>
        <a class="btn btn-ghost" href="browse.html">Ver todo el catálogo</a>
      </div>`;
    return;
  }
  container.innerHTML = products.map(productCardHTML).join('');
}

/* ---------- drawer ---------- */
function cartLineHTML(item) {
  const product = productById(item.id);
  if (!product) return '';
  return `
    <div class="mini-cart-row">
      <img src="${product.image}" alt="${escapeHTML(product.name)}">
      <div>
        <div class="mini-cart-name">${escapeHTML(product.name)}</div>
        <div class="mini-cart-meta">Talla ${escapeHTML(item.size)} · ${item.qty} × ${money(product.price)}</div>
      </div>
      <button class="mini-cart-remove" data-cart-remove="${item.key}" aria-label="Quitar ${escapeHTML(product.name)}">×</button>
    </div>
  `;
}

function renderCartDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body) return;

  const cart = getCart();
  if (!cart.length) {
    body.innerHTML = `
      <div class="cart-empty" style="border:0;padding:36px 10px;">
        <span class="big">🛍️</span>
        <p style="color:var(--muted);margin:8px 0 14px;">Tu carrito está vacío, mi amor.</p>
        <a class="btn btn-sm" href="browse.html">Explorar tienda</a>
      </div>`;
    if (foot) foot.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(cartLineHTML).join('');

  if (foot) {
    foot.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div>
      <a class="btn btn-block" href="cart.html">Ver carrito & finalizar</a>
      <a class="btn btn-ghost btn-block btn-sm" href="browse.html">Seguir comprando</a>
    `;
  }
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (!drawer || !overlay) return;
  renderCartDrawer();
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------- toasts ---------- */
function toast(message, type) {
  let wrap = document.getElementById('toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'success' ? ' success' : '');
  el.textContent = message;
  wrap.appendChild(el);
  window.setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .25s';
    window.setTimeout(() => el.remove(), 260);
  }, 2200);
}

/* ---------- pedidos ---------- */
function getOrders() {
  const orders = readJSON(ORDERS_KEY, []);
  return Array.isArray(orders) ? orders : [];
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  writeJSON(ORDERS_KEY, orders);
}

function orderWhatsAppMessage(order) {
  const lines = order.items.map(item => `• ${item.name} (Talla ${item.size}) x${item.qty} — ${money(item.price * item.qty)}`);
  return [
    `¡Hola ${STORE.name}! 🎀 Quiero confirmar este pedido:`,
    '',
    ...lines,
    '',
    `Subtotal: ${money(order.subtotal)}`,
    `Envío: ${order.shipping === 0 ? 'GRATIS' : money(order.shipping)}`,
    `Total: ${money(order.total)}`,
    '',
    `Nombre: ${order.customer.name}`,
    `Teléfono: ${order.customer.phone}`,
    `Dirección: ${order.customer.address}`,
    order.customer.note ? `Nota: ${order.customer.note}` : '',
    '',
    `Pedido #${order.code}`
  ].filter(Boolean).join('\n');
}

function whatsappHref(text) {
  const base = STORE.whatsapp
    ? `https://wa.me/${STORE.whatsapp.replace(/\D/g, '')}`
    : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}

/* ---------- sync entre pestañas ---------- */
window.addEventListener('storage', event => {
  if ([CART_KEY, FAVS_KEY].includes(event.key)) {
    refreshCounts();
    renderCartDrawer();
    document.dispatchEvent(new CustomEvent('lunette:updated'));
  }
});
