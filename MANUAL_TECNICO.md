# 🛠️ Manual Técnico — Lunette

Tienda estática de moda Y2K / Coquette para Guatemala.

---

## 1. Stack

| Capa | Tecnología |
|------|------------|
| Markup | HTML5 estático |
| Estilos | CSS3 con variables y media queries |
| Lógica | JavaScript vanilla (sin framework) |
| Persistencia | `localStorage` |
| Fuentes | Google Fonts (Great Vibes, Orbitron, VT323, Quicksand) |
| Imágenes | SVG locales + PNG/JPG de marca |

No hay servidor, build, `package.json` ni base de datos.

---

## 2. Páginas y responsabilidades

| Página | `data-page` | Render |
|--------|-------------|--------|
| `index.html` | `home` | Categorías, nuevos ingresos, best sellers |
| `browse.html` | `browse` | Filtros, búsqueda, ordenamiento |
| `product.html` | `product` | Detalle, tallas, cantidad, relacionados |
| `cart.html` | `cart` | Carrito, totales, checkout demo |
| `search.html` | `search` | Búsqueda en vivo |
| `favorites.html` | `favorites` | Favoritos guardados |
| `account.html` | `account` | Perfil demo + pedidos |
| `messages.html` | `messages` | Formulario de contacto |
| `blog.html` | `blog` | Posts de ejemplo |
| `about.html` | `about` | Historia de marca |

---

## 3. Orden de scripts

Todos los scripts se cargan al final del `<body>`, en este orden:

```html
<script src="js/data.js"></script>        <!-- datos + helpers de catálogo -->
<script src="js/store.js"></script>       <!-- carrito, favoritos, pedidos -->
<script src="js/components.js"></script>  <!-- chrome compartido -->
<script src="js/app.js"></script>         <!-- render por página -->
```

`components.js` y `app.js` inicializan en `DOMContentLoaded`; el primero se
registra antes para inyectar header/sidebar/footer antes del render de página.

---

## 4. Componentes compartidos

Cada página declara slots:

```html
<div data-chrome="windowbar"></div>
<div data-chrome="header"></div>
<div class="layout">
  <div data-chrome="sidebar"></div>
  <main class="main-content">...</main>
</div>
<div data-chrome="footer"></div>
...
<div data-chrome="drawer"></div>
```

`renderChrome()` en `components.js` reemplaza cada slot por su plantilla:
barra de ventana retro, header + navbar, sidebar, footer y carrito lateral.

---

## 5. Modelo de datos

`js/data.js` expone:

- `STORE` — configuración de marca, contacto, envío y WhatsApp.
- `CATEGORIES` — `{ slug, name, emoji, blurb, icon }`.
- `PRODUCTS` — catálogo (20 productos demo).
- `productById(id)`, `productsByCategory(slug)`, `categoryBySlug(slug)`, `productUrl(p)`.

Producto:

```js
{
  id, name, category, price, oldPrice,
  badge, rating, reviews, image,
  sizes, colors, description, details
}
```

---

## 6. Carrito, favoritos y pedidos

`js/store.js` usa estas claves:

| Clave | Formato |
|-------|---------|
| `lunette_cart_v1` | `[{ key, id, size, qty }]` |
| `lunette_favs_v1` | `[id, id, ...]` |
| `lunette_orders_v1` | `[{ code, createdAt, items, subtotal, shipping, total, customer, status }]` |

Funciones relevantes:

- `addToCart(id, size, qty)`
- `updateCartQty(key, qty)` / `removeFromCart(key)` / `clearCart()`
- `toggleFavorite(id)` / `isFavorite(id)`
- `saveOrder(order)` / `getOrders()`
- `whatsappHref(text)` — usa `STORE.whatsapp`; si está vacío abre `wa.me` para elegir chat.

`saveCart()` dispara el evento `lunette:updated`; `toggleFavorite()` dispara
`lunette:favorites`. Las vistas se suscriben para re-renderizar.

---

## 7. Eventos globales

Delegación de clics en `components.js`:

| Atributo | Acción |
|----------|--------|
| `data-add="id"` | Agrega al carrito con la primera talla |
| `data-fav="id"` | Alterna favorito |
| `data-cart-remove="key"` | Quita una línea del carrito |
| `data-open-cart` | Abre el drawer |
| `data-close-cart` | Cierra el drawer |
| `data-logout` | Toast de sesión demo |
| `#navToggle` | Menú móvil |

En `product.html` el botón de agregar usa el listener propio para respetar la
talla y cantidad seleccionadas.

---

## 8. Diseño

`css/y2k.css` contiene todo:

- Variables de color, fuentes y sombras.
- Marco tipo ventana retro (`.browser-window`, `.window-bar`).
- Logo metálico animado (`.logo-cursive` + `.logo-bold`).
- Navbar píldora, sidebar con lazos CSS, cards, formularios, drawer.
- Breakpoints en `1020px`, `820px` y `560px`.
- Soporte para `prefers-reduced-motion`.

Paleta principal: `#ff3d8b`, `#ff6b9d`, `#e6006b`, `#b3004d`, fondos `#0d0208` y
`#1a0a14`, acentos dorados/plateados.

---

## 9. Imágenes

- `public/img/brand/mascot.png` — mascota (header, footer, contacto).
- `public/img/brand/avatar.png` — foto de perfil de la cuenta.
- `public/img/brand/banner.jpg` — fondo del hero.
- `public/img/brand/inspo.jpg` — lookbook del sidebar.
- `public/img/products/*.svg` — ilustraciones por categoría.

Para fotos reales, cambia `image` en cada producto o reemplaza el SVG.

---

## 10. Configuración de WhatsApp y envío

En `js/data.js`:

```js
const STORE = {
  whatsapp: '',            // número real sin signos: 502XXXXXXXX
  shipping: 25,
  freeShippingFrom: 500
};
```

El checkout arma un mensaje con productos, tallas, cantidades, total y datos de
entrega, y lo abre en WhatsApp o en el cliente de correo.

---

## 11. Limpiar datos de demo

```js
localStorage.removeItem('lunette_cart_v1');
localStorage.removeItem('lunette_favs_v1');
localStorage.removeItem('lunette_orders_v1');
location.reload();
```

---

## 12. Legacy

Las páginas y scripts de la demo anterior (Eli Boutique: `catalogo.html`,
`vestido.html`, `admin/`, `public/js/`, `public/css/`, etc.) permanecen en el
repositorio por historial, pero **no están enlazados** desde la tienda Lunette.
Se pueden eliminar cuando ya no se necesiten.
