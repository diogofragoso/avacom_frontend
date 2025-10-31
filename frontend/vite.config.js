import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Linha que garante que o site funcione no GitHub Pages
  base: "/avacom_frontend/",

  // trecho adicionado para lab 21
  server: {
    host: '127.0.0.1',
    port: 8080 
  }
})