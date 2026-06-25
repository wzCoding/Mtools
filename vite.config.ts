import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'
import fs from 'node:fs'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 打包前清理旧文件
fs.rmSync('dist-electron', { recursive: true, force: true })
fs.rmSync('dist', { recursive: true, force: true })

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    electron([
      {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            sourcemap: 'inline',
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: [
                'sharp',
                'onnxruntime-node',
                'onnxruntime-common',
              ],
            },
          },
          resolve: {
            alias: {
              '@native': path.resolve('native')
            }
          },
        },

      },
      {
        entry: 'electron/ipc/ipc-inpaint-worker.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: [
                'sharp',
                'onnxruntime-node',
                'onnxruntime-common',
              ],
            },
          },
        },
      },
      {
        entry: 'electron/preload/index.ts',
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            sourcemap: 'inline',
            outDir: 'dist-electron/preload'
          }
        }
      }
    ]),
    renderer(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@native': path.resolve(__dirname, 'native')
    }
  },
 
})
