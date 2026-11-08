# AURAÈ — Fashion House

A fresh, responsive fashion storefront and interactive 3D studio.

## Experience
- Editorial, dark-mode storefront with responsive layouts
- Product category filters and live search that work together
- Shopping bag with quantity controls, remove actions and WhatsApp enquiry checkout
- Interactive Three.js outfit preview with 360° orbit, zoom, auto-rotation, reset and colourways
- GLB model support: add your own production garment model at `public/models/obsidian_black_boutique_mannequin_reference_v2.glb`
- Procedural 3D outfit preview shown until a custom GLB is supplied
- Keyboard escape handling, accessible control labels and reduced-motion styling

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

## Add a custom 3D garment
Create `public/models/` and add a model named `obsidian_black_boutique_mannequin_reference_v2.glb`. Use a centred, upright GLB with the full outfit visible. The studio will automatically load it in place of the procedural preview.

## Before launch
The catalogue photography and product descriptions are starter content. Confirm the real product range, imagery, contact number, sizes, delivery terms and prices before accepting orders. Prices are intentionally enquiry-based until confirmed.
