import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify('/api/users/'),
    },
    server: {
      proxy: {
        '/api/users': {
          target: env.VITE_BACKEND_PROXY_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
