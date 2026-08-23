import type { Product } from "@/types/product";

/**
 * Seed catalog for local/dev when Supabase is not configured.
 * Replace via admin + Supabase in production.
 */
export const seedProducts: Product[] = [
  {
    id: "p1",
    brand: "Chanel",
    name: "Coco Mademoiselle",
    slug: "chanel-coco-mademoiselle",
    description:
      "A radiant oriental fragrance with sparkling orange, jasmine, and rosewood — confident, modern, and unmistakably Chanel.",
    concentration: "Eau de Parfum",
    notesTop: ["Orange", "Mandarin"],
    notesMid: ["Jasmine", "Rose"],
    notesBase: ["Patchouli", "Vetiver"],
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    ],
    featured: true,
    active: true,
    gender: "Women",
    variants: [
      {
        id: "p1-v50",
        sizeMl: 50,
        priceGhs: 1850,
        sku: "CH-CM-50",
        onHand: 12,
        reserved: 0,
      },
      {
        id: "p1-v100",
        sizeMl: 100,
        priceGhs: 2650,
        sku: "CH-CM-100",
        onHand: 8,
        reserved: 0,
      },
    ],
  },
  {
    id: "p2",
    brand: "Tom Ford",
    name: "Oud Wood",
    slug: "tom-ford-oud-wood",
    description:
      "Rare oud wood wrapped in spices and rosewood — a signature scent of quiet luxury.",
    concentration: "Eau de Parfum",
    notesTop: ["Rosewood", "Cardamom"],
    notesMid: ["Oud", "Sandalwood"],
    notesBase: ["Tonka Bean", "Amber"],
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p2-v50",
        sizeMl: 50,
        priceGhs: 2200,
        sku: "TF-OW-50",
        onHand: 6,
        reserved: 0,
      },
      {
        id: "p2-v100",
        sizeMl: 100,
        priceGhs: 3400,
        sku: "TF-OW-100",
        onHand: 4,
        reserved: 0,
      },
    ],
  },
  {
    id: "p3",
    brand: "Creed",
    name: "Aventus",
    slug: "creed-aventus",
    description:
      "Bold pineapple and birch with a smoky base — the iconic scent of ambition.",
    concentration: "Eau de Parfum",
    notesTop: ["Pineapple", "Bergamot"],
    notesMid: ["Birch", "Jasmine"],
    notesBase: ["Musk", "Oakmoss"],
    images: [
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80",
    ],
    featured: true,
    active: true,
    gender: "Men",
    variants: [
      {
        id: "p3-v50",
        sizeMl: 50,
        priceGhs: 3100,
        sku: "CR-AV-50",
        onHand: 5,
        reserved: 0,
      },
      {
        id: "p3-v100",
        sizeMl: 100,
        priceGhs: 4800,
        sku: "CR-AV-100",
        onHand: 3,
        reserved: 0,
      },
    ],
  },
  {
    id: "p4",
    brand: "Dior",
    name: "Sauvage",
    slug: "dior-sauvage",
    description:
      "Fresh Calabrian bergamot meets ambroxan — raw, magnetic, and endlessly wearable.",
    concentration: "Eau de Toilette",
    notesTop: ["Bergamot", "Pepper"],
    notesMid: ["Lavender", "Sichuan Pepper"],
    notesBase: ["Ambroxan", "Cedar"],
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    ],
    featured: false,
    active: true,
    gender: "Men",
    variants: [
      {
        id: "p4-v60",
        sizeMl: 60,
        priceGhs: 1450,
        sku: "DI-SA-60",
        onHand: 15,
        reserved: 0,
      },
      {
        id: "p4-v100",
        sizeMl: 100,
        priceGhs: 1950,
        sku: "DI-SA-100",
        onHand: 10,
        reserved: 0,
      },
    ],
  },
  {
    id: "p5",
    brand: "Yves Saint Laurent",
    name: "Black Opium",
    slug: "ysl-black-opium",
    description:
      "Addictive coffee and vanilla wrapped in white flowers — nightlife in a bottle.",
    concentration: "Eau de Parfum",
    notesTop: ["Pink Pepper", "Orange Blossom"],
    notesMid: ["Coffee", "Jasmine"],
    notesBase: ["Vanilla", "Patchouli"],
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    ],
    featured: true,
    active: true,
    gender: "Women",
    variants: [
      {
        id: "p5-v50",
        sizeMl: 50,
        priceGhs: 1550,
        sku: "YSL-BO-50",
        onHand: 9,
        reserved: 0,
      },
      {
        id: "p5-v90",
        sizeMl: 90,
        priceGhs: 2100,
        sku: "YSL-BO-90",
        onHand: 7,
        reserved: 0,
      },
    ],
  },
  {
    id: "p6",
    brand: "Maison Francis Kurkdjian",
    name: "Baccarat Rouge 540",
    slug: "mfk-baccarat-rouge-540",
    description:
      "Saffron and ambergris in crystalline harmony — luminous, rare, unforgettable.",
    concentration: "Eau de Parfum",
    notesTop: ["Saffron", "Jasmine"],
    notesMid: ["Amberwood", "Ambergris"],
    notesBase: ["Fir Resin", "Cedar"],
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800&q=80",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p6-v70",
        sizeMl: 70,
        priceGhs: 4200,
        sku: "MFK-BR-70",
        onHand: 4,
        reserved: 0,
      },
      {
        id: "p6-v200",
        sizeMl: 200,
        priceGhs: 7800,
        sku: "MFK-BR-200",
        onHand: 2,
        reserved: 0,
      },
    ],
  },
  {
    id: "p7",
    brand: "Jo Malone",
    name: "English Pear & Freesia",
    slug: "jo-malone-english-pear-freesia",
    description:
      "Ripe pear and white freesia over a soft patchouli base — elegant and effortless.",
    concentration: "Cologne",
    notesTop: ["Pear", "Melon"],
    notesMid: ["Freesia", "Rose"],
    notesBase: ["Patchouli", "Amber"],
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
    ],
    featured: false,
    active: true,
    gender: "Women",
    variants: [
      {
        id: "p7-v30",
        sizeMl: 30,
        priceGhs: 950,
        sku: "JM-EP-30",
        onHand: 14,
        reserved: 0,
      },
      {
        id: "p7-v100",
        sizeMl: 100,
        priceGhs: 1750,
        sku: "JM-EP-100",
        onHand: 8,
        reserved: 0,
      },
    ],
  },
  {
    id: "p8",
    brand: "Bleu de Chanel",
    name: "Bleu de Chanel",
    slug: "bleu-de-chanel",
    description:
      "A woody aromatic with citrus freshness — polished, versatile, timelessly masculine.",
    concentration: "Eau de Parfum",
    notesTop: ["Grapefruit", "Lemon"],
    notesMid: ["Ginger", "Nutmeg"],
    notesBase: ["Sandalwood", "Cedar"],
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    ],
    featured: false,
    active: true,
    gender: "Men",
    variants: [
      {
        id: "p8-v50",
        sizeMl: 50,
        priceGhs: 1750,
        sku: "CH-BD-50",
        onHand: 11,
        reserved: 0,
      },
      {
        id: "p8-v100",
        sizeMl: 100,
        priceGhs: 2450,
        sku: "CH-BD-100",
        onHand: 6,
        reserved: 0,
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return seedProducts.find((p) => p.slug === slug && p.active);
}

export function getProductById(id: string): Product | undefined {
  return seedProducts.find((p) => p.id === id && p.active);
}

export function getFeaturedProducts(): Product[] {
  return seedProducts.filter((p) => p.active && p.featured);
}

export function getBrands(): string[] {
  return Array.from(
    new Set(seedProducts.filter((p) => p.active).map((p) => p.brand))
  ).sort();
}

export function getVariant(
  productId: string,
  variantId: string
): { product: Product; variant: Product["variants"][0] } | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return undefined;
  return { product, variant };
}
