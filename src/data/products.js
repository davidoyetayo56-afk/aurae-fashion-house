const glb = (n) => `${import.meta.env.BASE_URL}models/${n}`;

// The three current AURAÈ drop styles. Prices remain unlisted until confirmed.
export const MANNEQUIN_MODEL = glb("mannequin.glb");
export const products = [
  {
    id: "aurae-spider-shorts",
    name: "AURAÈ Spider Shorts",
    category: "Shorts",
    slot: "bottom",
    price: 0,
    tagline: "Move with intention.",
    description: "Heather-grey shorts with white drawcords, the black spider graphic and AURAÈ signature branding.",
    sizes: ["S", "M", "L", "XL"],
    model: glb("aurae-spider-shorts.glb"),
    color: "#bfc0c4",
    available: true
  },
  {
    id: "aurae-thorn-shirt",
    name: "AURAÈ Thorn Shirt",
    category: "Shirts",
    slot: "top",
    price: 0,
    tagline: "Never ordinary.",
    description: "Red short-sleeve button-up with the black thorn illustration, AURAÈ front wordmark and signature back crest.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    model: glb("aurae-thorn-shirt.glb"),
    color: "#d5241c",
    available: true
  },
  {
    id: "aurae-money-maker-tee",
    name: "AURAÈ Money Maker Tee",
    category: "T-Shirts",
    slot: "top",
    price: 0,
    tagline: "Dreams into motion.",
    description: "Oversized black tee with a red AURAÈ front mark and bold Money Maker artwork on the back.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    model: glb("aurae-money-maker-tee.glb"),
    color: "#0d0d10",
    available: true
  }
];
export const byId = Object.fromEntries(products.map((product) => [product.id, product]));
export const presets = [
  { name: "LOOK 01 · SPIDER SHORTS", outfit: { top: null, bottom: "aurae-spider-shorts", accessory: null } },
  { name: "LOOK 02 · THORN SHIRT", outfit: { top: "aurae-thorn-shirt", bottom: null, accessory: null } },
  { name: "LOOK 03 · MONEY MAKER", outfit: { top: "aurae-money-maker-tee", bottom: null, accessory: null } }
];
