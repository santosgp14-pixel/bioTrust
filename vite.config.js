import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GITHUB_REPOSITORY is set automatically by GitHub Actions (e.g. "user/repo-name")
// We extract just the repo name to use as the base path for GitHub Pages.
// Locally (npm run dev / npx serve dist) it falls back to '/'
const repoName = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : '/'

export default defineConfig({
  plugins: [react()],
  base: repoName,
})
