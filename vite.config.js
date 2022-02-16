import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue()
  ],
  base: '/public/build/',
  build: {
    manifest: true,
    outDir: 'public/build',
    rollupOptions: {
      input: 'frontend/app.js',
    },
  },
}