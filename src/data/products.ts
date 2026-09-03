import type { Product } from "@/types/product";

/**
 * Oud-forward seed catalog for Lit Perfumes.
 * Replace via admin + Supabase in production.
 */
export const seedProducts: Product[] = [
  {
    id: "p1",
    brand: "Tom Ford",
    name: "Oud Wood",
    slug: "tom-ford-oud-wood",
    description:
      "Rare oud wood wrapped in spices and rosewood — the signature scent of quiet luxury, gift-ready and unforgettable.",
    concentration: "Eau de Parfum",
    notesTop: ["Rosewood", "Cardamom"],
    notesMid: ["Oud", "Sandalwood"],
    notesBase: ["Tonka Bean", "Amber"],
    images: [
      "/product-images/product-oud-wood.png",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p1-v50",
        sizeMl: 50,
        priceGhs: 2200,
        sku: "TF-OW-50",
        onHand: 10,
        reserved: 0,
      },
      {
        id: "p1-v100",
        sizeMl: 100,
        priceGhs: 3400,
        sku: "TF-OW-100",
        onHand: 7,
        reserved: 0,
      },
    ],
  },
  {
    id: "p2",
    brand: "Tom Ford",
    name: "Tobacco Oud",
    slug: "tom-ford-tobacco-oud",
    description:
      "Smoked tobacco leaf meets deep agarwood — warm, daring, and made for evenings that linger.",
    concentration: "Eau de Parfum",
    notesTop: ["Tobacco Leaf", "Spices"],
    notesMid: ["Oud", "Labdanum"],
    notesBase: ["Vanilla", "Dried Fruits"],
    images: [
      "/product-images/product-tobacco-oud.png",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p2-v50",
        sizeMl: 50,
        priceGhs: 2450,
        sku: "TF-TO-50",
        onHand: 8,
        reserved: 0,
      },
      {
        id: "p2-v100",
        sizeMl: 100,
        priceGhs: 3650,
        sku: "TF-TO-100",
        onHand: 5,
        reserved: 0,
      },
    ],
  },
  {
    id: "p3",
    brand: "Maison Francis Kurkdjian",
    name: "Oud Satin Mood",
    slug: "mfk-oud-satin-mood",
    description:
      "Rose and violet over a silky oud base — opulent, soft, and unmistakably luxurious.",
    concentration: "Eau de Parfum",
    notesTop: ["Violet", "Rose"],
    notesMid: ["Oud", "Benzoin"],
    notesBase: ["Vanilla", "Amber"],
    images: [
      "/product-images/product-oud-satin-mood.png",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p3-v70",
        sizeMl: 70,
        priceGhs: 4500,
        sku: "MFK-OSM-70",
        onHand: 6,
        reserved: 0,
      },
      {
        id: "p3-v200",
        sizeMl: 200,
        priceGhs: 8200,
        sku: "MFK-OSM-200",
        onHand: 2,
        reserved: 0,
      },
    ],
  },
  {
    id: "p4",
    brand: "Creed",
    name: "Royal Oud",
    slug: "creed-royal-oud",
    description:
      "Pink pepper and cedar around a noble oud heart — regal, polished, and quietly powerful.",
    concentration: "Eau de Parfum",
    notesTop: ["Pink Pepper", "Lemon"],
    notesMid: ["Oud", "Cedar"],
    notesBase: ["Sandalwood", "Musk"],
    images: [
      "/product-images/product-royal-oud.png",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p4-v50",
        sizeMl: 50,
        priceGhs: 3600,
        sku: "CR-RO-50",
        onHand: 5,
        reserved: 0,
      },
      {
        id: "p4-v100",
        sizeMl: 100,
        priceGhs: 5400,
        sku: "CR-RO-100",
        onHand: 3,
        reserved: 0,
      },
    ],
  },
  {
    id: "p5",
    brand: "Dior",
    name: "Oud Ispahan",
    slug: "dior-oud-ispahan",
    description:
      "Damask rose and smoky oud in a dramatic oriental — rich, romantic, and unforgettable.",
    concentration: "Eau de Parfum",
    notesTop: ["Labdanum", "Saffron"],
    notesMid: ["Rose", "Oud"],
    notesBase: ["Patchouli", "Benzoin"],
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
    ],
    featured: false,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p5-v75",
        sizeMl: 75,
        priceGhs: 3900,
        sku: "DI-OI-75",
        onHand: 6,
        reserved: 0,
      },
      {
        id: "p5-v125",
        sizeMl: 125,
        priceGhs: 5600,
        sku: "DI-OI-125",
        onHand: 3,
        reserved: 0,
      },
    ],
  },
  {
    id: "p6",
    brand: "Giorgio Armani",
    name: "Privé Oud Royal",
    slug: "armani-prive-oud-royal",
    description:
      "Spiced oud with amber and woods — a couture interpretation of Middle Eastern richness.",
    concentration: "Eau de Parfum",
    notesTop: ["Saffron", "Cardamom"],
    notesMid: ["Oud", "Incense"],
    notesBase: ["Amber", "Leather"],
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    ],
    featured: false,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p6-v50",
        sizeMl: 50,
        priceGhs: 3200,
        sku: "GA-OR-50",
        onHand: 7,
        reserved: 0,
      },
      {
        id: "p6-v100",
        sizeMl: 100,
        priceGhs: 4800,
        sku: "GA-OR-100",
        onHand: 4,
        reserved: 0,
      },
    ],
  },
  {
    id: "p7",
    brand: "Initio",
    name: "Oud for Greatness",
    slug: "initio-oud-for-greatness",
    description:
      "Black pepper and oud with a magnetic woody trail — bold, modern, and made to be noticed.",
    concentration: "Eau de Parfum",
    notesTop: ["Lavender", "Nutmeg"],
    notesMid: ["Oud", "Saffron"],
    notesBase: ["Patchouli", "Musk"],
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
    ],
    featured: true,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p7-v90",
        sizeMl: 90,
        priceGhs: 4100,
        sku: "IN-OG-90",
        onHand: 6,
        reserved: 0,
      },
      {
        id: "p7-v100",
        sizeMl: 100,
        priceGhs: 4500,
        sku: "IN-OG-100",
        onHand: 4,
        reserved: 0,
      },
    ],
  },
  {
    id: "p8",
    brand: "Montale",
    name: "Black Aoud",
    slug: "montale-black-aoud",
    description:
      "Intense rose and oud in a powerful Arabian composition — deep, lasting, and addictive.",
    concentration: "Eau de Parfum",
    notesTop: ["Rose", "Bergamot"],
    notesMid: ["Oud", "Patchouli"],
    notesBase: ["Musk", "Cedar"],
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
    ],
    featured: false,
    active: true,
    gender: "Unisex",
    variants: [
      {
        id: "p8-v50",
        sizeMl: 50,
        priceGhs: 980,
        sku: "MO-BA-50",
        onHand: 14,
        reserved: 0,
      },
      {
        id: "p8-v100",
        sizeMl: 100,
        priceGhs: 1450,
        sku: "MO-BA-100",
        onHand: 10,
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
