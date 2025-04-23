import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

// trecho adicionado para lab 21
server: {
  host: '127.0.0.1',
  port: 8080 // você pode mudar a porta se quiser
}
// fim do trecho




})
