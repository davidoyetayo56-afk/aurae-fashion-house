const glb = (n) => `${import.meta.env.BASE_URL}models/${n}`;

export const MANNEQUIN_MODEL = glb("mannequin.glb");

// Collection 01 — the six designs supplied for the AURAÈ drop.
// Garment GLBs can replace the procedural fitting-room previews when supplied.
export const products = [
  {
    id: "aurae-wing-graphic-tee",
    image: "/images/collection-01/wing-graphic-tee.webp",
    name: "Wing Graphic Tee",
    category: "T-Shirts",
    slot: "top",
    price: 0,
    tagline: "Make your own mark.",
    description: "Black oversized tee with the AURAÈ wing emblem on the front and bold graphic artwork across the back.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    model: glb("aurae-wing-graphic-tee.glb"),
    color: "#090909",
    available: true
  },
  {
    id: "aurae-wing-tank",
    image: "/images/collection-01/wing-tank.webp",
    name: "Wing Graphic Tank",
    category: "Tanks",
    slot: "top",
    price: 0,
    tagline: "Same energy. New shape.",
    description: "Black tank with contrast white trim, the wing emblem on the front and oversized artwork on the back.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    model: glb("aurae-wing-tank.glb"),
    color: "#090909",
    available: true
  },
  {
    id: "aurae-number-17-jersey",
    image: "/images/collection-01/number-17-jersey.webp",
    name: "Number 17 Jersey",
    category: "Jerseys",
    slot: "top",
    price: 0,
    tagline: "Made to stand out.",
    description: "Black and charcoal AURAÈ jersey with contour graphics, a clean front crest and bold number 17 on the back.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    model: glb("aurae-number-17-jersey.glb"),
    color: "#171717",
    available: true
  },
  {
    id: "aurae-vision-polo",
    image: "/images/collection-01/vision-polo.webp",
    name: "Vision Polo",
    category: "Polos",
    slot: "top",
    price: 0,
    tagline: "Look closer.",
    description: "Deep burgundy fitted polo with a clean AURAÈ chest mark and detailed face artwork across the back.",
    sizes: ["S", "M", "L", "XL"],
    model: glb("aurae-vision-polo.glb"),
    color: "#501321",
    available: true
  },
  {
    id: "aurae-thorn-shirt",
    image: "/images/collection-01/thorn-button-shirt.webp",
    name: "Thorn Button Shirt",
    category: "Shirts",
    slot: "top",
    price: 0,
    tagline: "No quiet entrances.",
    description: "Bold red short-sleeve button shirt with black thorn artwork on the front and back.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    model: glb("aurae-thorn-shirt.glb"),
    color: "#d52b1e",
    available: true
  },
  {
    id: "aurae-spider-shorts",
    image: "/images/collection-01/spider-shorts.webp",
    name: "Spider Shorts",
    category: "Shorts",
    slot: "bottom",
    price: 0,
    tagline: "Move your way.",
    description: "Heather-grey relaxed shorts with white drawcords, a bold black spider graphic and AURAÈ signature branding.",
    sizes: ["S", "M", "L", "XL"],
    model: glb("aurae-spider-shorts.glb"),
    color: "#bfc0c4",
    available: true
  }
];

export const byId = Object.fromEntries(products.map((product) => [product.id, product]));
export const presets = [
  { name: "LOOK 01 · WING TEE", outfit: { top: "aurae-wing-graphic-tee", bottom: "aurae-spider-shorts", accessory: null } },
  { name: "LOOK 02 · NUMBER 17", outfit: { top: "aurae-number-17-jersey", bottom: "aurae-spider-shorts", accessory: null } },
  { name: "LOOK 03 · THORN SHIRT", outfit: { top: "aurae-thorn-shirt", bottom: "aurae-spider-shorts", accessory: null } }
];
