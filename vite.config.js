import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' makes asset paths work on GitHub Pages (any repo name)
export default defineConfig({ base: './', plugins: [react()] })
