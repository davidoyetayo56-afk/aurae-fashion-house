# AURAÈ — Dreams in Motion

The AURAÈ fashion house experience, restored from the original project and kept in a separate repository.

## Pages
- Home
- Shop and Collections
- Individual product details
- 3D Studio
- Lookbook
- Our Story

## 3D Studio
Built with React Three Fiber and Three.js. Visitors can rotate the mannequin, switch front/back views, reset the camera, select garments, choose sizes, and assemble a look. The cart persists between pages and enquiries continue through WhatsApp.

The viewer includes procedural mannequin and garment fallbacks. Production GLB files can be added under `public/models/` using the filenames configured in `src/data/products.js`.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Live publishing
The `.github/workflows/deploy-pages.yml` workflow builds the site and publishes it to GitHub Pages whenever changes reach `main`. The Vite base path is relative so the project works from the repository Pages URL.

## Brand and order details
Product names, descriptions, sizes and model paths live in `src/data/products.js`. The WhatsApp contact is configured once in `src/config.js`. Prices remain enquiry-based until confirmed.
