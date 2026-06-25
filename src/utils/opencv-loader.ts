/**
 * OpenCV.js 动态加载器
 * 通过 <script> 标签加载 opencv.js（UMD + WASM），
 * 避免 Vite 打包时处理 8MB+ 的 WASM 模块导致的问题
 */

let cvReady = false
let cvLoading: Promise<void> | null = null
const openCvPath = './opencv/opencv.js'
/**
 * 动态加载 opencv.js 脚本
 */
function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`)
    if (existing) {
      if ((window as any).cv?.Mat && typeof (window as any).cv?.imread === 'function') {
        resolve()
        return
      }
      existing.remove()
    }

    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => {
      waitForCVReady().then(resolve).catch(reject)
    }
    script.onerror = () => {
      script.remove() 
      reject(new Error(`Failed to load script: ${url}`))
    }
    document.head.appendChild(script)
  })
}

/**
 * 等待 cv 对象完全就绪（WASM 初始化完成）
 */
function waitForCVReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const cv = (window as any).cv
    if (!cv) {
      reject(new Error($t('opencv-unmounted')))
      return
    }

    // 如果已经就绪
    if (cv.Mat && typeof cv.imread === 'function') {
      resolve()
      return
    }

    // opencv.js 使用 onRuntimeInitialized 回调
    if (typeof cv.onRuntimeInitialized === 'undefined') {
      // 轮询检查（兜底方案）
      let attempts = 0
      const maxAttempts = 100
      const interval = setInterval(() => {
        attempts++
        if (cv.Mat && typeof cv.imread === 'function') {
          clearInterval(interval)
          resolve()
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject(new Error($t('opencv-timeout')))
        }
      }, 100)
    } else {
      const originalCallback = cv.onRuntimeInitialized
      cv.onRuntimeInitialized = () => {
        if (originalCallback) originalCallback()
        resolve()
      }
    }
  })
}

/**
 * 加载 OpenCV.js，返回一个在 cv 就绪后 resolve 的 Promise
 * 多次调用会复用同一个加载 Promise
 */
export function loadOpenCV(): Promise<void> {
  if (cvReady) return Promise.resolve()
  if (cvLoading) return cvLoading

  cvLoading = new Promise<void>((resolve, reject) => {
    const existingCV = (window as any).cv
    if (existingCV?.Mat && typeof existingCV?.imread === 'function') {
      cvReady = true
      resolve()
      return
    }

    // 从 public 目录加载 opencv.js
    loadScript(openCvPath)
      .then(() => {
        cvReady = true
        console.log('[OpenCV] 加载并初始化成功')
        resolve()
      })
      .catch((err: Error) => {
        console.error('[OpenCV] 加载失败:', err)
        cvLoading = null
        reject(err)
      })
  })

  return cvLoading
}

/**
 * 获取 cv 实例（必须先调用 loadOpenCV）
 */
export function getCV(): any {
  if (typeof window !== 'undefined' && (window as any).cv) {
    return (window as any).cv
  }
  throw new Error($t('opencv-unload'))
}

/**
 * 检查 OpenCV 是否已就绪
 */
export function isCVReady(): boolean {
  return cvReady
}
