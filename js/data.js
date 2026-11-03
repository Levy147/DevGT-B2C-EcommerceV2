/* ============================================================
   LUNETTE — Catálogo
   Tienda de moda y accesorios Y2K / Coquette · Guatemala
   ============================================================ */

const STORE = {
  name: 'Lunette',
  tagline: 'cute styles, y2k vibes',
  email: 'info@lunette.com',
  instagram: '@lunette',
  instagramUrl: 'https://instagram.com/lunette',
  tiktok: '@lunette',
  // Cambia este número por el WhatsApp real de la tienda (código país + número).
  whatsapp: '',
  currency: 'GTQ',
  shipping: 25,
  freeShippingFrom: 500,
  city: 'Guatemala'
};

const CATEGORIES = [
  { slug: 'tops',      name: 'Tops',        emoji: '👚', blurb: 'Cute tops & baby tees', icon: '✦' },
  { slug: 'faldas',    name: 'Faldas',      emoji: '🧚‍♀️', blurb: 'Mini skirts & Y2K vibes', icon: '✦' },
  { slug: 'hoodies',   name: 'Hoodies',     emoji: '🎧', blurb: 'Cute & cozy hoodies', icon: '✦' },
  { slug: 'accesorios',name: 'Accesorios',  emoji: '💎', blurb: 'Joyería & crystal hearts', icon: '✦' },
  { slug: 'bolsas',    name: 'Bolsas',      emoji: '👛', blurb: 'Mini bags & shoulder candy', icon: '✦' },
  { slug: 'outfits',   name: 'Outfits Y2K', emoji: '🎀', blurb: 'Sets listos para brillar', icon: '✦' }
];

const IMG = {
  tops: 'public/img/products/top.svg',
  faldas: 'public/img/products/falda.svg',
  hoodies: 'public/img/products/hoodie.svg',
  accesorios: 'public/img/products/accesorio.svg',
  bolsas: 'public/img/products/bolsa.svg',
  outfits: 'public/img/products/outfit.svg'
};

