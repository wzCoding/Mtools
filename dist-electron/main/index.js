import { app, ipcMain, BrowserWindow, Tray, Menu } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import * as os from "os";
import { createRequire } from "module";
import fs from "fs";
import sharp from "sharp";
import * as ort from "onnxruntime-node";
const __filename$6 = fileURLToPath(import.meta.url);
const __dirname$6 = path.dirname(__filename$6);
const require$5 = createRequire(import.meta.url);
let binaryPath$4 = "";
const devPath$4 = path.join(process.cwd(), "native", "processesInfo", "build", "Release", "processesInfo.node");
const prodPath$4 = path.join(__dirname$6, "../../native/processesInfo/build/Release", "processesInfo.node");
if (fs.existsSync(devPath$4)) {
  binaryPath$4 = devPath$4;
} else {
  binaryPath$4 = prodPath$4;
  if (!fs.existsSync(binaryPath$4)) {
    if (process.resourcesPath) {
      binaryPath$4 = path.join(process.resourcesPath, "app.asar.unpacked", "native", "processesInfo", "build", "Release", "processesInfo.node");
    }
  }
}
if (!fs.existsSync(binaryPath$4)) {
  console.error("[Native Module Error] Could not find processesInfo.node");
  console.error("Searched Dev Path: " + devPath$4);
  console.error("Searched Prod Path: " + prodPath$4);
  throw new Error("Native module not found: processesInfo.node");
}
const nativeModule$4 = require$5(binaryPath$4);
const getProcesses = nativeModule$4.getProcesses;
const __filename$5 = fileURLToPath(import.meta.url);
const __dirname$5 = path.dirname(__filename$5);
const require$4 = createRequire(import.meta.url);
let binaryPath$3 = "";
const devPath$3 = path.join(process.cwd(), "native", "memoryInfo", "build", "Release", "memoryInfo.node");
const prodPath$3 = path.join(__dirname$5, "../../native/memoryInfo/build/Release", "memoryInfo.node");
if (fs.existsSync(devPath$3)) {
  binaryPath$3 = devPath$3;
} else {
  binaryPath$3 = prodPath$3;
  if (!fs.existsSync(binaryPath$3)) {
    if (process.resourcesPath) {
      binaryPath$3 = path.join(process.resourcesPath, "app.asar.unpacked", "native", "memoryInfo", "build", "Release", "memoryInfo.node");
    }
  }
}
if (!fs.existsSync(binaryPath$3)) {
  console.error("[Native Module Error] Could not find memoryInfo.node");
  console.error("Searched Dev Path: " + devPath$3);
  console.error("Searched Prod Path: " + prodPath$3);
  throw new Error("Native module not found: memoryInfo.node");
}
const nativeModule$3 = require$4(binaryPath$3);
const getProcessMemory = nativeModule$3.getProcessMemory;
const getSystemMemory = nativeModule$3.getSystemMemory;
const __filename$4 = fileURLToPath(import.meta.url);
const __dirname$4 = path.dirname(__filename$4);
const require$3 = createRequire(import.meta.url);
let binaryPath$2 = "";
const devPath$2 = path.join(process.cwd(), "native", "cpuInfo", "build", "Release", "cpuInfo.node");
const prodPath$2 = path.join(__dirname$4, "../../native/cpuInfo/build/Release", "cpuInfo.node");
if (fs.existsSync(devPath$2)) {
  binaryPath$2 = devPath$2;
} else {
  binaryPath$2 = prodPath$2;
  if (!fs.existsSync(binaryPath$2)) {
    if (process.resourcesPath) {
      binaryPath$2 = path.join(process.resourcesPath, "app.asar.unpacked", "native", "cpuInfo", "build", "Release", "cpuInfo.node");
    }
  }
}
if (!fs.existsSync(binaryPath$2)) {
  console.error("[Native Module Error] Could not find cpuInfo.node");
  console.error("Searched Dev Path: " + devPath$2);
  console.error("Searched Prod Path: " + prodPath$2);
  throw new Error("Native module not found: cpuInfo.node");
}
const nativeModule$2 = require$3(binaryPath$2);
const getProcessCpuTime = nativeModule$2.getProcessCpuTime;
const getSystemCpuTimes = nativeModule$2.getSystemCpuTimes;
const __filename$3 = fileURLToPath(import.meta.url);
const __dirname$3 = path.dirname(__filename$3);
const require$2 = createRequire(import.meta.url);
let binaryPath$1 = "";
const devPath$1 = path.join(process.cwd(), "native", "descriptionInfo", "build", "Release", "descriptionInfo.node");
const prodPath$1 = path.join(__dirname$3, "../../native/descriptionInfo/build/Release", "descriptionInfo.node");
if (fs.existsSync(devPath$1)) {
  binaryPath$1 = devPath$1;
} else {
  binaryPath$1 = prodPath$1;
  if (!fs.existsSync(binaryPath$1)) {
    if (process.resourcesPath) {
      binaryPath$1 = path.join(process.resourcesPath, "app.asar.unpacked", "native", "descriptionInfo", "build", "Release", "descriptionInfo.node");
    }
  }
}
if (!fs.existsSync(binaryPath$1)) {
  console.error("[Native Module Error] Could not find descriptionInfo.node");
  console.error("Searched Dev Path: " + devPath$1);
  console.error("Searched Prod Path: " + prodPath$1);
  throw new Error("Native module not found: descriptionInfo.node");
}
const nativeModule$1 = require$2(binaryPath$1);
const getFileDescription = nativeModule$1.getFileDescription;
const __filename$2 = fileURLToPath(import.meta.url);
const __dirname$2 = path.dirname(__filename$2);
const require$1 = createRequire(import.meta.url);
let binaryPath = "";
const devPath = path.join(process.cwd(), "native", "killProcess", "build", "Release", "killProcess.node");
const prodPath = path.join(__dirname$2, "../../native/killProcess/build/Release", "killProcess.node");
if (fs.existsSync(devPath)) {
  binaryPath = devPath;
} else {
  binaryPath = prodPath;
  if (!fs.existsSync(binaryPath)) {
    if (process.resourcesPath) {
      binaryPath = path.join(process.resourcesPath, "app.asar.unpacked", "native", "killProcess", "build", "Release", "killProcess.node");
    }
  }
}
if (!fs.existsSync(binaryPath)) {
  console.error("[Native Module Error] Could not find killProcess.node");
  console.error("Searched Dev Path: " + devPath);
  console.error("Searched Prod Path: " + prodPath);
  throw new Error("Native module not found: killProcess.node");
}
const nativeModule = require$1(binaryPath);
const killProcess = nativeModule.killProcess;
const defaultIconPath = path.join(app.getAppPath(), "public", "app.png");
const defaultIconData = fs.readFileSync(defaultIconPath).toString("base64");
const defaultIconUrl = `data:image/png;base64,${defaultIconData}`;
async function getAppIconByPath(appPath) {
  if (!appPath) {
    return defaultIconUrl;
  }
  try {
    const icon = await app.getFileIcon(appPath, { size: "normal" });
    const dataUrl = icon.toDataURL();
    return dataUrl;
  } catch (error) {
    console.error(`无法获取图标: ${appPath}`, error);
    return defaultIconUrl;
  }
}
function getModelPath() {
  const localPath = path.join(app.getAppPath(), "models", "lama.onnx");
  if (fs.existsSync(localPath)) return localPath;
  const rootPath = path.resolve(app.getAppPath(), "..", "..", "models", "lama.onnx");
  if (fs.existsSync(rootPath)) return rootPath;
  const prodPath2 = path.join(process.resourcesPath, "models", "lama.onnx");
  if (fs.existsSync(prodPath2)) return prodPath2;
  return rootPath;
}
let sessionCache = null;
async function getSession() {
  if (sessionCache) return sessionCache;
  const modelPath = getModelPath();
  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `LaMa 模型文件不存在: ${modelPath}
请从 HuggingFace 下载: https://huggingface.co/Carve/LaMa-ONNX下载后放置到: ${path.dirname(modelPath)}/`
    );
  }
  console.log("[LaMa] 加载模型:", modelPath);
  sessionCache = await ort.InferenceSession.create(modelPath, {
    executionProviders: ["cpu"],
    // Electron 主进程用 CPU
    graphOptimizationLevel: "all"
  });
  console.log("[LaMa] 模型加载完成");
  return sessionCache;
}
async function preprocessImage(imageBuffer) {
  const { data, info } = await sharp(imageBuffer).resize(512, 512, { fit: "fill", kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: originalWidth, height: originalHeight } = await sharp(imageBuffer).metadata();
  const tensor = new Float32Array(1 * 3 * 512 * 512);
  const pixels = data.length / 3;
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i * 3] / 255;
    tensor[pixels + i] = data[i * 3 + 1] / 255;
    tensor[2 * pixels + i] = data[i * 3 + 2] / 255;
  }
  return { tensor, originalWidth, originalHeight };
}
async function preprocessMask(maskBuffer) {
  const { data } = await sharp(maskBuffer).resize(512, 512, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const tensor = new Float32Array(1 * 1 * 512 * 512);
  for (let i = 0; i < 512 * 512; i++) {
    tensor[i] = data[i] > 128 ? 1 : 0;
  }
  return tensor;
}
async function postprocess(outputTensor, originalWidth, originalHeight, originalImageBuffer, maskBuffer) {
  const inpaintedPixels = new Uint8Array(512 * 512 * 3);
  const pixels = 512 * 512;
  for (let i = 0; i < pixels; i++) {
    inpaintedPixels[i * 3] = Math.round(Math.max(0, Math.min(1, outputTensor[i])) * 255);
    inpaintedPixels[i * 3 + 1] = Math.round(Math.max(0, Math.min(1, outputTensor[pixels + i])) * 255);
    inpaintedPixels[i * 3 + 2] = Math.round(Math.max(0, Math.min(1, outputTensor[2 * pixels + i])) * 255);
  }
  const inpainted512Buffer = await sharp(inpaintedPixels, {
    raw: { width: 512, height: 512, channels: 3 }
  }).png().toBuffer();
  const inpaintedFullBuffer = await sharp(inpainted512Buffer).resize(originalWidth, originalHeight, { fit: "fill", kernel: "lanczos3" }).png().toBuffer();
  await sharp(maskBuffer).resize(originalWidth, originalHeight, { fit: "fill" }).greyscale().png().toBuffer();
  return await sharp(originalImageBuffer).composite([
    {
      input: inpaintedFullBuffer,
      blend: "over"
    }
  ]).png().toBuffer();
}
function registerInpaintLaMaHandler(win) {
  ipcMain.handle("inpaint:lama", async (_event, payload) => {
    try {
      console.log("[LaMa] 开始处理...");
      const session = await getSession();
      const { tensor: imageTensor, originalWidth, originalHeight } = await preprocessImage(payload.imageBuffer);
      const maskTensor = await preprocessMask(payload.maskBuffer);
      const imageOrt = new ort.Tensor("float32", imageTensor, [1, 3, 512, 512]);
      const maskOrt = new ort.Tensor("float32", maskTensor, [1, 1, 512, 512]);
      console.log("[LaMa] 推理中...");
      const results = await session.run({ image: imageOrt, mask: maskOrt });
      const outputTensor = results.output.data;
      console.log("[LaMa] 推理完成");
      const resultBuffer = await postprocess(
        outputTensor,
        originalWidth,
        originalHeight,
        payload.imageBuffer,
        payload.maskBuffer
      );
      return { success: true, data: resultBuffer };
    } catch (err) {
      console.error("[LaMa] 处理失败:", err);
      return { success: false, error: err.message };
    }
  });
}
function handleIpcEvents(win) {
  ipcMain.on("window-minimize", () => {
    win.minimize();
  });
  ipcMain.on("window-maximize", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on("window-close", () => {
    win.close();
  });
  ipcMain.handle("get-processes", async () => {
    return await getProcesses();
  });
  ipcMain.handle("get-process-memory", (_, pid) => {
    return getProcessMemory(pid);
  });
  ipcMain.handle("get-system-memory", () => {
    return getSystemMemory();
  });
  ipcMain.handle("get-process-cpu-times", (_, pid) => {
    return getProcessCpuTime(pid);
  });
  ipcMain.handle("get-system-cpu-times", () => {
    return getSystemCpuTimes();
  });
  ipcMain.handle("get-file-description", (_, path2) => {
    return getFileDescription(path2);
  });
  ipcMain.handle("kill-process", (_, pid) => {
    return killProcess(pid);
  });
  ipcMain.handle("get-app-icon", (_, appPath) => {
    return getAppIconByPath(appPath);
  });
  ipcMain.handle("get-system-uptime", () => {
    return os.uptime();
  });
  registerInpaintLaMaHandler();
}
const isDev = process.env.NODE_ENV === "development";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
function createWindow() {
  if (BrowserWindow.getAllWindows().length > 0) {
    BrowserWindow.getAllWindows()[0].show();
    return;
  }
  const win = new BrowserWindow({
    width: 1e3,
    height: 600,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname$1, "../preload/index.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname$1, "../../dist/index.html"));
  }
  if (isDev) {
    win.webContents.openDevTools();
  }
  createTray();
  handleIpcEvents(win);
  console.log("Fetching process information using systeminformation...");
}
function createTray() {
  const tray = new Tray(path.join(__dirname$1, "../../public/electron.png"));
  const contextMenu = Menu.buildFromTemplate([
    { label: "显示主界面", click: createWindow },
    { label: "退出程序", click: () => {
      app.quit();
    } }
  ]);
  tray.setToolTip("Process View");
  tray.setContextMenu(contextMenu);
}
app.whenReady().then(() => {
  createWindow();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL25hdGl2ZS9wcm9jZXNzZXNJbmZvL2luZGV4LmpzIiwiLi4vLi4vbmF0aXZlL21lbW9yeUluZm8vaW5kZXguanMiLCIuLi8uLi9uYXRpdmUvY3B1SW5mby9pbmRleC5qcyIsIi4uLy4uL25hdGl2ZS9kZXNjcmlwdGlvbkluZm8vaW5kZXguanMiLCIuLi8uLi9uYXRpdmUva2lsbFByb2Nlc3MvaW5kZXguanMiLCIuLi8uLi9lbGVjdHJvbi91dGlscy9pbmRleC50cyIsIi4uLy4uL2VsZWN0cm9uL2lwYy9pcGMtaW5wYWludC1sYW1hLnRzIiwiLi4vLi4vZWxlY3Ryb24vaXBjL2luZGV4LnRzIiwiLi4vLi4vZWxlY3Ryb24vbWFpbi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBHZW5lcmF0ZWQgYnkgc2NyaXB0cy9nZW5lcmF0ZS1leHBvcnRzLmpzXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG4vLyAxLiDojrflj5blvZPliY3mlofku7bmiYDlnKjnmoTnm67lvZUgKG5hdGl2ZS9wcm9jZXNzZXNJbmZvKVxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuLy8gMi4g5Yib5bu6IHJlcXVpcmUg55So5LqO5Yqg6L29IC5ub2RlXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpO1xuXG4vLyAzLiDlrprkvY0gLm5vZGUg5paH5Lu2XG5sZXQgYmluYXJ5UGF0aCA9ICcnO1xuLy8g5byA5Y+R546v5aKD6Lev5b6EXG5jb25zdCBkZXZQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICduYXRpdmUnLCAncHJvY2Vzc2VzSW5mbycsICdidWlsZCcsICdSZWxlYXNlJywgJ3Byb2Nlc3Nlc0luZm8ubm9kZScpO1xuLy8g55Sf5Lqn546v5aKD6Lev5b6EXG5jb25zdCBwcm9kUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9uYXRpdmUvcHJvY2Vzc2VzSW5mby9idWlsZC9SZWxlYXNlJywgJ3Byb2Nlc3Nlc0luZm8ubm9kZScpO1xuXG5pZiAoZnMuZXhpc3RzU3luYyhkZXZQYXRoKSkge1xuICAgIGJpbmFyeVBhdGggPSBkZXZQYXRoO1xufSBlbHNlIHtcbiAgICBiaW5hcnlQYXRoID0gcHJvZFBhdGg7XG4gICAgXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgICAgIC8vIOWwneivleS7jiBFbGVjdHJvbiDotYTmupDnm67lvZXmn6Xmib5cbiAgICAgICAgaWYgKHByb2Nlc3MucmVzb3VyY2VzUGF0aCkge1xuICAgICAgICAgICAgIGJpbmFyeVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5yZXNvdXJjZXNQYXRoLCAnYXBwLmFzYXIudW5wYWNrZWQnLCAnbmF0aXZlJywgJ3Byb2Nlc3Nlc0luZm8nLCAnYnVpbGQnLCAnUmVsZWFzZScsICdwcm9jZXNzZXNJbmZvLm5vZGUnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgY29uc29sZS5lcnJvcignW05hdGl2ZSBNb2R1bGUgRXJyb3JdIENvdWxkIG5vdCBmaW5kICcgKyAncHJvY2Vzc2VzSW5mby5ub2RlJyk7XG4gICAgY29uc29sZS5lcnJvcignU2VhcmNoZWQgRGV2IFBhdGg6ICcgKyBkZXZQYXRoKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBQcm9kIFBhdGg6ICcgKyBwcm9kUGF0aCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOYXRpdmUgbW9kdWxlIG5vdCBmb3VuZDogJyArICdwcm9jZXNzZXNJbmZvLm5vZGUnKTtcbn1cblxuLy8gNC4g5Yqg6L295qih5Z2XXG5jb25zdCBuYXRpdmVNb2R1bGUgPSByZXF1aXJlKGJpbmFyeVBhdGgpO1xuXG4vLyA1LiDlr7zlh7pcbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZU1vZHVsZTtcblxuLy8g5aaC5p6c5L2g6ZyA6KaB6Kej5p6E5a+85YWlIChpbXBvcnQgeyB4eHggfSBmcm9tIC4uLinvvIzor7fkvp3otZYgaW5kZXguZC50cyDnmoTmj5DnpLpcbmV4cG9ydCBjb25zdCBnZXRQcm9jZXNzZXMgPSBuYXRpdmVNb2R1bGUuZ2V0UHJvY2Vzc2VzOyIsIi8vIEdlbmVyYXRlZCBieSBzY3JpcHRzL2dlbmVyYXRlLWV4cG9ydHMuanNcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbi8vIDEuIOiOt+WPluW9k+WJjeaWh+S7tuaJgOWcqOeahOebruW9lSAobmF0aXZlL21lbW9yeUluZm8pXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyAyLiDliJvlu7ogcmVxdWlyZSDnlKjkuo7liqDovb0gLm5vZGVcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5cbi8vIDMuIOWumuS9jSAubm9kZSDmlofku7ZcbmxldCBiaW5hcnlQYXRoID0gJyc7XG4vLyDlvIDlj5Hnjq/looPot6/lvoRcbmNvbnN0IGRldlBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25hdGl2ZScsICdtZW1vcnlJbmZvJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnbWVtb3J5SW5mby5ub2RlJyk7XG4vLyDnlJ/kuqfnjq/looPot6/lvoRcbmNvbnN0IHByb2RQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25hdGl2ZS9tZW1vcnlJbmZvL2J1aWxkL1JlbGVhc2UnLCAnbWVtb3J5SW5mby5ub2RlJyk7XG5cbmlmIChmcy5leGlzdHNTeW5jKGRldlBhdGgpKSB7XG4gICAgYmluYXJ5UGF0aCA9IGRldlBhdGg7XG59IGVsc2Uge1xuICAgIGJpbmFyeVBhdGggPSBwcm9kUGF0aDtcbiAgICBcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICAgICAgLy8g5bCd6K+V5LuOIEVsZWN0cm9uIOi1hOa6kOebruW9leafpeaJvlxuICAgICAgICBpZiAocHJvY2Vzcy5yZXNvdXJjZXNQYXRoKSB7XG4gICAgICAgICAgICAgYmluYXJ5UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhci51bnBhY2tlZCcsICduYXRpdmUnLCAnbWVtb3J5SW5mbycsICdidWlsZCcsICdSZWxlYXNlJywgJ21lbW9yeUluZm8ubm9kZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTmF0aXZlIE1vZHVsZSBFcnJvcl0gQ291bGQgbm90IGZpbmQgJyArICdtZW1vcnlJbmZvLm5vZGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBEZXYgUGF0aDogJyArIGRldlBhdGgpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaGVkIFByb2QgUGF0aDogJyArIHByb2RQYXRoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBtb2R1bGUgbm90IGZvdW5kOiAnICsgJ21lbW9yeUluZm8ubm9kZScpO1xufVxuXG4vLyA0LiDliqDovb3mqKHlnZdcbmNvbnN0IG5hdGl2ZU1vZHVsZSA9IHJlcXVpcmUoYmluYXJ5UGF0aCk7XG5cbi8vIDUuIOWvvOWHulxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlTW9kdWxlO1xuXG4vLyDlpoLmnpzkvaDpnIDopoHop6PmnoTlr7zlhaUgKGltcG9ydCB7IHh4eCB9IGZyb20gLi4uKe+8jOivt+S+nei1liBpbmRleC5kLnRzIOeahOaPkOekulxuZXhwb3J0IGNvbnN0IGdldFByb2Nlc3NNZW1vcnkgPSBuYXRpdmVNb2R1bGUuZ2V0UHJvY2Vzc01lbW9yeTtcbmV4cG9ydCBjb25zdCBnZXRTeXN0ZW1NZW1vcnkgPSBuYXRpdmVNb2R1bGUuZ2V0U3lzdGVtTWVtb3J5O1xuIiwiLy8gR2VuZXJhdGVkIGJ5IHNjcmlwdHMvZ2VuZXJhdGUtZXhwb3J0cy5qc1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuLy8gMS4g6I635Y+W5b2T5YmN5paH5Lu25omA5Zyo55qE55uu5b2VIChuYXRpdmUvY3B1SW5mbylcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbi8vIDIuIOWIm+W7uiByZXF1aXJlIOeUqOS6juWKoOi9vSAubm9kZVxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcblxuLy8gMy4g5a6a5L2NIC5ub2RlIOaWh+S7tlxubGV0IGJpbmFyeVBhdGggPSAnJztcbi8vIOW8gOWPkeeOr+Wig+i3r+W+hFxuY29uc3QgZGV2UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbmF0aXZlJywgJ2NwdUluZm8nLCAnYnVpbGQnLCAnUmVsZWFzZScsICdjcHVJbmZvLm5vZGUnKTtcbi8vIOeUn+S6p+eOr+Wig+i3r+W+hFxuY29uc3QgcHJvZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmF0aXZlL2NwdUluZm8vYnVpbGQvUmVsZWFzZScsICdjcHVJbmZvLm5vZGUnKTtcblxuaWYgKGZzLmV4aXN0c1N5bmMoZGV2UGF0aCkpIHtcbiAgICBiaW5hcnlQYXRoID0gZGV2UGF0aDtcbn0gZWxzZSB7XG4gICAgYmluYXJ5UGF0aCA9IHByb2RQYXRoO1xuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgICAgIC8vIOWwneivleS7jiBFbGVjdHJvbiDotYTmupDnm67lvZXmn6Xmib5cbiAgICAgICAgaWYgKHByb2Nlc3MucmVzb3VyY2VzUGF0aCkge1xuICAgICAgICAgICAgYmluYXJ5UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhci51bnBhY2tlZCcsICduYXRpdmUnLCAnY3B1SW5mbycsICdidWlsZCcsICdSZWxlYXNlJywgJ2NwdUluZm8ubm9kZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTmF0aXZlIE1vZHVsZSBFcnJvcl0gQ291bGQgbm90IGZpbmQgJyArICdjcHVJbmZvLm5vZGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBEZXYgUGF0aDogJyArIGRldlBhdGgpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaGVkIFByb2QgUGF0aDogJyArIHByb2RQYXRoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBtb2R1bGUgbm90IGZvdW5kOiAnICsgJ2NwdUluZm8ubm9kZScpO1xufVxuXG4vLyA0LiDliqDovb3mqKHlnZdcbmNvbnN0IG5hdGl2ZU1vZHVsZSA9IHJlcXVpcmUoYmluYXJ5UGF0aCk7XG5cbi8vIDUuIOWvvOWHulxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlTW9kdWxlO1xuXG4vLyDlpoLmnpzkvaDpnIDopoHop6PmnoTlr7zlhaUgKGltcG9ydCB7IHh4eCB9IGZyb20gLi4uKe+8jOivt+S+nei1liBpbmRleC5kLnRzIOeahOaPkOekulxuZXhwb3J0IGNvbnN0IGdldFByb2Nlc3NDcHVUaW1lID0gbmF0aXZlTW9kdWxlLmdldFByb2Nlc3NDcHVUaW1lO1xuZXhwb3J0IGNvbnN0IGdldFN5c3RlbUNwdVRpbWVzID0gbmF0aXZlTW9kdWxlLmdldFN5c3RlbUNwdVRpbWVzO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IHNjcmlwdHMvZ2VuZXJhdGUtZXhwb3J0cy5qc1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuLy8gMS4g6I635Y+W5b2T5YmN5paH5Lu25omA5Zyo55qE55uu5b2VIChuYXRpdmUvZGVzY3JpcHRpb25JbmZvKVxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuLy8gMi4g5Yib5bu6IHJlcXVpcmUg55So5LqO5Yqg6L29IC5ub2RlXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpO1xuXG4vLyAzLiDlrprkvY0gLm5vZGUg5paH5Lu2XG5sZXQgYmluYXJ5UGF0aCA9ICcnO1xuLy8g5byA5Y+R546v5aKD6Lev5b6EXG5jb25zdCBkZXZQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICduYXRpdmUnLCAnZGVzY3JpcHRpb25JbmZvJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnZGVzY3JpcHRpb25JbmZvLm5vZGUnKTtcbi8vIOeUn+S6p+eOr+Wig+i3r+W+hFxuY29uc3QgcHJvZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmF0aXZlL2Rlc2NyaXB0aW9uSW5mby9idWlsZC9SZWxlYXNlJywgJ2Rlc2NyaXB0aW9uSW5mby5ub2RlJyk7XG5cbmlmIChmcy5leGlzdHNTeW5jKGRldlBhdGgpKSB7XG4gICAgYmluYXJ5UGF0aCA9IGRldlBhdGg7XG59IGVsc2Uge1xuICAgIGJpbmFyeVBhdGggPSBwcm9kUGF0aDtcbiAgICBcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICAgICAgLy8g5bCd6K+V5LuOIEVsZWN0cm9uIOi1hOa6kOebruW9leafpeaJvlxuICAgICAgICBpZiAocHJvY2Vzcy5yZXNvdXJjZXNQYXRoKSB7XG4gICAgICAgICAgICAgYmluYXJ5UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhci51bnBhY2tlZCcsICduYXRpdmUnLCAnZGVzY3JpcHRpb25JbmZvJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnZGVzY3JpcHRpb25JbmZvLm5vZGUnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgY29uc29sZS5lcnJvcignW05hdGl2ZSBNb2R1bGUgRXJyb3JdIENvdWxkIG5vdCBmaW5kICcgKyAnZGVzY3JpcHRpb25JbmZvLm5vZGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBEZXYgUGF0aDogJyArIGRldlBhdGgpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaGVkIFByb2QgUGF0aDogJyArIHByb2RQYXRoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBtb2R1bGUgbm90IGZvdW5kOiAnICsgJ2Rlc2NyaXB0aW9uSW5mby5ub2RlJyk7XG59XG5cbi8vIDQuIOWKoOi9veaooeWdl1xuY29uc3QgbmF0aXZlTW9kdWxlID0gcmVxdWlyZShiaW5hcnlQYXRoKTtcblxuLy8gNS4g5a+85Ye6XG5leHBvcnQgZGVmYXVsdCBuYXRpdmVNb2R1bGU7XG5cbi8vIOWmguaenOS9oOmcgOimgeino+aehOWvvOWFpSAoaW1wb3J0IHsgeHh4IH0gZnJvbSAuLi4p77yM6K+35L6d6LWWIGluZGV4LmQudHMg55qE5o+Q56S6XG4vLyDmiJbogIXlnKjov5nph4zmiYvliqjmt7vliqDlr7zlh7rvvIzkvovlpoLvvJpcbmV4cG9ydCBjb25zdCBnZXRGaWxlRGVzY3JpcHRpb24gPSBuYXRpdmVNb2R1bGUuZ2V0RmlsZURlc2NyaXB0aW9uO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IHNjcmlwdHMvZ2VuZXJhdGUtZXhwb3J0cy5qc1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuLy8gMS4g6I635Y+W5b2T5YmN5paH5Lu25omA5Zyo55qE55uu5b2VIChuYXRpdmUva2lsbFByb2Nlc3MpXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyAyLiDliJvlu7ogcmVxdWlyZSDnlKjkuo7liqDovb0gLm5vZGVcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5cbi8vIDMuIOWumuS9jSAubm9kZSDmlofku7ZcbmxldCBiaW5hcnlQYXRoID0gJyc7XG4vLyDlvIDlj5Hnjq/looPot6/lvoRcbmNvbnN0IGRldlBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25hdGl2ZScsICdraWxsUHJvY2VzcycsICdidWlsZCcsICdSZWxlYXNlJywgJ2tpbGxQcm9jZXNzLm5vZGUnKTtcbi8vIOeUn+S6p+eOr+Wig+i3r+W+hFxuY29uc3QgcHJvZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmF0aXZlL2tpbGxQcm9jZXNzL2J1aWxkL1JlbGVhc2UnLCAna2lsbFByb2Nlc3Mubm9kZScpO1xuXG5pZiAoZnMuZXhpc3RzU3luYyhkZXZQYXRoKSkge1xuICAgIGJpbmFyeVBhdGggPSBkZXZQYXRoO1xufSBlbHNlIHtcbiAgICBiaW5hcnlQYXRoID0gcHJvZFBhdGg7XG4gICAgXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgICAgIC8vIOWwneivleS7jiBFbGVjdHJvbiDotYTmupDnm67lvZXmn6Xmib5cbiAgICAgICAgaWYgKHByb2Nlc3MucmVzb3VyY2VzUGF0aCkge1xuICAgICAgICAgICAgIGJpbmFyeVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5yZXNvdXJjZXNQYXRoLCAnYXBwLmFzYXIudW5wYWNrZWQnLCAnbmF0aXZlJywgJ2tpbGxQcm9jZXNzJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAna2lsbFByb2Nlc3Mubm9kZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTmF0aXZlIE1vZHVsZSBFcnJvcl0gQ291bGQgbm90IGZpbmQgJyArICdraWxsUHJvY2Vzcy5ub2RlJyk7XG4gICAgY29uc29sZS5lcnJvcignU2VhcmNoZWQgRGV2IFBhdGg6ICcgKyBkZXZQYXRoKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBQcm9kIFBhdGg6ICcgKyBwcm9kUGF0aCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOYXRpdmUgbW9kdWxlIG5vdCBmb3VuZDogJyArICdraWxsUHJvY2Vzcy5ub2RlJyk7XG59XG5cbi8vIDQuIOWKoOi9veaooeWdl1xuY29uc3QgbmF0aXZlTW9kdWxlID0gcmVxdWlyZShiaW5hcnlQYXRoKTtcblxuLy8gNS4g5a+85Ye6XG5leHBvcnQgZGVmYXVsdCBuYXRpdmVNb2R1bGU7XG5cbi8vIOWmguaenOS9oOmcgOimgeino+aehOWvvOWFpSAoaW1wb3J0IHsgeHh4IH0gZnJvbSAuLi4p77yM6K+35L6d6LWWIGluZGV4LmQudHMg55qE5o+Q56S6XG4vLyDmiJbogIXlnKjov5nph4zmiYvliqjmt7vliqDlr7zlh7rvvIzkvovlpoLvvJpcbmV4cG9ydCBjb25zdCBraWxsUHJvY2VzcyA9IG5hdGl2ZU1vZHVsZS5raWxsUHJvY2VzcztcbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBhcHAgfSBmcm9tICdlbGVjdHJvbic7XHJcblxyXG5jb25zdCBkZWZhdWx0SWNvblBhdGggPSBwYXRoLmpvaW4oYXBwLmdldEFwcFBhdGgoKSwgJ3B1YmxpYycsICdhcHAucG5nJyk7XHJcbmNvbnN0IGRlZmF1bHRJY29uRGF0YSA9IGZzLnJlYWRGaWxlU3luYyhkZWZhdWx0SWNvblBhdGgpLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuY29uc3QgZGVmYXVsdEljb25VcmwgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7ZGVmYXVsdEljb25EYXRhfWA7XHJcbmFzeW5jIGZ1bmN0aW9uIGdldEFwcEljb25CeVBhdGgoYXBwUGF0aDogc3RyaW5nKSB7XHJcblxyXG4gICAgaWYgKCFhcHBQYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRJY29uVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaWNvbiA9IGF3YWl0IGFwcC5nZXRGaWxlSWNvbihhcHBQYXRoLCB7IHNpemU6ICdub3JtYWwnIH0pO1xyXG4gICAgICAgIGNvbnN0IGRhdGFVcmwgPSBpY29uLnRvRGF0YVVSTCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YVVybDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihg5peg5rOV6I635Y+W5Zu+5qCHOiAke2FwcFBhdGh9YCwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBkZWZhdWx0SWNvblVybDsgLy8g6I635Y+W5aSx6LSl6L+U5Zue6buY6K6k5Zu+5qCHXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBnZXRBcHBJY29uQnlQYXRoXHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiDpq5jotKjph4/ljrvmsLTljbAg4oCU4oCUIOS4u+i/m+eoiyBJUEMgSGFuZGxlclxyXG4gKiDmlrnmoYjvvJpTaGFycCAo6aKE5aSE55CGKSDihpIgT05OWCBSdW50aW1lIOKGkiBMYU1hIOaooeWeiyAoQUkg5L+u5aSNKVxyXG4gKlxyXG4gKiDmqKHlnovkuIvovb3vvJpcclxuICogICDku44gSHVnZ2luZ0ZhY2Ug5LiL6L29IExhTWEgT05OWCDmqKHlnovvvIzmlL7liLDpobnnm67moLnnm67lvZUgbW9kZWxzLyDkuItcclxuICogICDmjqjojZDmqKHlnos6IGh0dHBzOi8vaHVnZ2luZ2ZhY2UuY28vYm9vbWIwb20vTGFNYS1pbnBhaW50aW5nLW9ubnhcclxuICogICDkuIvovb3mlofku7Y6IGxhbWFfZnAzMi5vbm54IOaIliBsYW1hLm9ubnhcclxuICogICDmlL7nva7ot6/lvoQ6IDzpobnnm67moLnnm67lvZU+L21vZGVscy9sYW1hLm9ubnhcclxuICovXHJcblxyXG5pbXBvcnQgeyBpcGNNYWluLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nXHJcbmltcG9ydCBzaGFycCBmcm9tICdzaGFycCdcclxuaW1wb3J0ICogYXMgb3J0IGZyb20gJ29ubnhydW50aW1lLW5vZGUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IHsgYXBwIH0gZnJvbSAnZWxlY3Ryb24nXHJcblxyXG4vLyDilIDilIDilIAg5qih5Z6L6Lev5b6EIOKUgOKUgOKUgFxyXG5mdW5jdGlvbiBnZXRNb2RlbFBhdGgoKTogc3RyaW5nIHtcclxuICAvLyAxLiDkuI7kuLvov5vnqIvlkIznm67lvZXvvIhkZXYg5pe2ID0g6aG555uu5qC555uu5b2V77yJXHJcbiAgY29uc3QgbG9jYWxQYXRoID0gcGF0aC5qb2luKGFwcC5nZXRBcHBQYXRoKCksICdtb2RlbHMnLCAnbGFtYS5vbm54JylcclxuICBpZiAoZnMuZXhpc3RzU3luYyhsb2NhbFBhdGgpKSByZXR1cm4gbG9jYWxQYXRoXHJcblxyXG4gIC8vIDIuIOmhueebruagueebruW9le+8iGRpc3QtZWxlY3Ryb24vbWFpbi8g55qE56WW54i255uu5b2V77yM6YG/5YWN5q+P5qyh5p6E5bu65aSN5Yi2IDIwME1C77yJXHJcbiAgY29uc3Qgcm9vdFBhdGggPSBwYXRoLnJlc29sdmUoYXBwLmdldEFwcFBhdGgoKSwgJy4uJywgJy4uJywgJ21vZGVscycsICdsYW1hLm9ubngnKVxyXG4gIGlmIChmcy5leGlzdHNTeW5jKHJvb3RQYXRoKSkgcmV0dXJuIHJvb3RQYXRoXHJcblxyXG4gIC8vIDMuIOeUn+S6p+eOr+WigyBleHRyYVJlc291cmNlc1xyXG4gIGNvbnN0IHByb2RQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MucmVzb3VyY2VzUGF0aCwgJ21vZGVscycsICdsYW1hLm9ubngnKVxyXG4gIGlmIChmcy5leGlzdHNTeW5jKHByb2RQYXRoKSkgcmV0dXJuIHByb2RQYXRoXHJcblxyXG4gIHJldHVybiByb290UGF0aCAvLyDpu5jorqTov5Tlm57pobnnm67moLnot6/lvoTvvIzorqkgT05OWCDmiqXmuIXmmbDnmoTplJnor69cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIOaooeWei+e8k+WtmCDilIDilIDilIBcclxubGV0IHNlc3Npb25DYWNoZTogb3J0LkluZmVyZW5jZVNlc3Npb24gfCBudWxsID0gbnVsbFxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbigpOiBQcm9taXNlPG9ydC5JbmZlcmVuY2VTZXNzaW9uPiB7XHJcbiAgaWYgKHNlc3Npb25DYWNoZSkgcmV0dXJuIHNlc3Npb25DYWNoZVxyXG5cclxuICBjb25zdCBtb2RlbFBhdGggPSBnZXRNb2RlbFBhdGgoKVxyXG4gIGlmICghZnMuZXhpc3RzU3luYyhtb2RlbFBhdGgpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgIGBMYU1hIOaooeWei+aWh+S7tuS4jeWtmOWcqDogJHttb2RlbFBhdGh9XFxuYCArXHJcbiAgICAgIGDor7fku44gSHVnZ2luZ0ZhY2Ug5LiL6L29OiBodHRwczovL2h1Z2dpbmdmYWNlLmNvL0NhcnZlL0xhTWEtT05OWGAgK1xyXG4gICAgICBg5LiL6L295ZCO5pS+572u5YiwOiAke3BhdGguZGlybmFtZShtb2RlbFBhdGgpfS9gXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBjb25zb2xlLmxvZygnW0xhTWFdIOWKoOi9veaooeWeizonLCBtb2RlbFBhdGgpXHJcbiAgc2Vzc2lvbkNhY2hlID0gYXdhaXQgb3J0LkluZmVyZW5jZVNlc3Npb24uY3JlYXRlKG1vZGVsUGF0aCwge1xyXG4gICAgZXhlY3V0aW9uUHJvdmlkZXJzOiBbJ2NwdSddLCAvLyBFbGVjdHJvbiDkuLvov5vnqIvnlKggQ1BVXHJcbiAgICBncmFwaE9wdGltaXphdGlvbkxldmVsOiAnYWxsJyxcclxuICB9KVxyXG4gIGNvbnNvbGUubG9nKCdbTGFNYV0g5qih5Z6L5Yqg6L295a6M5oiQJylcclxuICByZXR1cm4gc2Vzc2lvbkNhY2hlXHJcbn1cclxuXHJcbi8vIOKUgOKUgOKUgCDpooTlpITnkIbvvJrlm77niYcg4oaSIDUxMsOXNTEyIOagh+WHhuWMliB0ZW5zb3Ig4pSA4pSA4pSAXHJcbmFzeW5jIGZ1bmN0aW9uIHByZXByb2Nlc3NJbWFnZShpbWFnZUJ1ZmZlcjogQnVmZmVyKTogUHJvbWlzZTx7XHJcbiAgdGVuc29yOiBGbG9hdDMyQXJyYXlcclxuICBvcmlnaW5hbFdpZHRoOiBudW1iZXJcclxuICBvcmlnaW5hbEhlaWdodDogbnVtYmVyXHJcbn0+IHtcclxuICBjb25zdCB7IGRhdGEsIGluZm8gfSA9IGF3YWl0IHNoYXJwKGltYWdlQnVmZmVyKVxyXG4gICAgLnJlc2l6ZSg1MTIsIDUxMiwgeyBmaXQ6ICdmaWxsJywga2VybmVsOiAnbGFuY3pvczMnIH0pXHJcbiAgICAucmVtb3ZlQWxwaGEoKVxyXG4gICAgLnJhdygpXHJcbiAgICAudG9CdWZmZXIoeyByZXNvbHZlV2l0aE9iamVjdDogdHJ1ZSB9KVxyXG5cclxuICBjb25zdCB7IHdpZHRoOiBvcmlnaW5hbFdpZHRoLCBoZWlnaHQ6IG9yaWdpbmFsSGVpZ2h0IH0gPSBhd2FpdCBzaGFycChpbWFnZUJ1ZmZlcikubWV0YWRhdGEoKVxyXG5cclxuICAvLyBSR0Ig4oaSIE5DSFcg4oaSIEZsb2F0MzIg5b2S5LiA5YyWIFswLCAxXVxyXG4gIGNvbnN0IHRlbnNvciA9IG5ldyBGbG9hdDMyQXJyYXkoMSAqIDMgKiA1MTIgKiA1MTIpXHJcbiAgY29uc3QgcGl4ZWxzID0gZGF0YS5sZW5ndGggLyAzXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaXhlbHM7IGkrKykge1xyXG4gICAgdGVuc29yW2ldID0gZGF0YVtpICogM10gLyAyNTUuMCAgICAgICAgICAgLy8gUlxyXG4gICAgdGVuc29yW3BpeGVscyArIGldID0gZGF0YVtpICogMyArIDFdIC8gMjU1LjAgLy8gR1xyXG4gICAgdGVuc29yWzIgKiBwaXhlbHMgKyBpXSA9IGRhdGFbaSAqIDMgKyAyXSAvIDI1NS4wIC8vIEJcclxuICB9XHJcblxyXG4gIHJldHVybiB7IHRlbnNvciwgb3JpZ2luYWxXaWR0aDogb3JpZ2luYWxXaWR0aCEsIG9yaWdpbmFsSGVpZ2h0OiBvcmlnaW5hbEhlaWdodCEgfVxyXG59XHJcblxyXG4vLyDilIDilIDilIAg6aKE5aSE55CG77yabWFzayDihpIgNTEyw5c1MTIg5Y2V6YCa6YGTIHRlbnNvciDilIDilIDilIBcclxuYXN5bmMgZnVuY3Rpb24gcHJlcHJvY2Vzc01hc2sobWFza0J1ZmZlcjogQnVmZmVyKTogUHJvbWlzZTxGbG9hdDMyQXJyYXk+IHtcclxuICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHNoYXJwKG1hc2tCdWZmZXIpXHJcbiAgICAucmVzaXplKDUxMiwgNTEyLCB7IGZpdDogJ2ZpbGwnIH0pXHJcbiAgICAuZ3JleXNjYWxlKClcclxuICAgIC5yYXcoKVxyXG4gICAgLnRvQnVmZmVyKHsgcmVzb2x2ZVdpdGhPYmplY3Q6IHRydWUgfSlcclxuXHJcbiAgLy8gSFdDIGdyYXlzY2FsZSDihpIgTkNIVyDihpIgRmxvYXQzMiDlvZLkuIDljJYgWzAsIDFd77yMPjEyOCDop4bkuLogbWFzayDljLrln59cclxuICBjb25zdCB0ZW5zb3IgPSBuZXcgRmxvYXQzMkFycmF5KDEgKiAxICogNTEyICogNTEyKVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTEyICogNTEyOyBpKyspIHtcclxuICAgIHRlbnNvcltpXSA9IGRhdGFbaV0gPiAxMjggPyAxLjAgOiAwLjBcclxuICB9XHJcblxyXG4gIHJldHVybiB0ZW5zb3JcclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIOWQjuWkhOeQhu+8mnRlbnNvciDihpIg57yp5pS+5Zue5Y6f5aeL5bC65a+4IOKGkiDkuI7ljp/lm77lkIjmiJAg4pSA4pSA4pSAXHJcbmFzeW5jIGZ1bmN0aW9uIHBvc3Rwcm9jZXNzKFxyXG4gIG91dHB1dFRlbnNvcjogRmxvYXQzMkFycmF5LFxyXG4gIG9yaWdpbmFsV2lkdGg6IG51bWJlcixcclxuICBvcmlnaW5hbEhlaWdodDogbnVtYmVyLFxyXG4gIG9yaWdpbmFsSW1hZ2VCdWZmZXI6IEJ1ZmZlcixcclxuICBtYXNrQnVmZmVyOiBCdWZmZXJcclxuKTogUHJvbWlzZTxCdWZmZXI+IHtcclxuICAvLyAxLiB0ZW5zb3Ig4oaSIDUxMsOXNTEyIFJHQkEgUE5HIGJ1ZmZlclxyXG4gIGNvbnN0IGlucGFpbnRlZFBpeGVscyA9IG5ldyBVaW50OEFycmF5KDUxMiAqIDUxMiAqIDMpXHJcbiAgY29uc3QgcGl4ZWxzID0gNTEyICogNTEyXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaXhlbHM7IGkrKykge1xyXG4gICAgaW5wYWludGVkUGl4ZWxzW2kgKiAzXSA9IE1hdGgucm91bmQoTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgb3V0cHV0VGVuc29yW2ldKSkgKiAyNTUpXHJcbiAgICBpbnBhaW50ZWRQaXhlbHNbaSAqIDMgKyAxXSA9IE1hdGgucm91bmQoTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgb3V0cHV0VGVuc29yW3BpeGVscyArIGldKSkgKiAyNTUpXHJcbiAgICBpbnBhaW50ZWRQaXhlbHNbaSAqIDMgKyAyXSA9IE1hdGgucm91bmQoTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgb3V0cHV0VGVuc29yWzIgKiBwaXhlbHMgKyBpXSkpICogMjU1KVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaW5wYWludGVkNTEyQnVmZmVyID0gYXdhaXQgc2hhcnAoaW5wYWludGVkUGl4ZWxzLCB7XHJcbiAgICByYXc6IHsgd2lkdGg6IDUxMiwgaGVpZ2h0OiA1MTIsIGNoYW5uZWxzOiAzIH0sXHJcbiAgfSlcclxuICAgIC5wbmcoKVxyXG4gICAgLnRvQnVmZmVyKClcclxuXHJcbiAgLy8gMi4g57yp5pS+5Zue5Y6f5aeL5bC65a+4XHJcbiAgY29uc3QgaW5wYWludGVkRnVsbEJ1ZmZlciA9IGF3YWl0IHNoYXJwKGlucGFpbnRlZDUxMkJ1ZmZlcilcclxuICAgIC5yZXNpemUob3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQsIHsgZml0OiAnZmlsbCcsIGtlcm5lbDogJ2xhbmN6b3MzJyB9KVxyXG4gICAgLnBuZygpXHJcbiAgICAudG9CdWZmZXIoKVxyXG5cclxuICAvLyAzLiDnlKggbWFzayDlkIjmiJDvvJptYXNrIOWMuuWfn+eUqOS/ruWkjee7k+aenO+8jOWFtuS9meS/neeVmeWOn+WbvlxyXG4gIGNvbnN0IG1hc2tGdWxsQnVmZmVyID0gYXdhaXQgc2hhcnAobWFza0J1ZmZlcilcclxuICAgIC5yZXNpemUob3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQsIHsgZml0OiAnZmlsbCcgfSlcclxuICAgIC5ncmV5c2NhbGUoKVxyXG4gICAgLnBuZygpXHJcbiAgICAudG9CdWZmZXIoKVxyXG5cclxuICByZXR1cm4gYXdhaXQgc2hhcnAob3JpZ2luYWxJbWFnZUJ1ZmZlcilcclxuICAgIC5jb21wb3NpdGUoW1xyXG4gICAgICB7XHJcbiAgICAgICAgaW5wdXQ6IGlucGFpbnRlZEZ1bGxCdWZmZXIsXHJcbiAgICAgICAgYmxlbmQ6ICdvdmVyJyxcclxuICAgICAgfSxcclxuICAgIF0pXHJcbiAgICAucG5nKClcclxuICAgIC50b0J1ZmZlcigpXHJcbn1cclxuXHJcbi8vIOKUgOKUgOKUgCDms6jlhowgSVBDIEhhbmRsZXIg4pSA4pSA4pSAXHJcbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcklucGFpbnRMYU1hSGFuZGxlcih3aW46IEJyb3dzZXJXaW5kb3cpIHtcclxuICBpcGNNYWluLmhhbmRsZSgnaW5wYWludDpsYW1hJywgYXN5bmMgKF9ldmVudCwgcGF5bG9hZDoge1xyXG4gICAgaW1hZ2VCdWZmZXI6IEJ1ZmZlclxyXG4gICAgbWFza0J1ZmZlcjogQnVmZmVyXHJcbiAgICBvcHRpb25zPzogeyB1cHNjYWxlPzogYm9vbGVhbiB9XHJcbiAgfSkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc29sZS5sb2coJ1tMYU1hXSDlvIDlp4vlpITnkIYuLi4nKVxyXG4gICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpXHJcblxyXG4gICAgICAvLyDpooTlpITnkIZcclxuICAgICAgY29uc3QgeyB0ZW5zb3I6IGltYWdlVGVuc29yLCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCB9ID0gYXdhaXQgcHJlcHJvY2Vzc0ltYWdlKHBheWxvYWQuaW1hZ2VCdWZmZXIpXHJcbiAgICAgIGNvbnN0IG1hc2tUZW5zb3IgPSBhd2FpdCBwcmVwcm9jZXNzTWFzayhwYXlsb2FkLm1hc2tCdWZmZXIpXHJcblxyXG4gICAgICAvLyBPTk5YIOaOqOeQhlxyXG4gICAgICBjb25zdCBpbWFnZU9ydCA9IG5ldyBvcnQuVGVuc29yKCdmbG9hdDMyJywgaW1hZ2VUZW5zb3IsIFsxLCAzLCA1MTIsIDUxMl0pXHJcbiAgICAgIGNvbnN0IG1hc2tPcnQgPSBuZXcgb3J0LlRlbnNvcignZmxvYXQzMicsIG1hc2tUZW5zb3IsIFsxLCAxLCA1MTIsIDUxMl0pXHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnW0xhTWFdIOaOqOeQhuS4rS4uLicpXHJcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBzZXNzaW9uLnJ1bih7IGltYWdlOiBpbWFnZU9ydCwgbWFzazogbWFza09ydCB9KVxyXG4gICAgICBjb25zdCBvdXRwdXRUZW5zb3IgPSByZXN1bHRzLm91dHB1dC5kYXRhIGFzIEZsb2F0MzJBcnJheVxyXG4gICAgICBjb25zb2xlLmxvZygnW0xhTWFdIOaOqOeQhuWujOaIkCcpXHJcblxyXG4gICAgICAvLyDlkI7lpITnkIZcclxuICAgICAgY29uc3QgcmVzdWx0QnVmZmVyID0gYXdhaXQgcG9zdHByb2Nlc3MoXHJcbiAgICAgICAgb3V0cHV0VGVuc29yLFxyXG4gICAgICAgIG9yaWdpbmFsV2lkdGgsXHJcbiAgICAgICAgb3JpZ2luYWxIZWlnaHQsXHJcbiAgICAgICAgcGF5bG9hZC5pbWFnZUJ1ZmZlcixcclxuICAgICAgICBwYXlsb2FkLm1hc2tCdWZmZXJcclxuICAgICAgKVxyXG5cclxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0QnVmZmVyIH1cclxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYU1hXSDlpITnkIblpLHotKU6JywgZXJyKVxyXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVyci5tZXNzYWdlIH1cclxuICAgIH1cclxuICB9KVxyXG59XHJcbiIsImltcG9ydCB7IGlwY01haW4sIEJyb3dzZXJXaW5kb3cgfSBmcm9tIFwiZWxlY3Ryb25cIjtcclxuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xyXG5pbXBvcnQgeyBnZXRQcm9jZXNzZXMgfSBmcm9tICdAbmF0aXZlL3Byb2Nlc3Nlc0luZm8nO1xyXG5pbXBvcnQgeyBnZXRQcm9jZXNzTWVtb3J5LCBnZXRTeXN0ZW1NZW1vcnkgfSBmcm9tIFwiQG5hdGl2ZS9tZW1vcnlJbmZvXCI7XHJcbmltcG9ydCB7IGdldFByb2Nlc3NDcHVUaW1lLCBnZXRTeXN0ZW1DcHVUaW1lcyB9IGZyb20gXCJAbmF0aXZlL2NwdUluZm9cIjtcclxuaW1wb3J0IHsgZ2V0RmlsZURlc2NyaXB0aW9uIH0gZnJvbSBcIkBuYXRpdmUvZGVzY3JpcHRpb25JbmZvXCJcclxuaW1wb3J0IHsga2lsbFByb2Nlc3MgfSBmcm9tIFwiQG5hdGl2ZS9raWxsUHJvY2Vzc1wiO1xyXG5pbXBvcnQgeyBnZXRBcHBJY29uQnlQYXRoIH0gZnJvbSBcIi4uL3V0aWxzL2luZGV4XCI7XHJcbmltcG9ydCB7IHJlZ2lzdGVySW5wYWludExhTWFIYW5kbGVyIH0gZnJvbSBcIi4vaXBjLWlucGFpbnQtbGFtYVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFuZGxlSXBjRXZlbnRzKHdpbjogQnJvd3NlcldpbmRvdykge1xyXG4gICAgLy8g56qX5Y+j5o6n5Yi2XHJcbiAgICBpcGNNYWluLm9uKCd3aW5kb3ctbWluaW1pemUnLCAoKSA9PiB7XHJcbiAgICAgICAgd2luLm1pbmltaXplKClcclxuICAgIH0pO1xyXG5cclxuICAgIGlwY01haW4ub24oJ3dpbmRvdy1tYXhpbWl6ZScsICgpID0+IHtcclxuICAgICAgICBpZiAod2luLmlzTWF4aW1pemVkKCkpIHtcclxuICAgICAgICAgICAgd2luLnVubWF4aW1pemUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW4ubWF4aW1pemUoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLm9uKCd3aW5kb3ctY2xvc2UnLCAoKSA9PiB7XHJcbiAgICAgICAgd2luLmNsb3NlKClcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOKUgOKUgOKUgCDns7vnu5/kv6Hmga8g4pSA4pSA4pSAXHJcbiAgICBpcGNNYWluLmhhbmRsZSgnZ2V0LXByb2Nlc3NlcycsIGFzeW5jICgpID0+IHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgZ2V0UHJvY2Vzc2VzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLmhhbmRsZSgnZ2V0LXByb2Nlc3MtbWVtb3J5JywgKF8sIHBpZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldFByb2Nlc3NNZW1vcnkocGlkKTtcclxuICAgIH0pXHJcblxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1zeXN0ZW0tbWVtb3J5JywgKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRTeXN0ZW1NZW1vcnkoKVxyXG4gICAgfSk7XHJcblxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1wcm9jZXNzLWNwdS10aW1lcycsIChfLCBwaWQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRQcm9jZXNzQ3B1VGltZShwaWQpO1xyXG4gICAgfSlcclxuXHJcbiAgICBpcGNNYWluLmhhbmRsZSgnZ2V0LXN5c3RlbS1jcHUtdGltZXMnLCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldFN5c3RlbUNwdVRpbWVzKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLmhhbmRsZSgnZ2V0LWZpbGUtZGVzY3JpcHRpb24nLCAoXywgcGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldEZpbGVEZXNjcmlwdGlvbihwYXRoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlwY01haW4uaGFuZGxlKCdraWxsLXByb2Nlc3MnLCAoXywgcGlkOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4ga2lsbFByb2Nlc3MocGlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlwY01haW4uaGFuZGxlKCdnZXQtYXBwLWljb24nLCAoXywgYXBwUGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGdldEFwcEljb25CeVBhdGgoYXBwUGF0aCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLmhhbmRsZSgnZ2V0LXN5c3RlbS11cHRpbWUnLCAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG9zLnVwdGltZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g4pSA4pSA4pSAIExhTWEgQUkg5Y675rC05Y2wIOKUgOKUgOKUgFxyXG4gICAgcmVnaXN0ZXJJbnBhaW50TGFNYUhhbmRsZXIod2luKTtcclxufVxyXG4iLCJpbXBvcnQgeyBhcHAsIEJyb3dzZXJXaW5kb3csIFRyYXksIE1lbnUgfSBmcm9tICdlbGVjdHJvbidcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuaW1wb3J0IGhhbmRsZUlwY0V2ZW50cyBmcm9tICcuLi9pcGMvaW5kZXguanMnXHJcblxyXG5jb25zdCBpc0RldiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXHJcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybClcclxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpXHJcbmNvbnN0IFZJVEVfREVWX1NFUlZFUl9VUkwgPSBwcm9jZXNzLmVudi5WSVRFX0RFVl9TRVJWRVJfVVJMXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XHJcbiAgICBpZiAoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpWzBdLnNob3coKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCB3aW4gPSBuZXcgQnJvd3NlcldpbmRvdyh7XHJcbiAgICAgICAgd2lkdGg6IDEwMDAsXHJcbiAgICAgICAgaGVpZ2h0OiA2MDAsXHJcbiAgICAgICAgZnJhbWU6IGZhbHNlLFxyXG4gICAgICAgIHRpdGxlQmFyU3R5bGU6ICdoaWRkZW4nLFxyXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgICAgICAgIHByZWxvYWQ6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9wcmVsb2FkL2luZGV4LmpzJyksXHJcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIGlmIChWSVRFX0RFVl9TRVJWRVJfVVJMKSB7XHJcbiAgICAgICAgd2luLmxvYWRVUkwoVklURV9ERVZfU0VSVkVSX1VSTCEpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdpbi5sb2FkRmlsZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vZGlzdC9pbmRleC5odG1sJykpXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzRGV2KSB7XHJcbiAgICAgICAgd2luLndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpXHJcbiAgICB9XHJcbiAgICBjcmVhdGVUcmF5KClcclxuICAgIGhhbmRsZUlwY0V2ZW50cyh3aW4pXHJcblxyXG4gICAgY29uc29sZS5sb2coJ0ZldGNoaW5nIHByb2Nlc3MgaW5mb3JtYXRpb24gdXNpbmcgc3lzdGVtaW5mb3JtYXRpb24uLi4nKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVRyYXkoKSB7XHJcbiAgICBjb25zdCB0cmF5ID0gbmV3IFRyYXkocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL3B1YmxpYy9lbGVjdHJvbi5wbmcnKSlcclxuICAgIGNvbnN0IGNvbnRleHRNZW51ID0gTWVudS5idWlsZEZyb21UZW1wbGF0ZShbXHJcbiAgICAgICAgeyBsYWJlbDogJ+aYvuekuuS4u+eVjOmdoicsIGNsaWNrOiBjcmVhdGVXaW5kb3cgfSxcclxuICAgICAgICB7IGxhYmVsOiAn6YCA5Ye656iL5bqPJywgY2xpY2s6ICgpID0+IHsgYXBwLnF1aXQoKSB9IH1cclxuICAgIF0pXHJcbiAgICB0cmF5LnNldFRvb2xUaXAoJ1Byb2Nlc3MgVmlldycpXHJcbiAgICB0cmF5LnNldENvbnRleHRNZW51KGNvbnRleHRNZW51KVxyXG59XHJcblxyXG5hcHAud2hlblJlYWR5KCkudGhlbigoKSA9PiB7XHJcbiAgICBjcmVhdGVXaW5kb3coKVxyXG59KVxyXG5cclxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcclxuICAgIGlmIChCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBjcmVhdGVXaW5kb3coKVxyXG4gICAgfVxyXG59KVxyXG5cclxuXHJcbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XHJcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcclxuICAgICAgICBhcHAucXVpdCgpXHJcbiAgICB9XHJcbn0pIl0sIm5hbWVzIjpbIl9fZmlsZW5hbWUiLCJfX2Rpcm5hbWUiLCJyZXF1aXJlIiwiYmluYXJ5UGF0aCIsImRldlBhdGgiLCJwcm9kUGF0aCIsIm5hdGl2ZU1vZHVsZSIsInBhdGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBT0EsTUFBTUEsZUFBYSxjQUFjLFlBQVksR0FBRztBQUNoRCxNQUFNQyxjQUFZLEtBQUssUUFBUUQsWUFBVTtBQUd6QyxNQUFNRSxZQUFVLGNBQWMsWUFBWSxHQUFHO0FBRzdDLElBQUlDLGVBQWE7QUFFakIsTUFBTUMsWUFBVSxLQUFLLEtBQUssUUFBUSxJQUFHLEdBQUksVUFBVSxpQkFBaUIsU0FBUyxXQUFXLG9CQUFvQjtBQUU1RyxNQUFNQyxhQUFXLEtBQUssS0FBS0osYUFBVyw0Q0FBNEMsb0JBQW9CO0FBRXRHLElBQUksR0FBRyxXQUFXRyxTQUFPLEdBQUc7QUFDeEJELGlCQUFhQztBQUNqQixPQUFPO0FBQ0hELGlCQUFhRTtBQUViLE1BQUksQ0FBQyxHQUFHLFdBQVdGLFlBQVUsR0FBRztBQUU1QixRQUFJLFFBQVEsZUFBZTtBQUN0QkEscUJBQWEsS0FBSyxLQUFLLFFBQVEsZUFBZSxxQkFBcUIsVUFBVSxpQkFBaUIsU0FB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
