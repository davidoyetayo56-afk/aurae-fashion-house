# AURAÈ — Fashion House

A fresh, responsive fashion storefront and interactive 3D studio built from scratch.

## Features
- Editorial dark-mode storefront with responsive product grid
- Product category filtering and live search
- Shopping bag with quantity controls and WhatsApp checkout
- Interactive Three.js mannequin preview with orbit, zoom, auto-rotation and colour switching
- Optional GLB model loading from `public/models/aurae-look.glb`
- Mobile-first controls and reduced-motion support

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

To use a real 3D garment/model, add a GLB at `public/models/aurae-look.glb`. The studio includes a procedural fallback model until the file is supplied.

Product prices and catalogue copy are starter content and should be confirmed by AURAÈ before accepting orders.
