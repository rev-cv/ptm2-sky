import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                exportType: 'default', // экспорт по умолчанию (для версий 4.0+)
                ref: true, // поддержка передачи ref
                svgo: true, // оптимизация SVG с помощью SVGO
                titleProp: true, // поддержка свойства title
            },
            include: '**/*.svg', // обрабатывать все SVG-файлы
        })
    ],
    resolve: {
        alias: {
            '@comps':  path.resolve(__dirname, './src/components'),
            '@utils':  path.resolve(__dirname, './src/utils'),
            '@asset':  path.resolve(__dirname, './src/assets'),
            '@mytype': path.resolve(__dirname, './src/types'),
            '@frames': path.resolve(__dirname, './src/frames'),
            '@pages':  path.resolve(__dirname, './src/pages'),
            '@api':  path.resolve(__dirname, './src/api')
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:3000',  // API-сервер
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