const PRODUCTS = [
  {
    id: 1, name: 'Angel Baby Top', category: 'tops', price: 145, oldPrice: 185,
    badge: 'sale', rating: 4.9, reviews: 38, image: IMG.tops,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Blanco'],
    description: 'Baby tee en algodón suavecito con lazo bordado y brillo sutil. El básico coquette que combina con todo.',
    details: ['Algodón premium', 'Detalle de lazo bordado', 'Fit entallado', 'Hecho para dropshipping consciente']
  },
  {
    id: 2, name: 'Cherry Crush Top', category: 'tops', price: 135,
    badge: 'new', rating: 4.8, reviews: 21, image: IMG.tops,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cereza', 'Rosa'],
    description: 'Top de manga corta con estampado de cerezas y ribete en contraste. Dulce, fresco y muy Y2K.',
    details: ['Tela elástica', 'Estampado cherry', 'Escote redondo', 'Lavar a mano']
  },
  {
    id: 3, name: 'Starlight Mesh Top', category: 'tops', price: 165,
    badge: 'best', rating: 5.0, reviews: 64, image: IMG.tops,
    sizes: ['XS', 'S', 'M'], colors: ['Rosa', 'Plateado'],
    description: 'Top de malla con estrellas y brillos. Perfecto para una noche de fotos con flash.',
    details: ['Malla stretch', 'Aplicaciones de brillo', 'Ideal para capas', 'Disponible en 2 tonos']
  },
  {
    id: 4, name: 'Coquette Lace Cami', category: 'tops', price: 155,
    rating: 4.7, reviews: 17, image: IMG.tops,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Marfil'],
    description: 'Camisola de encaje con tirantes ajustables. Romántica, ligera y con ese aire de muñeca de porcelana.',
    details: ['Encaje suave', 'Tirantes ajustables', 'Forro interior', 'Fit relajado']
  },
  {
    id: 5, name: 'Bunny Pleated Mini', category: 'faldas', price: 185,
    badge: 'new', rating: 4.9, reviews: 33, image: IMG.faldas,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Negro'],
    description: 'Falda plisada mini con cintura alta y forro. La pieza estrella de cualquier outfit coquette.',
    details: ['Plisado permanente', 'Cintura elástica', 'Forro interior', 'Largo mini']
  },
  {
    id: 6, name: 'Dollhouse Denim Mini', category: 'faldas', price: 210, oldPrice: 250,
    badge: 'sale', rating: 4.8, reviews: 26, image: IMG.faldas,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Denim claro', 'Denim rosa'],
    description: 'Mini falda de denim con bolsillos y costuras en contraste. Un clásico Y2K reinventado en rosa.',
    details: ['Denim rígido', 'Cintura alta', '5 bolsillos', 'Cierre con botón']
  },
  {
    id: 7, name: 'Sugar Rush Skirt', category: 'faldas', price: 175,
    badge: 'low', rating: 4.6, reviews: 12, image: IMG.faldas,
    sizes: ['S', 'M'], colors: ['Rosa', 'Lavanda'],
    description: 'Falda con volantes y lazo lateral. Suave como el algodón de azúcar, lista para brillar.',
    details: ['Volantes en capas', 'Lazo removible', 'Forro interior', 'Últimas piezas']
  },
  {
    id: 8, name: 'Cloud Bunny Hoodie', category: 'hoodies', price: 265,
    badge: 'best', rating: 5.0, reviews: 51, image: IMG.hoodie,
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Rosa pastel', 'Blanco'],
    description: 'Hoodie oversize con orejitas de conejo y bolsillo canguro. Abrazo de peluche garantizado.',
    details: ['Felpa afelpada', 'Orejitas 3D', 'Fit oversize', 'Unisex']
  },
  {
    id: 9, name: 'Y2K Cyber Hoodie', category: 'hoodies', price: 285,
    badge: 'new', rating: 4.8, reviews: 19, image: IMG.hoodie,
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Rosa', 'Negro'],
    description: 'Hoodie con gráficos pixel-art y detalles reflectantes. Nostalgia del internet de los 2000.',
    details: ['Estampado reflectante', 'Capucha forrada', 'Puños elásticos', 'Edición limitada']
  },
  {
    id: 10, name: 'Soft Girl Zip Hoodie', category: 'hoodies', price: 245, oldPrice: 295,
    badge: 'sale', rating: 4.7, reviews: 22, image: IMG.hoodie,
    sizes: ['S', 'M', 'L'], colors: ['Rosa', 'Lila'],
    description: 'Zip-up con cierre completo, capucha gigante y bolsillos. Cómodo para todos los planes cute.',
    details: ['Cierre metálico', 'Capucha doble', 'Bolsillos laterales', 'Tela suave']
  },
  {
    id: 11, name: 'Heart Sunglasses', category: 'accesorios', price: 75,
    badge: 'best', rating: 4.9, reviews: 88, image: IMG.accesorio,
    sizes: ['Única'], colors: ['Rosa', 'Rojo'],
    description: 'Lentes de corazón con acabado glossy. El accesorio viral para tus selfies.',
    details: ['Protección UV400', 'Montura flexible', 'Incluye estuche', 'Talla única']
  },
  {
    id: 12, name: 'Crystal Bow Clips', category: 'accesorios', price: 55,
    badge: 'new', rating: 4.8, reviews: 41, image: IMG.accesorio,
    sizes: ['Única'], colors: ['Rosa', 'Plateado'],
    description: 'Set de 2 pinzas con lazos de cristal. Pequeño detalle, máximo efecto coquette.',
    details: ['Set de 2 piezas', 'Cristales facetados', 'Broche seguro', 'Ideal para regalo']
  },
  {
    id: 13, name: 'Pearl Choker', category: 'accesorios', price: 90,
    rating: 4.7, reviews: 30, image: IMG.accesorio,
    sizes: ['Única'], colors: ['Perla', 'Rosa'],
    description: 'Gargantilla de perlas con corazón de cristal. Elegante con un toque de drama.',
    details: ['Perlas sintéticas', 'Extensión ajustable', 'Corazón de cristal', 'Hipoalergénico']
  },
  {
    id: 14, name: 'Star Charm Chain', category: 'accesorios', price: 65,
    badge: 'low', rating: 4.6, reviews: 14, image: IMG.accesorio,
    sizes: ['Única'], colors: ['Plateado', 'Dorado'],
    description: 'Cadena para bolso o cinturón con estrellas metálicas. Personaliza tu look en segundos.',
    details: ['Metal baño de plata', 'Largo ajustable', 'Dijes de estrella', 'Pocas unidades']
  },
  {
    id: 15, name: 'Mini Bag Coquette', category: 'bolsas', price: 195,
    badge: 'best', rating: 4.9, reviews: 47, image: IMG.bolsa,
    sizes: ['Única'], colors: ['Rosa', 'Magenta'],
    description: 'Bolso mini con asa de lazo y cierre magnético. Solo cabe lo esencial, pero qué esencial.',
    details: ['Asa de lazo', 'Cierre magnético', 'Forro interior', 'Talla única']
  },
  {
    id: 16, name: 'Metallic Y2K Shoulder Bag', category: 'bolsas', price: 225,
    badge: 'new', rating: 4.8, reviews: 23, image: IMG.bolsa,
    sizes: ['Única'], colors: ['Rosa metal', 'Plateado'],
    description: 'Bolso de hombro metálico que refleja todos los flashes. Icónico noventas, energía 2000.',
    details: ['Acabado metálico', 'Cadena removible', 'Bolsillo interior', 'Cierre de cremallera']
  },
  {
    id: 17, name: 'Bunny Backpack', category: 'bolsas', price: 240, oldPrice: 280,
    badge: 'sale', rating: 4.7, reviews: 18, image: IMG.bolsa,
    sizes: ['Única'], colors: ['Rosa', 'Blanco'],
    description: 'Mochila con orejitas, bolsillo frontal y espalda acolchada. Cute para el día a día.',
    details: ['Orejitas 3D', 'Espalda acolchada', 'Bolsillo para laptop 13"', 'Correas ajustables']
  },
  {
    id: 18, name: 'Dreamy Two-Piece Set', category: 'outfits', price: 350,
    badge: 'new', rating: 5.0, reviews: 29, image: IMG.outfit,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Lavanda'],
    description: 'Set de top y falda a juego con detalles de lazo. Outfit completo listo para tu próxima cita.',
    details: ['Incluye top y falda', 'Tejido suave', 'Detalles de lazo', 'Sets coordinados']
  },
  {
    id: 19, name: 'Coquette Picnic Set', category: 'outfits', price: 320,
    badge: 'best', rating: 4.9, reviews: 35, image: IMG.outfit,
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Rosa', 'Marfil'],
    description: 'Conjunto de blusa con volantes y falda midi. Perfecto para un picnic aesthetic de domingo.',
    details: ['Blusa + falda midi', 'Volantes románticos', 'Cintura elástica', 'Tela ligera']
  },
  {
    id: 20, name: 'Strawberry Lounge Set', category: 'outfits', price: 300, oldPrice: 360,
    badge: 'sale', rating: 4.8, reviews: 24, image: IMG.outfit,
    sizes: ['S', 'M', 'L'], colors: ['Rosa', 'Cereza'],
    description: 'Set casual de top corto y short con estampado de fresas. Comodidad con actitud.',
    details: ['Top + short', 'Estampado frutal', 'Cintura ajustable', 'Algodón suave']
  }
];

/* Utilidades de catálogo */
function productById(id) {
  return PRODUCTS.find(p => p.id === Number(id)) || null;
}

function productsByCategory(slug) {
  if (!slug || slug === 'all') return [...PRODUCTS];
  return PRODUCTS.filter(p => p.category === slug);
}

function categoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug) || null;
}

function productUrl(p) {
  return `product.html?id=${p.id}`;
}
