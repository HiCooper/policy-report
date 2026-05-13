import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/policy-report/', // 必须与部署子路径完全一致
  plugins: [react(), tailwindcss()],
})
