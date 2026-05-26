import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' uses relative paths, so the build works correctly
// when deployed to any subdirectory on GitHub Pages (e.g. /repo-name/)
export default defineConfig({
  plugins: [react()],
  base: './',
})
