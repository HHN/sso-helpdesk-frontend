import { defineConfig } from 'vite'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// Use async config
export default defineConfig(async () => {
  const vue = (await import('@vitejs/plugin-vue')).default

  return {
    plugins: [
      vue({ template: { transformAssetUrls } }),
      vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/settings.scss',
        },
      }),
    ],
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    server: {
      port: 3000,
      proxy: {
        '/admin': {
          target: 'http://localhost:8080',
          headers: {
            "X-Forwarded-Host": "http://localhost:3000"
          }
        },
        '/oauth2': {
          target: 'http://localhost:8080',
          headers: {
            "X-Forwarded-Host": "http://localhost:3000"
          }
        },
        '/login': {
          target: 'http://localhost:8080',
          headers: {
            "X-Forwarded-Host": "http://localhost:3000"
          }
        },
      }
    },
  }
})
