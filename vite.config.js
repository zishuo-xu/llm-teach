import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages 项目站点挂在 /llm-teach/ 子路径下
  base: '/llm-teach/',
  plugins: [react(), tailwindcss()],
})
