import { ipcMain, BrowserWindow, app } from "electron"
import path from "path"
import fs from "fs"
import { Worker } from "worker_threads"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getModelPath(): string {
  const localPath = path.join(app.getAppPath(), "models", "lama.onnx")
  if (fs.existsSync(localPath)) return localPath
  const rootPath = path.resolve(app.getAppPath(), "..", "..", "models", "lama.onnx")
  if (fs.existsSync(rootPath)) return rootPath
  const prodPath = path.join(process.resourcesPath, "models", "lama.onnx")
  if (fs.existsSync(prodPath)) return prodPath
  return rootPath
}

let worker: Worker | null = null
let pendingId = 0
const pendingMap = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>()

function getOrCreateWorker(): Worker {
  if (!worker) {
    const workerPath = path.join(__dirname, "ipc-inpaint-worker.js")
    const modelPath = getModelPath()
    console.log("[LaMa] Starting worker:", workerPath)
    worker = new Worker(workerPath, { workerData: { modelPath } })

    worker.on("message", (msg: { id: number; success: boolean; error?: string; patchBuffer?: ArrayBuffer; patchX?: number; patchY?: number; patchWidth?: number; patchHeight?: number }) => {
      const pending = pendingMap.get(msg.id)
      if (!pending) return
      pendingMap.delete(msg.id)
      if (msg.success) {
        pending.resolve({
          success: true,
          patchBuffer: msg.patchBuffer ? Buffer.from(msg.patchBuffer) : undefined,
          patchX: msg.patchX,
          patchY: msg.patchY,
          patchWidth: msg.patchWidth,
          patchHeight: msg.patchHeight,
        })
      } else {
        pending.reject(new Error(msg.error || "Unknown worker error"))
      }
    })

    worker.on("error", (err) => {
      console.error("[LaMa] Worker error:", err)
      for (const [, { reject }] of pendingMap) { reject(err) }
      pendingMap.clear()
      worker = null
    })
  }
  return worker
}

export function registerInpaintLaMaHandler(_: BrowserWindow) {
  ipcMain.handle("inpaint:lama", async (_event, payload: { imageBuffer: ArrayBuffer; maskBuffer: ArrayBuffer; options?: { upscale?: boolean } }) => {
    try {
      console.log("[LaMa] ===== Request received =====")
      const id = ++pendingId
      const result = await new Promise<any>((resolve, reject) => {
        pendingMap.set(id, { resolve, reject })
        const w = getOrCreateWorker()
        w.postMessage({ id, imageBuffer: payload.imageBuffer, maskBuffer: payload.maskBuffer })
      })
      console.log("[LaMa] ===== Done =====")
      return result
    } catch (err: any) {
      console.error("[LaMa] FAIL:", err)
      return { success: false, error: err.message }
    }
  })
}
