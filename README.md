# AURAE — 3D Showroom
React + Vite + React Three Fiber. Static, GitHub Pages ready. Orders go to WhatsApp.

## Run
```
npm install
npm run dev        # local
npm run build      # production build -> dist/
npm run deploy     # builds + publishes dist/ to the gh-pages branch
```
Then in GitHub: Settings → Pages → Branch `gh-pages`. (`base: './'` in vite.config.js keeps asset paths working.)

## Set your WhatsApp number
`src/config.js` → `WHATSAPP_NUMBER = "234XXXXXXXXXX"` (the only place it appears).

## Add your real 3D models
Drop these files in `public/models/` — no code change needed. Each one replaces its placeholder automatically:
`mannequin.glb`, `jersey-23.glb`, `aurae-tee.glb`, `faith-hoodie.glb`, `cargo-pants.glb`, `aurae-cap.glb` (`longsleeve.glb`, `beanie.glb` optional).
Export every garment at the mannequin's scale and origin (feet at y=0) so it lines up. Edit names/prices in `src/data/products.js`.
Missing files? The site shows a placeholder mannequin dressed with your product artwork instead.

## Structure
`src/data/products.js` products + presets · `src/state/cart.jsx` cart · `src/utils/whatsapp.js` message builder · `src/components/` Showroom, ThreeDViewer, Mannequin, CartDrawer
