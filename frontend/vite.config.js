import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  
  base: "/avacom_frontend/", // <--- VERIFIQUE ESTA LINHA COM MUITA ATENÇÃO

  server: {
    host: '127.0.0.1',
    port: 8080 
  }
})