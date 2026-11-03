# 🎀 Lunette

**Tienda online de moda y accesorios Y2K / Coquette — Guatemala**

Catálogo de ropa, bolsos y accesorios con estética de internet de los 2000:
rosa monocromático, logo metálico, marcos retro, lazos, destellos y la conejita
de la marca como mascota.

> `cute styles, y2k vibes ₊˚⊹`

---

## ✨ Qué incluye

- **Home** con hero “Nueva Colección”, categorías, nuevos ingresos y best sellers.
- **Browse** con búsqueda, filtros por categoría/etiqueta y ordenamiento.
- **Detalle de producto** con galería, tallas, cantidad, favoritos y relacionados.
- **Carrito lateral** + página de carrito con envío y totales.
- **Checkout demo** que genera un pedido y lo envía por WhatsApp o correo.
- **Favoritos**, **Mi cuenta**, **Search**, **Messages**, **Blog** y **About**.
- **Responsive** para celular, tablet y escritorio.
- **Sin dependencias ni build**: HTML, CSS y JavaScript vanilla.

---

## 🚀 Cómo abrirlo

Abre `index.html` directamente en el navegador o sirve la carpeta con cualquier
servidor estático:

```bash
python -m http.server 8000
# luego abre http://localhost:8000
```

No requiere Node.js, instalación ni base de datos. El carrito, los favoritos y
los pedidos se guardan en `localStorage`.

---

## 🗂️ Estructura

```
ShopStoreEly/
├── index.html           # Home
├── browse.html          # Catálogo con filtros
├── product.html         # Detalle de producto
├── cart.html            # Carrito + checkout
├── search.html          # Búsqueda
├── favorites.html       # Favoritos
├── account.html         # Mi cuenta y pedidos
├── messages.html        # Contacto
├── blog.html            # Blog
├── about.html           # Sobre la marca
│
├── css/
│   └── y2k.css          # Sistema de diseño completo (tema, layout, responsive)
│
├── js/
│   ├── data.js          # STORE, categorías y catálogo de productos
│   ├── store.js         # Carrito, favoritos, pedidos, toasts y utilidades
│   ├── components.js    # Header, sidebar, footer y carrito lateral
│   └── app.js           # Render de cada página
│
└── public/img/
    ├── brand/           # mascot.png, avatar.png, banner.jpg, inspo.jpg
    └── products/        # Ilustraciones SVG de producto
```

> Los archivos de la demo anterior (Eli Boutique) siguen en el proyecto pero ya
> no forman parte de la navegación de Lunette.

---

## ⚙️ Personalización rápida

### Datos de la tienda
Edita `STORE` en `js/data.js`:

```js
const STORE = {
  email: 'info@lunette.com',
  instagram: '@lunette',
  whatsapp: '',              // ← coloca el número real (ej. 50255555555)
  shipping: 25,              // envío en GTQ
  freeShippingFrom: 500      // envío gratis desde
};
```

Con `whatsapp: ''`, el checkout abre WhatsApp para elegir contacto. Si colocas
el número, los pedidos irán directo a ese chat.

### Productos
Agrega objetos dentro de `PRODUCTS` (`js/data.js`):

```js
{
  id: 21,
  name: 'Mi Producto',
  category: 'tops',        // slug de CATEGORIES
  price: 150,
  oldPrice: 180,           // opcional
  badge: 'new',            // new | sale | best | low
  rating: 4.9,
  reviews: 12,
  image: IMG.tops,         // o 'public/img/products/mi-foto.jpg'
  sizes: ['S', 'M', 'L'],
  colors: ['Rosa'],
  description: '...',
  details: ['...']
}
```

### Categorías
Edita `CATEGORIES` en `js/data.js`. El `slug` se usa en `browse.html?cat=slug`.

### Imágenes reales
Reemplaza los SVG de `public/img/products/` por fotos locales o cambia el campo
`image` de cada producto. Para fotos de catálogo usa formato cuadrado/vertical
(4:5) y nombres sin espacios.

### Mascota y banner
Sustituye `public/img/brand/mascot.png`, `avatar.png`, `banner.jpg` e
`inspo.jpg` manteniendo los nombres.

---

## 💾 Datos guardados en el navegador

| Clave | Contenido |
|-------|-----------|
| `lunette_cart_v1` | Carrito |
| `lunette_favs_v1` | Favoritos |
| `lunette_orders_v1` | Pedidos generados |

Para reiniciar la tienda:

```js
localStorage.removeItem('lunette_cart_v1');
localStorage.removeItem('lunette_favs_v1');
localStorage.removeItem('lunette_orders_v1');
location.reload();
```

---

## 🚢 Modelo de venta

La tienda está pensada para un modelo **dropshipping** (proveedores
internacionales) con atención al cliente en Guatemala:

1. La clienta arma su carrito.
2. Completa nombre, teléfono y dirección.
3. Se genera un pedido y se envía por WhatsApp o correo.
4. Se confirma stock, pago y entrega de forma manual.

---

## 📱 Responsive

- Escritorio: sidebar + contenido con marcos retro.
- Tablet: una columna, sidebar en dos bloques.
- Móvil: menú hamburguesa, contenido primero, tarjetas de 2 columnas.

---

## 📄 Licencia

Demo educativa y comercial. Proyecto libre para presentaciones y personalización.
