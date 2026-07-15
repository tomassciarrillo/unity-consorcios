import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Cambiamos el PostCSS por el plugin nativo de Vite

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,       // <-- Le exigimos usar el 5173
    strictPort: true  // <-- Si está ocupado, que tire error en vez de mudarse al 5174
  }
})