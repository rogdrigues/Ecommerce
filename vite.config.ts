import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ["react-csv", "react-image-gallery"],
  },
  build: {
    commonjsOptions: {
      include: [/react-csv/, /react-image-gallery/, /node_modules/],
    },
  },
  server: {
    port: 3000,
  },
})
