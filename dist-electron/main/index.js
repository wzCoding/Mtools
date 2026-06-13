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
      `[LaMa] Model not found: ${modelPath}
Download from: https://huggingface.co/Carve/LaMa-ONNX
Place in: ${path.dirname(modelPath)}/`
    );
  }
  console.log("[LaMa] Loading model:", modelPath);
  sessionCache = await ort.InferenceSession.create(modelPath, {
    executionProviders: ["cpu"],
    // Electron 主进程用 CPU
    graphOptimizationLevel: "all"
  });
  console.log("[LaMa] Model loaded");
  return sessionCache;
}
function tensorStats(label, t, channels) {
  const perCh = t.length / channels;
  for (let c = 0; c < channels; c++) {
    let min = Infinity, max = -Infinity, sum = 0;
    for (let i = 0; i < perCh; i++) {
      const v = t[c * perCh + i];
      if (v < min) min = v;
      if (v > max) max = v;
      sum += v;
    }
    console.log(`[LaMa] ${label} ch${c}: min=${min.toFixed(4)} max=${max.toFixed(4)} mean=${(sum / perCh).toFixed(4)}`);
  }
}
async function preprocessImage(imageBuffer) {
  const { data } = await sharp(imageBuffer).resize(512, 512, { fit: "fill", kernel: "lanczos3" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: originalWidth, height: originalHeight } = await sharp(imageBuffer).metadata();
  const pixels = 512 * 512;
  const tensor = new Float32Array(1 * 3 * pixels);
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i * 3] / 255;
    tensor[pixels + i] = data[i * 3 + 1] / 255;
    tensor[2 * pixels + i] = data[i * 3 + 2] / 255;
  }
  tensorStats("Image input", tensor, 3);
  return { tensor, originalWidth, originalHeight };
}
async function preprocessMask(maskBuffer) {
  const { data } = await sharp(maskBuffer).resize(512, 512, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const pixels = 512 * 512;
  const tensor = new Float32Array(1 * 1 * pixels);
  for (let i = 0; i < pixels; i++) {
    tensor[i] = data[i] > 128 ? 1 : 0;
  }
  tensorStats("Mask input", tensor, 1);
  return tensor;
}
function tensorToPixels(t) {
  const pixels = 512 * 512;
  const out = new Uint8Array(pixels * 3);
  let maxVal = 0;
  for (let i = 0; i < pixels * 3; i++) {
    if (t[i] > maxVal) maxVal = t[i];
  }
  const scale = maxVal > 2 ? 1 : 255;
  for (let i = 0; i < pixels; i++) {
    let r = t[i], g = t[pixels + i], b = t[2 * pixels + i];
    if (r < 0 || g < 0 || b < 0) {
      r = (r + 1) / 2;
      g = (g + 1) / 2;
      b = (b + 1) / 2;
    }
    out[i * 3] = Math.round(Math.max(0, Math.min(255, r * scale)));
    out[i * 3 + 1] = Math.round(Math.max(0, Math.min(255, g * scale)));
    out[i * 3 + 2] = Math.round(Math.max(0, Math.min(255, b * scale)));
  }
  return out;
}
async function postprocessWithMask(outputTensor, originalWidth, originalHeight, originalImageBuffer, maskBuffer) {
  tensorStats("Model output", outputTensor, 3);
  const inpaintedPixels = tensorToPixels(outputTensor);
  const { data: aiData } = await sharp(inpaintedPixels, {
    raw: { width: 512, height: 512, channels: 3 }
  }).resize(originalWidth, originalHeight, { fit: "fill", kernel: "lanczos3" }).raw().toBuffer({ resolveWithObject: true });
  const { data: maskData } = await sharp(maskBuffer).resize(originalWidth, originalHeight, { fit: "fill" }).greyscale().threshold(128).raw().toBuffer({ resolveWithObject: true });
  const { data: origData } = await sharp(originalImageBuffer).resize(originalWidth, originalHeight, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const total = originalWidth * originalHeight;
  const merged = new Uint8Array(total * 3);
  for (let i = 0; i < total; i++) {
    if (maskData[i] > 128) {
      merged[i * 3] = aiData[i * 3];
      merged[i * 3 + 1] = aiData[i * 3 + 1];
      merged[i * 3 + 2] = aiData[i * 3 + 2];
    } else {
      merged[i * 3] = origData[i * 3];
      merged[i * 3 + 1] = origData[i * 3 + 1];
      merged[i * 3 + 2] = origData[i * 3 + 2];
    }
  }
  return await sharp(merged, {
    raw: { width: originalWidth, height: originalHeight, channels: 3 }
  }).png().toBuffer();
}
function registerInpaintLaMaHandler(win) {
  ipcMain.handle("inpaint:lama", async (_event, payload) => {
    try {
      console.log("[LaMa] ===== Request received =====");
      const imgBuf = Buffer.from(payload.imageBuffer);
      const maskBuf = Buffer.from(payload.maskBuffer);
      console.log("[LaMa] Processing...");
      const session = await getSession();
      console.log(session.inputMetadata);
      const inputNames = session.inputNames;
      const outputNames = session.outputNames;
      console.log("[LaMa] Model inputs:", inputNames, "outputs:", outputNames);
      const imgInputName = inputNames[0];
      const maskInputName = inputNames[1];
      const outName = outputNames[0];
      const { tensor: imageTensor, originalWidth, originalHeight } = await preprocessImage(imgBuf);
      const maskTensor = await preprocessMask(maskBuf);
      const imageOrt = new ort.Tensor("float32", imageTensor, [1, 3, 512, 512]);
      const maskOrt = new ort.Tensor("float32", maskTensor, [1, 1, 512, 512]);
      console.log("[LaMa] Inferencing...");
      const results = await session.run({
        [imgInputName]: imageOrt,
        [maskInputName]: maskOrt
      });
      const outputTensor = results[outName].data;
      console.log("[LaMa] Inference done");
      const resultBuffer = await postprocessWithMask(
        outputTensor,
        originalWidth,
        originalHeight,
        imgBuf,
        maskBuf
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
  console.log("[LaMa] Registering IPC handler...");
  registerInpaintLaMaHandler();
  console.log("[LaMa] IPC handler registered");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL25hdGl2ZS9wcm9jZXNzZXNJbmZvL2luZGV4LmpzIiwiLi4vLi4vbmF0aXZlL21lbW9yeUluZm8vaW5kZXguanMiLCIuLi8uLi9uYXRpdmUvY3B1SW5mby9pbmRleC5qcyIsIi4uLy4uL25hdGl2ZS9kZXNjcmlwdGlvbkluZm8vaW5kZXguanMiLCIuLi8uLi9uYXRpdmUva2lsbFByb2Nlc3MvaW5kZXguanMiLCIuLi8uLi9lbGVjdHJvbi91dGlscy9pbmRleC50cyIsIi4uLy4uL2VsZWN0cm9uL2lwYy9pcGMtaW5wYWludC1sYW1hLnRzIiwiLi4vLi4vZWxlY3Ryb24vaXBjL2luZGV4LnRzIiwiLi4vLi4vZWxlY3Ryb24vbWFpbi9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBHZW5lcmF0ZWQgYnkgc2NyaXB0cy9nZW5lcmF0ZS1leHBvcnRzLmpzXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG4vLyAxLiDojrflj5blvZPliY3mlofku7bmiYDlnKjnmoTnm67lvZUgKG5hdGl2ZS9wcm9jZXNzZXNJbmZvKVxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuLy8gMi4g5Yib5bu6IHJlcXVpcmUg55So5LqO5Yqg6L29IC5ub2RlXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpO1xuXG4vLyAzLiDlrprkvY0gLm5vZGUg5paH5Lu2XG5sZXQgYmluYXJ5UGF0aCA9ICcnO1xuLy8g5byA5Y+R546v5aKD6Lev5b6EXG5jb25zdCBkZXZQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICduYXRpdmUnLCAncHJvY2Vzc2VzSW5mbycsICdidWlsZCcsICdSZWxlYXNlJywgJ3Byb2Nlc3Nlc0luZm8ubm9kZScpO1xuLy8g55Sf5Lqn546v5aKD6Lev5b6EXG5jb25zdCBwcm9kUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9uYXRpdmUvcHJvY2Vzc2VzSW5mby9idWlsZC9SZWxlYXNlJywgJ3Byb2Nlc3Nlc0luZm8ubm9kZScpO1xuXG5pZiAoZnMuZXhpc3RzU3luYyhkZXZQYXRoKSkge1xuICAgIGJpbmFyeVBhdGggPSBkZXZQYXRoO1xufSBlbHNlIHtcbiAgICBiaW5hcnlQYXRoID0gcHJvZFBhdGg7XG4gICAgXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgICAgIC8vIOWwneivleS7jiBFbGVjdHJvbiDotYTmupDnm67lvZXmn6Xmib5cbiAgICAgICAgaWYgKHByb2Nlc3MucmVzb3VyY2VzUGF0aCkge1xuICAgICAgICAgICAgIGJpbmFyeVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5yZXNvdXJjZXNQYXRoLCAnYXBwLmFzYXIudW5wYWNrZWQnLCAnbmF0aXZlJywgJ3Byb2Nlc3Nlc0luZm8nLCAnYnVpbGQnLCAnUmVsZWFzZScsICdwcm9jZXNzZXNJbmZvLm5vZGUnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgY29uc29sZS5lcnJvcignW05hdGl2ZSBNb2R1bGUgRXJyb3JdIENvdWxkIG5vdCBmaW5kICcgKyAncHJvY2Vzc2VzSW5mby5ub2RlJyk7XG4gICAgY29uc29sZS5lcnJvcignU2VhcmNoZWQgRGV2IFBhdGg6ICcgKyBkZXZQYXRoKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBQcm9kIFBhdGg6ICcgKyBwcm9kUGF0aCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOYXRpdmUgbW9kdWxlIG5vdCBmb3VuZDogJyArICdwcm9jZXNzZXNJbmZvLm5vZGUnKTtcbn1cblxuLy8gNC4g5Yqg6L295qih5Z2XXG5jb25zdCBuYXRpdmVNb2R1bGUgPSByZXF1aXJlKGJpbmFyeVBhdGgpO1xuXG4vLyA1LiDlr7zlh7pcbmV4cG9ydCBkZWZhdWx0IG5hdGl2ZU1vZHVsZTtcblxuLy8g5aaC5p6c5L2g6ZyA6KaB6Kej5p6E5a+85YWlIChpbXBvcnQgeyB4eHggfSBmcm9tIC4uLinvvIzor7fkvp3otZYgaW5kZXguZC50cyDnmoTmj5DnpLpcbmV4cG9ydCBjb25zdCBnZXRQcm9jZXNzZXMgPSBuYXRpdmVNb2R1bGUuZ2V0UHJvY2Vzc2VzOyIsIi8vIEdlbmVyYXRlZCBieSBzY3JpcHRzL2dlbmVyYXRlLWV4cG9ydHMuanNcbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbi8vIDEuIOiOt+WPluW9k+WJjeaWh+S7tuaJgOWcqOeahOebruW9lSAobmF0aXZlL21lbW9yeUluZm8pXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyAyLiDliJvlu7ogcmVxdWlyZSDnlKjkuo7liqDovb0gLm5vZGVcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5cbi8vIDMuIOWumuS9jSAubm9kZSDmlofku7ZcbmxldCBiaW5hcnlQYXRoID0gJyc7XG4vLyDlvIDlj5Hnjq/looPot6/lvoRcbmNvbnN0IGRldlBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25hdGl2ZScsICdtZW1vcnlJbmZvJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnbWVtb3J5SW5mby5ub2RlJyk7XG4vLyDnlJ/kuqfnjq/looPot6/lvoRcbmNvbnN0IHByb2RQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL25hdGl2ZS9tZW1vcnlJbmZvL2J1aWxkL1JlbGVhc2UnLCAnbWVtb3J5SW5mby5ub2RlJyk7XG5cbmlmIChmcy5leGlzdHNTeW5jKGRldlBhdGgpKSB7XG4gICAgYmluYXJ5UGF0aCA9IGRldlBhdGg7XG59IGVsc2Uge1xuICAgIGJpbmFyeVBhdGggPSBwcm9kUGF0aDtcbiAgICBcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICAgICAgLy8g5bCd6K+V5LuOIEVsZWN0cm9uIOi1hOa6kOebruW9leafpeaJvlxuICAgICAgICBpZiAocHJvY2Vzcy5yZXNvdXJjZXNQYXRoKSB7XG4gICAgICAgICAgICAgYmluYXJ5UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhci51bnBhY2tlZCcsICduYXRpdmUnLCAnbWVtb3J5SW5mbycsICdidWlsZCcsICdSZWxlYXNlJywgJ21lbW9yeUluZm8ubm9kZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTmF0aXZlIE1vZHVsZSBFcnJvcl0gQ291bGQgbm90IGZpbmQgJyArICdtZW1vcnlJbmZvLm5vZGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBEZXYgUGF0aDogJyArIGRldlBhdGgpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaGVkIFByb2QgUGF0aDogJyArIHByb2RQYXRoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBtb2R1bGUgbm90IGZvdW5kOiAnICsgJ21lbW9yeUluZm8ubm9kZScpO1xufVxuXG4vLyA0LiDliqDovb3mqKHlnZdcbmNvbnN0IG5hdGl2ZU1vZHVsZSA9IHJlcXVpcmUoYmluYXJ5UGF0aCk7XG5cbi8vIDUuIOWvvOWHulxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlTW9kdWxlO1xuXG4vLyDlpoLmnpzkvaDpnIDopoHop6PmnoTlr7zlhaUgKGltcG9ydCB7IHh4eCB9IGZyb20gLi4uKe+8jOivt+S+nei1liBpbmRleC5kLnRzIOeahOaPkOekulxuZXhwb3J0IGNvbnN0IGdldFByb2Nlc3NNZW1vcnkgPSBuYXRpdmVNb2R1bGUuZ2V0UHJvY2Vzc01lbW9yeTtcbmV4cG9ydCBjb25zdCBnZXRTeXN0ZW1NZW1vcnkgPSBuYXRpdmVNb2R1bGUuZ2V0U3lzdGVtTWVtb3J5O1xuIiwiLy8gR2VuZXJhdGVkIGJ5IHNjcmlwdHMvZ2VuZXJhdGUtZXhwb3J0cy5qc1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuLy8gMS4g6I635Y+W5b2T5YmN5paH5Lu25omA5Zyo55qE55uu5b2VIChuYXRpdmUvY3B1SW5mbylcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbi8vIDIuIOWIm+W7uiByZXF1aXJlIOeUqOS6juWKoOi9vSAubm9kZVxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcblxuLy8gMy4g5a6a5L2NIC5ub2RlIOaWh+S7tlxubGV0IGJpbmFyeVBhdGggPSAnJztcbi8vIOW8gOWPkeeOr+Wig+i3r+W+hFxuY29uc3QgZGV2UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbmF0aXZlJywgJ2NwdUluZm8nLCAnYnVpbGQnLCAnUmVsZWFzZScsICdjcHVJbmZvLm5vZGUnKTtcbi8vIOeUn+S6p+eOr+Wig+i3r+W+hFxuY29uc3QgcHJvZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmF0aXZlL2NwdUluZm8vYnVpbGQvUmVsZWFzZScsICdjcHVJbmZvLm5vZGUnKTtcblxuaWYgKGZzLmV4aXN0c1N5bmMoZGV2UGF0aCkpIHtcbiAgICBiaW5hcnlQYXRoID0gZGV2UGF0aDtcbn0gZWxzZSB7XG4gICAgYmluYXJ5UGF0aCA9IHByb2RQYXRoO1xuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgICAgIC8vIOWwneivleS7jiBFbGVjdHJvbiDotYTmupDnm67lvZXmn6Xmib5cbiAgICAgICAgaWYgKHByb2Nlc3MucmVzb3VyY2VzUGF0aCkge1xuICAgICAgICAgICAgYmluYXJ5UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhci51bnBhY2tlZCcsICduYXRpdmUnLCAnY3B1SW5mbycsICdidWlsZCcsICdSZWxlYXNlJywgJ2NwdUluZm8ubm9kZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTmF0aXZlIE1vZHVsZSBFcnJvcl0gQ291bGQgbm90IGZpbmQgJyArICdjcHVJbmZvLm5vZGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBEZXYgUGF0aDogJyArIGRldlBhdGgpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaGVkIFByb2QgUGF0aDogJyArIHByb2RQYXRoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBtb2R1bGUgbm90IGZvdW5kOiAnICsgJ2NwdUluZm8ubm9kZScpO1xufVxuXG4vLyA0LiDliqDovb3mqKHlnZdcbmNvbnN0IG5hdGl2ZU1vZHVsZSA9IHJlcXVpcmUoYmluYXJ5UGF0aCk7XG5cbi8vIDUuIOWvvOWHulxuZXhwb3J0IGRlZmF1bHQgbmF0aXZlTW9kdWxlO1xuXG4vLyDlpoLmnpzkvaDpnIDopoHop6PmnoTlr7zlhaUgKGltcG9ydCB7IHh4eCB9IGZyb20gLi4uKe+8jOivt+S+nei1liBpbmRleC5kLnRzIOeahOaPkOekulxuZXhwb3J0IGNvbnN0IGdldFByb2Nlc3NDcHVUaW1lID0gbmF0aXZlTW9kdWxlLmdldFByb2Nlc3NDcHVUaW1lO1xuZXhwb3J0IGNvbnN0IGdldFN5c3RlbUNwdVRpbWVzID0gbmF0aXZlTW9kdWxlLmdldFN5c3RlbUNwdVRpbWVzO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IHNjcmlwdHMvZ2VuZXJhdGUtZXhwb3J0cy5qc1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuLy8gMS4g6I635Y+W5b2T5YmN5paH5Lu25omA5Zyo55qE55uu5b2VIChuYXRpdmUvZGVzY3JpcHRpb25JbmZvKVxuY29uc3QgX19maWxlbmFtZSA9IGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuLy8gMi4g5Yib5bu6IHJlcXVpcmUg55So5LqO5Yqg6L29IC5ub2RlXG5jb25zdCByZXF1aXJlID0gY3JlYXRlUmVxdWlyZShpbXBvcnQubWV0YS51cmwpO1xuXG4vLyAzLiDlrprkvY0gLm5vZGUg5paH5Lu2XG5sZXQgYmluYXJ5UGF0aCA9ICcnO1xuLy8g5byA5Y+R546v5aKD6Lev5b6EXG5jb25zdCBkZXZQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICduYXRpdmUnLCAnZGVzY3JpcHRpb25JbmZvJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnZGVzY3JpcHRpb25JbmZvLm5vZGUnKTtcbi8vIOeUn+S6p+eOr+Wig+i3r+W+hFxuY29uc3QgcHJvZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmF0aXZlL2Rlc2NyaXB0aW9uSW5mby9idWlsZC9SZWxlYXNlJywgJ2Rlc2NyaXB0aW9uSW5mby5ub2RlJyk7XG5cbmlmIChmcy5leGlzdHNTeW5jKGRldlBhdGgpKSB7XG4gICAgYmluYXJ5UGF0aCA9IGRldlBhdGg7XG59IGVsc2Uge1xuICAgIGJpbmFyeVBhdGggPSBwcm9kUGF0aDtcbiAgICBcbiAgICBpZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICAgICAgLy8g5bCd6K+V5LuOIEVsZWN0cm9uIOi1hOa6kOebruW9leafpeaJvlxuICAgICAgICBpZiAocHJvY2Vzcy5yZXNvdXJjZXNQYXRoKSB7XG4gICAgICAgICAgICAgYmluYXJ5UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhci51bnBhY2tlZCcsICduYXRpdmUnLCAnZGVzY3JpcHRpb25JbmZvJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnZGVzY3JpcHRpb25JbmZvLm5vZGUnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgY29uc29sZS5lcnJvcignW05hdGl2ZSBNb2R1bGUgRXJyb3JdIENvdWxkIG5vdCBmaW5kICcgKyAnZGVzY3JpcHRpb25JbmZvLm5vZGUnKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBEZXYgUGF0aDogJyArIGRldlBhdGgpO1xuICAgIGNvbnNvbGUuZXJyb3IoJ1NlYXJjaGVkIFByb2QgUGF0aDogJyArIHByb2RQYXRoKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBtb2R1bGUgbm90IGZvdW5kOiAnICsgJ2Rlc2NyaXB0aW9uSW5mby5ub2RlJyk7XG59XG5cbi8vIDQuIOWKoOi9veaooeWdl1xuY29uc3QgbmF0aXZlTW9kdWxlID0gcmVxdWlyZShiaW5hcnlQYXRoKTtcblxuLy8gNS4g5a+85Ye6XG5leHBvcnQgZGVmYXVsdCBuYXRpdmVNb2R1bGU7XG5cbi8vIOWmguaenOS9oOmcgOimgeino+aehOWvvOWFpSAoaW1wb3J0IHsgeHh4IH0gZnJvbSAuLi4p77yM6K+35L6d6LWWIGluZGV4LmQudHMg55qE5o+Q56S6XG4vLyDmiJbogIXlnKjov5nph4zmiYvliqjmt7vliqDlr7zlh7rvvIzkvovlpoLvvJpcbmV4cG9ydCBjb25zdCBnZXRGaWxlRGVzY3JpcHRpb24gPSBuYXRpdmVNb2R1bGUuZ2V0RmlsZURlc2NyaXB0aW9uO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IHNjcmlwdHMvZ2VuZXJhdGUtZXhwb3J0cy5qc1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuLy8gMS4g6I635Y+W5b2T5YmN5paH5Lu25omA5Zyo55qE55uu5b2VIChuYXRpdmUva2lsbFByb2Nlc3MpXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyAyLiDliJvlu7ogcmVxdWlyZSDnlKjkuo7liqDovb0gLm5vZGVcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5cbi8vIDMuIOWumuS9jSAubm9kZSDmlofku7ZcbmxldCBiaW5hcnlQYXRoID0gJyc7XG4vLyDlvIDlj5Hnjq/looPot6/lvoRcbmNvbnN0IGRldlBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25hdGl2ZScsICdraWxsUHJvY2VzcycsICdidWlsZCcsICdSZWxlYXNlJywgJ2tpbGxQcm9jZXNzLm5vZGUnKTtcbi8vIOeUn+S6p+eOr+Wig+i3r+W+hFxuY29uc3QgcHJvZFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vbmF0aXZlL2tpbGxQcm9jZXNzL2J1aWxkL1JlbGVhc2UnLCAna2lsbFByb2Nlc3Mubm9kZScpO1xuXG5pZiAoZnMuZXhpc3RzU3luYyhkZXZQYXRoKSkge1xuICAgIGJpbmFyeVBhdGggPSBkZXZQYXRoO1xufSBlbHNlIHtcbiAgICBiaW5hcnlQYXRoID0gcHJvZFBhdGg7XG4gICAgXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGJpbmFyeVBhdGgpKSB7XG4gICAgICAgIC8vIOWwneivleS7jiBFbGVjdHJvbiDotYTmupDnm67lvZXmn6Xmib5cbiAgICAgICAgaWYgKHByb2Nlc3MucmVzb3VyY2VzUGF0aCkge1xuICAgICAgICAgICAgIGJpbmFyeVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5yZXNvdXJjZXNQYXRoLCAnYXBwLmFzYXIudW5wYWNrZWQnLCAnbmF0aXZlJywgJ2tpbGxQcm9jZXNzJywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAna2lsbFByb2Nlc3Mubm9kZScpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5pZiAoIWZzLmV4aXN0c1N5bmMoYmluYXJ5UGF0aCkpIHtcbiAgICBjb25zb2xlLmVycm9yKCdbTmF0aXZlIE1vZHVsZSBFcnJvcl0gQ291bGQgbm90IGZpbmQgJyArICdraWxsUHJvY2Vzcy5ub2RlJyk7XG4gICAgY29uc29sZS5lcnJvcignU2VhcmNoZWQgRGV2IFBhdGg6ICcgKyBkZXZQYXRoKTtcbiAgICBjb25zb2xlLmVycm9yKCdTZWFyY2hlZCBQcm9kIFBhdGg6ICcgKyBwcm9kUGF0aCk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOYXRpdmUgbW9kdWxlIG5vdCBmb3VuZDogJyArICdraWxsUHJvY2Vzcy5ub2RlJyk7XG59XG5cbi8vIDQuIOWKoOi9veaooeWdl1xuY29uc3QgbmF0aXZlTW9kdWxlID0gcmVxdWlyZShiaW5hcnlQYXRoKTtcblxuLy8gNS4g5a+85Ye6XG5leHBvcnQgZGVmYXVsdCBuYXRpdmVNb2R1bGU7XG5cbi8vIOWmguaenOS9oOmcgOimgeino+aehOWvvOWFpSAoaW1wb3J0IHsgeHh4IH0gZnJvbSAuLi4p77yM6K+35L6d6LWWIGluZGV4LmQudHMg55qE5o+Q56S6XG4vLyDmiJbogIXlnKjov5nph4zmiYvliqjmt7vliqDlr7zlh7rvvIzkvovlpoLvvJpcbmV4cG9ydCBjb25zdCBraWxsUHJvY2VzcyA9IG5hdGl2ZU1vZHVsZS5raWxsUHJvY2VzcztcbiIsImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBhcHAgfSBmcm9tICdlbGVjdHJvbic7XHJcblxyXG5jb25zdCBkZWZhdWx0SWNvblBhdGggPSBwYXRoLmpvaW4oYXBwLmdldEFwcFBhdGgoKSwgJ3B1YmxpYycsICdhcHAucG5nJyk7XHJcbmNvbnN0IGRlZmF1bHRJY29uRGF0YSA9IGZzLnJlYWRGaWxlU3luYyhkZWZhdWx0SWNvblBhdGgpLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxuY29uc3QgZGVmYXVsdEljb25VcmwgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7ZGVmYXVsdEljb25EYXRhfWA7XHJcbmFzeW5jIGZ1bmN0aW9uIGdldEFwcEljb25CeVBhdGgoYXBwUGF0aDogc3RyaW5nKSB7XHJcblxyXG4gICAgaWYgKCFhcHBQYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRJY29uVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaWNvbiA9IGF3YWl0IGFwcC5nZXRGaWxlSWNvbihhcHBQYXRoLCB7IHNpemU6ICdub3JtYWwnIH0pO1xyXG4gICAgICAgIGNvbnN0IGRhdGFVcmwgPSBpY29uLnRvRGF0YVVSTCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0YVVybDtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihg5peg5rOV6I635Y+W5Zu+5qCHOiAke2FwcFBhdGh9YCwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiBkZWZhdWx0SWNvblVybDsgLy8g6I635Y+W5aSx6LSl6L+U5Zue6buY6K6k5Zu+5qCHXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7XHJcbiAgICBnZXRBcHBJY29uQnlQYXRoXHJcbn1cclxuXHJcbiIsIi8qKlxyXG4gKiDpq5jotKjph4/ljrvmsLTljbAg4oCU4oCUIOS4u+i/m+eoiyBJUEMgSGFuZGxlclxyXG4gKiDmlrnmoYjvvJpTaGFycCAo6aKE5aSE55CGKSDihpIgT05OWCBSdW50aW1lIOKGkiBMYU1hIOaooeWeiyAoQUkg5L+u5aSNKVxyXG4gKlxyXG4gKiDmqKHlnovkuIvovb3vvJpcclxuICogICDku44gSHVnZ2luZ0ZhY2Ug5LiL6L29IExhTWEgT05OWCDmqKHlnovvvIzmlL7liLDpobnnm67moLnnm67lvZUgbW9kZWxzLyDkuItcclxuICogICDmjqjojZDmqKHlnos6IGh0dHBzOi8vaHVnZ2luZ2ZhY2UuY28vYm9vbWIwb20vTGFNYS1pbnBhaW50aW5nLW9ubnhcclxuICogICDkuIvovb3mlofku7Y6IGxhbWFfZnAzMi5vbm54IOaIliBsYW1hLm9ubnhcclxuICogICDmlL7nva7ot6/lvoQ6IDzpobnnm67moLnnm67lvZU+L21vZGVscy9sYW1hLm9ubnhcclxuICovXHJcblxyXG5pbXBvcnQgeyBpcGNNYWluLCBCcm93c2VyV2luZG93IH0gZnJvbSAnZWxlY3Ryb24nXHJcbmltcG9ydCBzaGFycCBmcm9tICdzaGFycCdcclxuaW1wb3J0ICogYXMgb3J0IGZyb20gJ29ubnhydW50aW1lLW5vZGUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBmcyBmcm9tICdmcydcclxuaW1wb3J0IHsgYXBwIH0gZnJvbSAnZWxlY3Ryb24nXHJcblxyXG4vLyDilIDilIDilIAg5qih5Z6L6Lev5b6EIOKUgOKUgOKUgFxyXG5mdW5jdGlvbiBnZXRNb2RlbFBhdGgoKTogc3RyaW5nIHtcclxuICAvLyAxLiDkuI7kuLvov5vnqIvlkIznm67lvZXvvIhkZXYg5pe2ID0g6aG555uu5qC555uu5b2V77yJXHJcbiAgY29uc3QgbG9jYWxQYXRoID0gcGF0aC5qb2luKGFwcC5nZXRBcHBQYXRoKCksICdtb2RlbHMnLCAnbGFtYS5vbm54JylcclxuICBpZiAoZnMuZXhpc3RzU3luYyhsb2NhbFBhdGgpKSByZXR1cm4gbG9jYWxQYXRoXHJcblxyXG4gIC8vIDIuIOmhueebruagueebruW9le+8iGRpc3QtZWxlY3Ryb24vbWFpbi8g55qE56WW54i255uu5b2V77yM6YG/5YWN5q+P5qyh5p6E5bu65aSN5Yi2IDIwME1C77yJXHJcbiAgY29uc3Qgcm9vdFBhdGggPSBwYXRoLnJlc29sdmUoYXBwLmdldEFwcFBhdGgoKSwgJy4uJywgJy4uJywgJ21vZGVscycsICdsYW1hLm9ubngnKVxyXG4gIGlmIChmcy5leGlzdHNTeW5jKHJvb3RQYXRoKSkgcmV0dXJuIHJvb3RQYXRoXHJcblxyXG4gIC8vIDMuIOeUn+S6p+eOr+WigyBleHRyYVJlc291cmNlc1xyXG4gIGNvbnN0IHByb2RQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MucmVzb3VyY2VzUGF0aCwgJ21vZGVscycsICdsYW1hLm9ubngnKVxyXG4gIGlmIChmcy5leGlzdHNTeW5jKHByb2RQYXRoKSkgcmV0dXJuIHByb2RQYXRoXHJcblxyXG4gIHJldHVybiByb290UGF0aCAvLyDpu5jorqTov5Tlm57pobnnm67moLnot6/lvoTvvIzorqkgT05OWCDmiqXmuIXmmbDnmoTplJnor69cclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIOaooeWei+e8k+WtmCDilIDilIDilIBcclxubGV0IHNlc3Npb25DYWNoZTogb3J0LkluZmVyZW5jZVNlc3Npb24gfCBudWxsID0gbnVsbFxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbigpOiBQcm9taXNlPG9ydC5JbmZlcmVuY2VTZXNzaW9uPiB7XHJcbiAgaWYgKHNlc3Npb25DYWNoZSkgcmV0dXJuIHNlc3Npb25DYWNoZVxyXG5cclxuICBjb25zdCBtb2RlbFBhdGggPSBnZXRNb2RlbFBhdGgoKVxyXG4gIGlmICghZnMuZXhpc3RzU3luYyhtb2RlbFBhdGgpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgIGBbTGFNYV0gTW9kZWwgbm90IGZvdW5kOiAke21vZGVsUGF0aH1cXG5gICtcclxuICAgICAgYERvd25sb2FkIGZyb206IGh0dHBzOi8vaHVnZ2luZ2ZhY2UuY28vQ2FydmUvTGFNYS1PTk5YXFxuYCArXHJcbiAgICAgIGBQbGFjZSBpbjogJHtwYXRoLmRpcm5hbWUobW9kZWxQYXRoKX0vYFxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coJ1tMYU1hXSBMb2FkaW5nIG1vZGVsOicsIG1vZGVsUGF0aClcclxuICBzZXNzaW9uQ2FjaGUgPSBhd2FpdCBvcnQuSW5mZXJlbmNlU2Vzc2lvbi5jcmVhdGUobW9kZWxQYXRoLCB7XHJcbiAgICBleGVjdXRpb25Qcm92aWRlcnM6IFsnY3B1J10sIC8vIEVsZWN0cm9uIOS4u+i/m+eoi+eUqCBDUFVcclxuICAgIGdyYXBoT3B0aW1pemF0aW9uTGV2ZWw6ICdhbGwnLFxyXG4gIH0pXHJcbiAgY29uc29sZS5sb2coJ1tMYU1hXSBNb2RlbCBsb2FkZWQnKVxyXG4gIHJldHVybiBzZXNzaW9uQ2FjaGVcclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIOiwg+ivlei+heWKqSDilIDilIDilIBcclxuZnVuY3Rpb24gdGVuc29yU3RhdHMobGFiZWw6IHN0cmluZywgdDogRmxvYXQzMkFycmF5LCBjaGFubmVsczogbnVtYmVyKSB7XHJcbiAgY29uc3QgcGVyQ2ggPSB0Lmxlbmd0aCAvIGNoYW5uZWxzXHJcbiAgZm9yIChsZXQgYyA9IDA7IGMgPCBjaGFubmVsczsgYysrKSB7XHJcbiAgICBsZXQgbWluID0gSW5maW5pdHksIG1heCA9IC1JbmZpbml0eSwgc3VtID0gMFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJDaDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHYgPSB0W2MgKiBwZXJDaCArIGldXHJcbiAgICAgIGlmICh2IDwgbWluKSBtaW4gPSB2OyBpZiAodiA+IG1heCkgbWF4ID0gdjsgc3VtICs9IHZcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKGBbTGFNYV0gJHtsYWJlbH0gY2gke2N9OiBtaW49JHttaW4udG9GaXhlZCg0KX0gbWF4PSR7bWF4LnRvRml4ZWQoNCl9IG1lYW49JHsoc3VtL3BlckNoKS50b0ZpeGVkKDQpfWApXHJcbiAgfVxyXG59XHJcblxyXG4vLyDilIDilIDilIAg6aKE5aSE55CG77ya5Zu+54mHIOKGkiA1MTLDlzUxMiB0ZW5zb3LvvIjlsJ3or5UgWzAsMV0g5b2S5LiA5YyW77yJ4pSA4pSA4pSAXHJcbmFzeW5jIGZ1bmN0aW9uIHByZXByb2Nlc3NJbWFnZShpbWFnZUJ1ZmZlcjogQnVmZmVyKTogUHJvbWlzZTx7XHJcbiAgdGVuc29yOiBGbG9hdDMyQXJyYXlcclxuICBvcmlnaW5hbFdpZHRoOiBudW1iZXJcclxuICBvcmlnaW5hbEhlaWdodDogbnVtYmVyXHJcbn0+IHtcclxuICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHNoYXJwKGltYWdlQnVmZmVyKVxyXG4gICAgLnJlc2l6ZSg1MTIsIDUxMiwgeyBmaXQ6ICdmaWxsJywga2VybmVsOiAnbGFuY3pvczMnIH0pXHJcbiAgICAucmVtb3ZlQWxwaGEoKVxyXG4gICAgLnJhdygpXHJcbiAgICAudG9CdWZmZXIoeyByZXNvbHZlV2l0aE9iamVjdDogdHJ1ZSB9KVxyXG5cclxuICBjb25zdCB7IHdpZHRoOiBvcmlnaW5hbFdpZHRoLCBoZWlnaHQ6IG9yaWdpbmFsSGVpZ2h0IH0gPSBhd2FpdCBzaGFycChpbWFnZUJ1ZmZlcikubWV0YWRhdGEoKVxyXG5cclxuICBjb25zdCBwaXhlbHMgPSA1MTIgKiA1MTJcclxuICBjb25zdCB0ZW5zb3IgPSBuZXcgRmxvYXQzMkFycmF5KDEgKiAzICogcGl4ZWxzKVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGl4ZWxzOyBpKyspIHtcclxuICAgIHRlbnNvcltpXSA9IGRhdGFbaSAqIDNdIC8gMjU1LjBcclxuICAgIHRlbnNvcltwaXhlbHMgKyBpXSA9IGRhdGFbaSAqIDMgKyAxXSAvIDI1NS4wXHJcbiAgICB0ZW5zb3JbMiAqIHBpeGVscyArIGldID0gZGF0YVtpICogMyArIDJdIC8gMjU1LjBcclxuICB9XHJcbiAgdGVuc29yU3RhdHMoJ0ltYWdlIGlucHV0JywgdGVuc29yLCAzKVxyXG4gIHJldHVybiB7IHRlbnNvciwgb3JpZ2luYWxXaWR0aDogb3JpZ2luYWxXaWR0aCEsIG9yaWdpbmFsSGVpZ2h0OiBvcmlnaW5hbEhlaWdodCEgfVxyXG59XHJcblxyXG4vLyDilIDilIDilIAg6aKE5aSE55CG77yabWFzayDihpIgNTEyw5c1MTIg5Y2V6YCa6YGTIHRlbnNvciDilIDilIDilIBcclxuYXN5bmMgZnVuY3Rpb24gcHJlcHJvY2Vzc01hc2sobWFza0J1ZmZlcjogQnVmZmVyKTogUHJvbWlzZTxGbG9hdDMyQXJyYXk+IHtcclxuICBjb25zdCB7IGRhdGEgfSA9IGF3YWl0IHNoYXJwKG1hc2tCdWZmZXIpXHJcbiAgICAucmVzaXplKDUxMiwgNTEyLCB7IGZpdDogJ2ZpbGwnIH0pXHJcbiAgICAuZ3JleXNjYWxlKClcclxuICAgIC5yYXcoKVxyXG4gICAgLnRvQnVmZmVyKHsgcmVzb2x2ZVdpdGhPYmplY3Q6IHRydWUgfSlcclxuXHJcbiAgY29uc3QgcGl4ZWxzID0gNTEyICogNTEyXHJcbiAgY29uc3QgdGVuc29yID0gbmV3IEZsb2F0MzJBcnJheSgxICogMSAqIHBpeGVscylcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBpeGVsczsgaSsrKSB7XHJcbiAgICB0ZW5zb3JbaV0gPSBkYXRhW2ldID4gMTI4ID8gMS4wIDogMC4wXHJcbiAgfVxyXG4gIHRlbnNvclN0YXRzKCdNYXNrIGlucHV0JywgdGVuc29yLCAxKVxyXG4gIHJldHVybiB0ZW5zb3JcclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIHRlbnNvciDihpIgVWludDhBcnJheSBSR0IgcGl4ZWxzIOKUgOKUgOKUgFxyXG5mdW5jdGlvbiB0ZW5zb3JUb1BpeGVscyh0OiBGbG9hdDMyQXJyYXkpOiBVaW50OEFycmF5IHtcclxuICBjb25zdCBwaXhlbHMgPSA1MTIgKiA1MTJcclxuICBjb25zdCBvdXQgPSBuZXcgVWludDhBcnJheShwaXhlbHMgKiAzKVxyXG4gIC8vIOajgOa1i+i+k+WHuuWAvOWfn++8mlswLDFdIOi/mOaYryBbMCwyNTVd77yI5q2k5qih5Z6L6L6T5Ye6IFswLDI1NV3vvIlcclxuICBsZXQgbWF4VmFsID0gMFxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGl4ZWxzICogMzsgaSsrKSB7IGlmICh0W2ldID4gbWF4VmFsKSBtYXhWYWwgPSB0W2ldIH1cclxuICBjb25zdCBzY2FsZSA9IG1heFZhbCA+IDIgPyAxIDogMjU1XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaXhlbHM7IGkrKykge1xyXG4gICAgbGV0IHIgPSB0W2ldLCBnID0gdFtwaXhlbHMgKyBpXSwgYiA9IHRbMiAqIHBpeGVscyArIGldXHJcbiAgICBpZiAociA8IDAgfHwgZyA8IDAgfHwgYiA8IDApIHsgciA9IChyKzEpLzI7IGcgPSAoZysxKS8yOyBiID0gKGIrMSkvMiB9XHJcbiAgICBvdXRbaSozXSAgID0gTWF0aC5yb3VuZChNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIHIgKiBzY2FsZSkpKVxyXG4gICAgb3V0W2kqMysxXSA9IE1hdGgucm91bmQoTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBnICogc2NhbGUpKSlcclxuICAgIG91dFtpKjMrMl0gPSBNYXRoLnJvdW5kKE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgYiAqIHNjYWxlKSkpXHJcbiAgfVxyXG4gIHJldHVybiBvdXRcclxufVxyXG5cclxuLy8g4pSA4pSA4pSAIOWQjuWkhOeQhu+8mm1hc2sg5byV5a+85ZCI5oiQIOKUgOKUgOKUgFxyXG5hc3luYyBmdW5jdGlvbiBwb3N0cHJvY2Vzc1dpdGhNYXNrKFxyXG4gIG91dHB1dFRlbnNvcjogRmxvYXQzMkFycmF5LFxyXG4gIG9yaWdpbmFsV2lkdGg6IG51bWJlcixcclxuICBvcmlnaW5hbEhlaWdodDogbnVtYmVyLFxyXG4gIG9yaWdpbmFsSW1hZ2VCdWZmZXI6IEJ1ZmZlcixcclxuICBtYXNrQnVmZmVyOiBCdWZmZXJcclxuKTogUHJvbWlzZTxCdWZmZXI+IHtcclxuICB0ZW5zb3JTdGF0cygnTW9kZWwgb3V0cHV0Jywgb3V0cHV0VGVuc29yLCAzKVxyXG4gIGNvbnN0IGlucGFpbnRlZFBpeGVscyA9IHRlbnNvclRvUGl4ZWxzKG91dHB1dFRlbnNvcilcclxuXHJcbiAgLy8gMS4gQUkg57uT5p6cIOKGkiDljp/lm77lsLrlr7ggcmF3IFJHQlxyXG4gIGNvbnN0IHsgZGF0YTogYWlEYXRhIH0gPSBhd2FpdCBzaGFycChpbnBhaW50ZWRQaXhlbHMsIHtcclxuICAgIHJhdzogeyB3aWR0aDogNTEyLCBoZWlnaHQ6IDUxMiwgY2hhbm5lbHM6IDMgfSxcclxuICB9KS5yZXNpemUob3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQsIHsgZml0OiAnZmlsbCcsIGtlcm5lbDogJ2xhbmN6b3MzJyB9KVxyXG4gICAgLnJhdygpLnRvQnVmZmVyKHsgcmVzb2x2ZVdpdGhPYmplY3Q6IHRydWUgfSlcclxuXHJcbiAgLy8gMi4gbWFzayDihpIg5Y6f5Zu+5bC65a+4IHJhdyBncmF5c2NhbGVcclxuICBjb25zdCB7IGRhdGE6IG1hc2tEYXRhIH0gPSBhd2FpdCBzaGFycChtYXNrQnVmZmVyKVxyXG4gICAgLnJlc2l6ZShvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCwgeyBmaXQ6ICdmaWxsJyB9KVxyXG4gICAgLmdyZXlzY2FsZSgpLnRocmVzaG9sZCgxMjgpXHJcbiAgICAucmF3KCkudG9CdWZmZXIoeyByZXNvbHZlV2l0aE9iamVjdDogdHJ1ZSB9KVxyXG5cclxuICAvLyAzLiDljp/lm74g4oaSIOWOn+WbvuWwuuWvuCByYXcgUkdC77yI55So5LqO6YCQ5YOP57Sg5ou36LSd77yM6Zu25o2f5aSx77yJXHJcbiAgY29uc3QgeyBkYXRhOiBvcmlnRGF0YSB9ID0gYXdhaXQgc2hhcnAob3JpZ2luYWxJbWFnZUJ1ZmZlcilcclxuICAgIC5yZXNpemUob3JpZ2luYWxXaWR0aCwgb3JpZ2luYWxIZWlnaHQsIHsgZml0OiAnZmlsbCcgfSlcclxuICAgIC5yZW1vdmVBbHBoYSgpXHJcbiAgICAucmF3KCkudG9CdWZmZXIoeyByZXNvbHZlV2l0aE9iamVjdDogdHJ1ZSB9KVxyXG5cclxuICAvLyA0LiDlg4/ntKDnuqfono3lkIjvvJptYXNrIOWMuuWPliBBSe+8jOmdniBtYXNrIOWMuumAkOWtl+iKguaLt+i0neWOn+WbvlxyXG4gIGNvbnN0IHRvdGFsID0gb3JpZ2luYWxXaWR0aCAqIG9yaWdpbmFsSGVpZ2h0XHJcbiAgY29uc3QgbWVyZ2VkID0gbmV3IFVpbnQ4QXJyYXkodG90YWwgKiAzKVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xyXG4gICAgaWYgKG1hc2tEYXRhW2ldID4gMTI4KSB7XHJcbiAgICAgIG1lcmdlZFtpKjNdPWFpRGF0YVtpKjNdOyBtZXJnZWRbaSozKzFdPWFpRGF0YVtpKjMrMV07IG1lcmdlZFtpKjMrMl09YWlEYXRhW2kqMysyXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbWVyZ2VkW2kqM109b3JpZ0RhdGFbaSozXTsgbWVyZ2VkW2kqMysxXT1vcmlnRGF0YVtpKjMrMV07IG1lcmdlZFtpKjMrMl09b3JpZ0RhdGFbaSozKzJdXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXdhaXQgc2hhcnAobWVyZ2VkLCB7XHJcbiAgICByYXc6IHsgd2lkdGg6IG9yaWdpbmFsV2lkdGgsIGhlaWdodDogb3JpZ2luYWxIZWlnaHQsIGNoYW5uZWxzOiAzIH0sXHJcbiAgfSkucG5nKCkudG9CdWZmZXIoKVxyXG59XHJcblxyXG4vLyDilIDilIDilIAg5rOo5YaMIElQQyBIYW5kbGVyIOKUgOKUgOKUgFxyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJJbnBhaW50TGFNYUhhbmRsZXIod2luOiBCcm93c2VyV2luZG93KSB7XHJcbiAgaXBjTWFpbi5oYW5kbGUoJ2lucGFpbnQ6bGFtYScsIGFzeW5jIChfZXZlbnQsIHBheWxvYWQ6IHtcclxuICAgIGltYWdlQnVmZmVyOiBBcnJheUJ1ZmZlclxyXG4gICAgbWFza0J1ZmZlcjogQXJyYXlCdWZmZXJcclxuICAgIG9wdGlvbnM/OiB7IHVwc2NhbGU/OiBib29sZWFuIH1cclxuICB9KSA9PiB7XHJcbiAgICB0cnkge1xyXG4gIGNvbnNvbGUubG9nKCdbTGFNYV0gPT09PT0gUmVxdWVzdCByZWNlaXZlZCA9PT09PScpXHJcbiAgICAgIC8vIEVsZWN0cm9uIElQQyDkvKDpgJLnmoTmmK8gQXJyYXlCdWZmZXLvvIxTaGFycCDpnIDopoEgQnVmZmVyXHJcbiAgICAgIGNvbnN0IGltZ0J1ZiA9IEJ1ZmZlci5mcm9tKHBheWxvYWQuaW1hZ2VCdWZmZXIpXHJcbiAgICAgIGNvbnN0IG1hc2tCdWYgPSBCdWZmZXIuZnJvbShwYXlsb2FkLm1hc2tCdWZmZXIpXHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnW0xhTWFdIFByb2Nlc3NpbmcuLi4nKVxyXG4gICAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2Vzc2lvbigpXHJcbiAgICAgIGNvbnNvbGUubG9nKHNlc3Npb24uaW5wdXRNZXRhZGF0YSlcclxuICAgICAgLy8g5Yqo5oCB6I635Y+W5qih5Z6L6L6T5YWlL+i+k+WHuuWQje+8iOS4jeWQjCBMYU1hIOeJiOacrOWQjeensOWPr+iDveS4jeWQjO+8iVxyXG4gICAgICBjb25zdCBpbnB1dE5hbWVzICA9IHNlc3Npb24uaW5wdXROYW1lc1xyXG4gICAgICBjb25zdCBvdXRwdXROYW1lcyA9IHNlc3Npb24ub3V0cHV0TmFtZXNcclxuICAgICAgY29uc29sZS5sb2coJ1tMYU1hXSBNb2RlbCBpbnB1dHM6JywgaW5wdXROYW1lcywgJ291dHB1dHM6Jywgb3V0cHV0TmFtZXMpXHJcblxyXG4gICAgICBjb25zdCBpbWdJbnB1dE5hbWUgPSBpbnB1dE5hbWVzWzBdICAgLy8g6YCa5bi45Li6IFwiaW1hZ2VcIiDmiJYgXCJpbnB1dFwiXHJcbiAgICAgIGNvbnN0IG1hc2tJbnB1dE5hbWUgPSBpbnB1dE5hbWVzWzFdICAvLyDpgJrluLjkuLogXCJtYXNrXCJcclxuICAgICAgY29uc3Qgb3V0TmFtZSA9IG91dHB1dE5hbWVzWzBdICAgICAgIC8vIOmAmuW4uOS4uiBcIm91dHB1dFwiXHJcblxyXG4gICAgICAvLyDpooTlpITnkIZcclxuICAgICAgY29uc3QgeyB0ZW5zb3I6IGltYWdlVGVuc29yLCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCB9ID0gYXdhaXQgcHJlcHJvY2Vzc0ltYWdlKGltZ0J1ZilcclxuICAgICAgY29uc3QgbWFza1RlbnNvciA9IGF3YWl0IHByZXByb2Nlc3NNYXNrKG1hc2tCdWYpXHJcblxyXG4gICAgICAvLyBPTk5YIOaOqOeQhu+8iOS9v+eUqOaooeWei+WunumZheWQjeensO+8iVxyXG4gICAgICBjb25zdCBpbWFnZU9ydCA9IG5ldyBvcnQuVGVuc29yKCdmbG9hdDMyJywgaW1hZ2VUZW5zb3IsIFsxLCAzLCA1MTIsIDUxMl0pXHJcbiAgICAgIGNvbnN0IG1hc2tPcnQgPSBuZXcgb3J0LlRlbnNvcignZmxvYXQzMicsIG1hc2tUZW5zb3IsIFsxLCAxLCA1MTIsIDUxMl0pXHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnW0xhTWFdIEluZmVyZW5jaW5nLi4uJylcclxuICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHNlc3Npb24ucnVuKHtcclxuICAgICAgICBbaW1nSW5wdXROYW1lXTogaW1hZ2VPcnQsXHJcbiAgICAgICAgW21hc2tJbnB1dE5hbWVdOiBtYXNrT3J0LFxyXG4gICAgICB9KVxyXG4gICAgICBjb25zdCBvdXRwdXRUZW5zb3IgPSAocmVzdWx0c1tvdXROYW1lXSBhcyBvcnQuVGVuc29yKS5kYXRhIGFzIEZsb2F0MzJBcnJheVxyXG4gICAgICBjb25zb2xlLmxvZygnW0xhTWFdIEluZmVyZW5jZSBkb25lJylcclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdEJ1ZmZlciA9IGF3YWl0IHBvc3Rwcm9jZXNzV2l0aE1hc2soXHJcbiAgICAgICAgb3V0cHV0VGVuc29yLCBvcmlnaW5hbFdpZHRoLCBvcmlnaW5hbEhlaWdodCwgaW1nQnVmLCBtYXNrQnVmXHJcbiAgICAgIClcclxuXHJcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHJlc3VsdEJ1ZmZlciB9XHJcbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdbTGFNYV0g5aSE55CG5aSx6LSlOicsIGVycilcclxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnIubWVzc2FnZSB9XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG4iLCJpbXBvcnQgeyBpcGNNYWluLCBCcm93c2VyV2luZG93IH0gZnJvbSBcImVsZWN0cm9uXCI7XHJcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcclxuaW1wb3J0IHsgZ2V0UHJvY2Vzc2VzIH0gZnJvbSAnQG5hdGl2ZS9wcm9jZXNzZXNJbmZvJztcclxuaW1wb3J0IHsgZ2V0UHJvY2Vzc01lbW9yeSwgZ2V0U3lzdGVtTWVtb3J5IH0gZnJvbSBcIkBuYXRpdmUvbWVtb3J5SW5mb1wiO1xyXG5pbXBvcnQgeyBnZXRQcm9jZXNzQ3B1VGltZSwgZ2V0U3lzdGVtQ3B1VGltZXMgfSBmcm9tIFwiQG5hdGl2ZS9jcHVJbmZvXCI7XHJcbmltcG9ydCB7IGdldEZpbGVEZXNjcmlwdGlvbiB9IGZyb20gXCJAbmF0aXZlL2Rlc2NyaXB0aW9uSW5mb1wiXHJcbmltcG9ydCB7IGtpbGxQcm9jZXNzIH0gZnJvbSBcIkBuYXRpdmUva2lsbFByb2Nlc3NcIjtcclxuaW1wb3J0IHsgZ2V0QXBwSWNvbkJ5UGF0aCB9IGZyb20gXCIuLi91dGlscy9pbmRleFwiO1xyXG5pbXBvcnQgeyByZWdpc3RlcklucGFpbnRMYU1hSGFuZGxlciB9IGZyb20gXCIuL2lwYy1pbnBhaW50LWxhbWFcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGhhbmRsZUlwY0V2ZW50cyh3aW46IEJyb3dzZXJXaW5kb3cpIHtcclxuICAgIC8vIOeql+WPo+aOp+WItlxyXG4gICAgaXBjTWFpbi5vbignd2luZG93LW1pbmltaXplJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbi5taW5pbWl6ZSgpXHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLm9uKCd3aW5kb3ctbWF4aW1pemUnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbi5pc01heGltaXplZCgpKSB7XHJcbiAgICAgICAgICAgIHdpbi51bm1heGltaXplKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2luLm1heGltaXplKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaXBjTWFpbi5vbignd2luZG93LWNsb3NlJywgKCkgPT4ge1xyXG4gICAgICAgIHdpbi5jbG9zZSgpXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDilIDilIDilIAg57O757uf5L+h5oGvIOKUgOKUgOKUgFxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1wcm9jZXNzZXMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IGdldFByb2Nlc3NlcygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1wcm9jZXNzLW1lbW9yeScsIChfLCBwaWQ6IG51bWJlcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRQcm9jZXNzTWVtb3J5KHBpZCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGlwY01haW4uaGFuZGxlKCdnZXQtc3lzdGVtLW1lbW9yeScsICgpID0+IHtcclxuICAgICAgICByZXR1cm4gZ2V0U3lzdGVtTWVtb3J5KClcclxuICAgIH0pO1xyXG5cclxuICAgIGlwY01haW4uaGFuZGxlKCdnZXQtcHJvY2Vzcy1jcHUtdGltZXMnLCAoXywgcGlkOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gZ2V0UHJvY2Vzc0NwdVRpbWUocGlkKTtcclxuICAgIH0pXHJcblxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1zeXN0ZW0tY3B1LXRpbWVzJywgKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRTeXN0ZW1DcHVUaW1lcygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1maWxlLWRlc2NyaXB0aW9uJywgKF8sIHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRGaWxlRGVzY3JpcHRpb24ocGF0aCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLmhhbmRsZSgna2lsbC1wcm9jZXNzJywgKF8sIHBpZDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGtpbGxQcm9jZXNzKHBpZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpcGNNYWluLmhhbmRsZSgnZ2V0LWFwcC1pY29uJywgKF8sIGFwcFBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHJldHVybiBnZXRBcHBJY29uQnlQYXRoKGFwcFBhdGgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXBjTWFpbi5oYW5kbGUoJ2dldC1zeXN0ZW0tdXB0aW1lJywgKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBvcy51cHRpbWUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIOKUgOKUgOKUgCBMYU1hIEFJIOWOu+awtOWNsCDilIDilIDilIBcclxuICAgIGNvbnNvbGUubG9nKCdbTGFNYV0gUmVnaXN0ZXJpbmcgSVBDIGhhbmRsZXIuLi4nKVxyXG4gICAgcmVnaXN0ZXJJbnBhaW50TGFNYUhhbmRsZXIod2luKTtcclxuICAgIGNvbnNvbGUubG9nKCdbTGFNYV0gSVBDIGhhbmRsZXIgcmVnaXN0ZXJlZCcpXHJcbn1cclxuIiwiaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBUcmF5LCBNZW51IH0gZnJvbSAnZWxlY3Ryb24nXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBoYW5kbGVJcGNFdmVudHMgZnJvbSAnLi4vaXBjL2luZGV4LmpzJ1xyXG5cclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50J1xyXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpXHJcbmNvbnN0IF9fZGlybmFtZSA9IHBhdGguZGlybmFtZShfX2ZpbGVuYW1lKVxyXG5jb25zdCBWSVRFX0RFVl9TRVJWRVJfVVJMID0gcHJvY2Vzcy5lbnYuVklURV9ERVZfU0VSVkVSX1VSTFxyXG5cclxuZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xyXG4gICAgaWYgKEJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBCcm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKVswXS5zaG93KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgd2luID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgICAgIHdpZHRoOiAxMDAwLFxyXG4gICAgICAgIGhlaWdodDogNjAwLFxyXG4gICAgICAgIGZyYW1lOiBmYWxzZSxcclxuICAgICAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuJyxcclxuICAgICAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICAgICAgICBwcmVsb2FkOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vcHJlbG9hZC9pbmRleC5qcycpLFxyXG4gICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBpZiAoVklURV9ERVZfU0VSVkVSX1VSTCkge1xyXG4gICAgICAgIHdpbi5sb2FkVVJMKFZJVEVfREVWX1NFUlZFUl9VUkwhKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3aW4ubG9hZEZpbGUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL2Rpc3QvaW5kZXguaHRtbCcpKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc0Rldikge1xyXG4gICAgICAgIHdpbi53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKVxyXG4gICAgfVxyXG4gICAgY3JlYXRlVHJheSgpXHJcbiAgICBoYW5kbGVJcGNFdmVudHMod2luKVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdGZXRjaGluZyBwcm9jZXNzIGluZm9ybWF0aW9uIHVzaW5nIHN5c3RlbWluZm9ybWF0aW9uLi4uJyk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUcmF5KCkge1xyXG4gICAgY29uc3QgdHJheSA9IG5ldyBUcmF5KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9wdWJsaWMvZWxlY3Ryb24ucG5nJykpXHJcbiAgICBjb25zdCBjb250ZXh0TWVudSA9IE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xyXG4gICAgICAgIHsgbGFiZWw6ICfmmL7npLrkuLvnlYzpnaInLCBjbGljazogY3JlYXRlV2luZG93IH0sXHJcbiAgICAgICAgeyBsYWJlbDogJ+mAgOWHuueoi+W6jycsIGNsaWNrOiAoKSA9PiB7IGFwcC5xdWl0KCkgfSB9XHJcbiAgICBdKVxyXG4gICAgdHJheS5zZXRUb29sVGlwKCdQcm9jZXNzIFZpZXcnKVxyXG4gICAgdHJheS5zZXRDb250ZXh0TWVudShjb250ZXh0TWVudSlcclxufVxyXG5cclxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgY3JlYXRlV2luZG93KClcclxufSlcclxuXHJcbmFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XHJcbiAgICBpZiAoQnJvd3NlcldpbmRvdy5nZXRBbGxXaW5kb3dzKCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgY3JlYXRlV2luZG93KClcclxuICAgIH1cclxufSlcclxuXHJcblxyXG5hcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XHJcbiAgICAgICAgYXBwLnF1aXQoKVxyXG4gICAgfVxyXG59KSJdLCJuYW1lcyI6WyJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwicmVxdWlyZSIsImJpbmFyeVBhdGgiLCJkZXZQYXRoIiwicHJvZFBhdGgiLCJuYXRpdmVNb2R1bGUiLCJwYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU9BLE1BQU1BLGVBQWEsY0FBYyxZQUFZLEdBQUc7QUFDaEQsTUFBTUMsY0FBWSxLQUFLLFFBQVFELFlBQVU7QUFHekMsTUFBTUUsWUFBVSxjQUFjLFlBQVksR0FBRztBQUc3QyxJQUFJQyxlQUFhO0FBRWpCLE1BQU1DLFlBQVUsS0FBSyxLQUFLLFFBQVEsSUFBRyxHQUFJLFVBQVUsaUJBQWlCLFNBQVMsV0FBVyxvQkFBb0I7QUFFNUcsTUFBTUMsYUFBVyxLQUFLLEtBQUtKLGFBQVcsNENBQTRDLG9CQUFvQjtBQUV0RyxJQUFJLEdBQUcsV0FBV0csU0FBTyxHQUFHO0FBQ3hCRCxpQkFBYUM7QUFDakIsT0FBTztBQUNIRCxpQkFBYUU7QUFFYixNQUFJLENBQUMsR0FBRyxXQUFXRixZQUFVLEdBQUc7QUFFNUIsUUFBSSxRQUFRLGVBQWU7QUFDdEJBLHFCQUFhLEtBQUssS0FBSyxRQUFRLGVBQWUscUJBQXFCLFVBQVUsaUJBQWlCLFNBQVMsV0FBVyxvQkFBb0I7QUFBQSxJQUMzSTtBQUFBLEVBQ0o7QUFDSjtBQUVBLElBQUksQ0FBQyxHQUFHLFdBQVdBLFlBQVUsR0FBRztBQUM1QixVQUFRLE1BQU0seURBQThEO0FBQzVFLFVBQVEsTUFBTSx3QkFBd0JDLFNBQU87QUFDN0MsVUFBUSxNQUFNLHlCQUF5QkMsVUFBUTtBQUMvQyxRQUFNLElBQUksTUFBTSw2Q0FBa0Q7QUFDdEU7QUFHQSxNQUFNQyxpQkFBZUosVUFBUUMsWUFBVTtBQU1oQyxNQUFNLGVBQWVHLGVBQWE7QUN4Q3pDLE1BQU1OLGVBQWEsY0FBYyxZQUFZLEdBQUc7QUFDaEQsTUFBTUMsY0FBWSxLQUFLLFFBQVFELFlBQVU7QUFHekMsTUFBTUUsWUFBVSxjQUFjLFlBQVksR0FBRztBQUc3QyxJQUFJQyxlQUFhO0FBRWpCLE1BQU1DLFlBQVUsS0FBSyxLQUFLLFFBQVEsSUFBRyxHQUFJLFVBQVUsY0FBYyxTQUFTLFdBQVcsaUJBQWlCO0FBRXRHLE1BQU1DLGFBQVcsS0FBSyxLQUFLSixhQUFXLHlDQUF5QyxpQkFBaUI7QUFFaEcsSUFBSSxHQUFHLFdBQVdHLFNBQU8sR0FBRztBQUN4QkQsaUJBQWFDO0FBQ2pCLE9BQU87QUFDSEQsaUJBQWFFO0FBRWIsTUFBSSxDQUFDLEdBQUcsV0FBV0YsWUFBVSxHQUFHO0FBRTVCLFFBQUksUUFBUSxlQUFlO0FBQ3RCQSxxQkFBYSxLQUFLLEtBQUssUUFBUSxlQUFlLHFCQUFxQixVQUFVLGNBQWMsU0FBUyxXQUFXLGlCQUFpQjtBQUFBLElBQ3JJO0FBQUEsRUFDSjtBQUNKO0FBRUEsSUFBSSxDQUFDLEdBQUcsV0FBV0EsWUFBVSxHQUFHO0FBQzVCLFVBQVEsTUFBTSxzREFBMkQ7QUFDekUsVUFBUSxNQUFNLHdCQUF3QkMsU0FBTztBQUM3QyxVQUFRLE1BQU0seUJBQXlCQyxVQUFRO0FBQy9DLFFBQU0sSUFBSSxNQUFNLDBDQUErQztBQUNuRTtBQUdBLE1BQU1DLGlCQUFlSixVQUFRQyxZQUFVO0FBTWhDLE1BQU0sbUJBQW1CRyxlQUFhO0FBQ3RDLE1BQU0sa0JBQWtCQSxlQUFhO0FDekM1QyxNQUFNTixlQUFhLGNBQWMsWUFBWSxHQUFHO0FBQ2hELE1BQU1DLGNBQVksS0FBSyxRQUFRRCxZQUFVO0FBR3pDLE1BQU1FLFlBQVUsY0FBYyxZQUFZLEdBQUc7QUFHN0MsSUFBSUMsZUFBYTtBQUVqQixNQUFNQyxZQUFVLEtBQUssS0FBSyxRQUFRLElBQUcsR0FBSSxVQUFVLFdBQVcsU0FBUyxXQUFXLGNBQWM7QUFFaEcsTUFBTUMsYUFBVyxLQUFLLEtBQUtKLGFBQVcsc0NBQXNDLGNBQWM7QUFFMUYsSUFBSSxHQUFHLFdBQVdHLFNBQU8sR0FBRztBQUN4QkQsaUJBQWFDO0FBQ2pCLE9BQU87QUFDSEQsaUJBQWFFO0FBRWIsTUFBSSxDQUFDLEdBQUcsV0FBV0YsWUFBVSxHQUFHO0FBRTVCLFFBQUksUUFBUSxlQUFlO0FBQ3ZCQSxxQkFBYSxLQUFLLEtBQUssUUFBUSxlQUFlLHFCQUFxQixVQUFVLFdBQVcsU0FBUyxXQUFXLGNBQWM7QUFBQSxJQUM5SDtBQUFBLEVBQ0o7QUFDSjtBQUVBLElBQUksQ0FBQyxHQUFHLFdBQVdBLFlBQVUsR0FBRztBQUM1QixVQUFRLE1BQU0sbURBQXdEO0FBQ3RFLFVBQVEsTUFBTSx3QkFBd0JDLFNBQU87QUFDN0MsVUFBUSxNQUFNLHlCQUF5QkMsVUFBUTtBQUMvQyxRQUFNLElBQUksTUFBTSx1Q0FBNEM7QUFDaEU7QUFHQSxNQUFNQyxpQkFBZUosVUFBUUMsWUFBVTtBQU1oQyxNQUFNLG9CQUFvQkcsZUFBYTtBQUN2QyxNQUFNLG9CQUFvQkEsZUFBYTtBQ3pDOUMsTUFBTU4sZUFBYSxjQUFjLFlBQVksR0FBRztBQUNoRCxNQUFNQyxjQUFZLEtBQUssUUFBUUQsWUFBVTtBQUd6QyxNQUFNRSxZQUFVLGNBQWMsWUFBWSxHQUFHO0FBRzdDLElBQUlDLGVBQWE7QUFFakIsTUFBTUMsWUFBVSxLQUFLLEtBQUssUUFBUSxJQUFHLEdBQUksVUFBVSxtQkFBbUIsU0FBUyxXQUFXLHNCQUFzQjtBQUVoSCxNQUFNQyxhQUFXLEtBQUssS0FBS0osYUFBVyw4Q0FBOEMsc0JBQXNCO0FBRTFHLElBQUksR0FBRyxXQUFXRyxTQUFPLEdBQUc7QUFDeEJELGlCQUFhQztBQUNqQixPQUFPO0FBQ0hELGlCQUFhRTtBQUViLE1BQUksQ0FBQyxHQUFHLFdBQVdGLFlBQVUsR0FBRztBQUU1QixRQUFJLFFBQVEsZUFBZTtBQUN0QkEscUJBQWEsS0FBSyxLQUFLLFFBQVEsZUFBZSxxQkFBcUIsVUFBVSxtQkFBbUIsU0FBUyxXQUFXLHNCQUFzQjtBQUFBLElBQy9JO0FBQUEsRUFDSjtBQUNKO0FBRUEsSUFBSSxDQUFDLEdBQUcsV0FBV0EsWUFBVSxHQUFHO0FBQzVCLFVBQVEsTUFBTSwyREFBZ0U7QUFDOUUsVUFBUSxNQUFNLHdCQUF3QkMsU0FBTztBQUM3QyxVQUFRLE1BQU0seUJBQXlCQyxVQUFRO0FBQy9DLFFBQU0sSUFBSSxNQUFNLCtDQUFvRDtBQUN4RTtBQUdBLE1BQU1DLGlCQUFlSixVQUFRQyxZQUFVO0FBT2hDLE1BQU0scUJBQXFCRyxlQUFhO0FDekMvQyxNQUFNTixlQUFhLGNBQWMsWUFBWSxHQUFHO0FBQ2hELE1BQU1DLGNBQVksS0FBSyxRQUFRRCxZQUFVO0FBR3pDLE1BQU1FLFlBQVUsY0FBYyxZQUFZLEdBQUc7QUFHN0MsSUFBSSxhQUFhO0FBRWpCLE1BQU0sVUFBVSxLQUFLLEtBQUssUUFBUSxJQUFHLEdBQUksVUFBVSxlQUFlLFNBQVMsV0FBVyxrQkFBa0I7QUFFeEcsTUFBTSxXQUFXLEtBQUssS0FBS0QsYUFBVywwQ0FBMEMsa0JBQWtCO0FBRWxHLElBQUksR0FBRyxXQUFXLE9BQU8sR0FBRztBQUN4QixlQUFhO0FBQ2pCLE9BQU87QUFDSCxlQUFhO0FBRWIsTUFBSSxDQUFDLEdBQUcsV0FBVyxVQUFVLEdBQUc7QUFFNUIsUUFBSSxRQUFRLGVBQWU7QUFDdEIsbUJBQWEsS0FBSyxLQUFLLFFBQVEsZUFBZSxxQkFBcUIsVUFBVSxlQUFlLFNBQVMsV0FBVyxrQkFBa0I7QUFBQSxJQUN2STtBQUFBLEVBQ0o7QUFDSjtBQUVBLElBQUksQ0FBQyxHQUFHLFdBQVcsVUFBVSxHQUFHO0FBQzVCLFVBQVEsTUFBTSx1REFBNEQ7QUFDMUUsVUFBUSxNQUFNLHdCQUF3QixPQUFPO0FBQzdDLFVBQVEsTUFBTSx5QkFBeUIsUUFBUTtBQUMvQyxRQUFNLElBQUksTUFBTSwyQ0FBZ0Q7QUFDcEU7QUFHQSxNQUFNLGVBQWVDLFVBQVEsVUFBVTtBQU9oQyxNQUFNLGNBQWMsYUFBYTtBQzVDeEMsTUFBTSxrQkFBa0IsS0FBSyxLQUFLLElBQUksV0FBQSxHQUFjLFVBQVUsU0FBUztBQUN2RSxNQUFNLGtCQUFrQixHQUFHLGFBQWEsZUFBZSxFQUFFLFNBQVMsUUFBUTtBQUMxRSxNQUFNLGlCQUFpQix5QkFBeUIsZUFBZTtBQUMvRCxlQUFlLGlCQUFpQixTQUFpQjtBQUU3QyxNQUFJLENBQUMsU0FBUztBQUNWLFdBQU87QUFBQSxFQUNYO0FBRUEsTUFBSTtBQUNBLFVBQU0sT0FBTyxNQUFNLElBQUksWUFBWSxTQUFTLEVBQUUsTUFBTSxVQUFVO0FBQzlELFVBQU0sVUFBVSxLQUFLLFVBQUE7QUFFckIsV0FBTztBQUFBLEVBQ1gsU0FBUyxPQUFPO0FBQ1osWUFBUSxNQUFNLFdBQVcsT0FBTyxJQUFJLEtBQUs7QUFDekMsV0FBTztBQUFBLEVBQ1g7QUFDSjtBQ0hBLFNBQVMsZUFBdUI7QUFFOUIsUUFBTSxZQUFZLEtBQUssS0FBSyxJQUFJLFdBQUEsR0FBYyxVQUFVLFdBQVc7QUFDbkUsTUFBSSxHQUFHLFdBQVcsU0FBUyxFQUFHLFFBQU87QUFHckMsUUFBTSxXQUFXLEtBQUssUUFBUSxJQUFJLGNBQWMsTUFBTSxNQUFNLFVBQVUsV0FBVztBQUNqRixNQUFJLEdBQUcsV0FBVyxRQUFRLEVBQUcsUUFBTztBQUdwQyxRQUFNRyxZQUFXLEtBQUssS0FBSyxRQUFRLGVBQWUsVUFBVSxXQUFXO0FBQ3ZFLE1BQUksR0FBRyxXQUFXQSxTQUFRLEVBQUcsUUFBT0E7QUFFcEMsU0FBTztBQUNUO0FBR0EsSUFBSSxlQUE0QztBQUVoRCxlQUFlLGFBQTRDO0FBQ3pELE1BQUksYUFBYyxRQUFPO0FBRXpCLFFBQU0sWUFBWSxhQUFBO0FBQ2xCLE1BQUksQ0FBQyxHQUFHLFdBQVcsU0FBUyxHQUFHO0FBQzdCLFVBQU0sSUFBSTtBQUFBLE1BQ1IsMkJBQTJCLFNBQVM7QUFBQTtBQUFBLFlBRXZCLEtBQUssUUFBUSxTQUFTLENBQUM7QUFBQSxJQUFBO0FBQUEsRUFFeEM7QUFFQSxVQUFRLElBQUkseUJBQXlCLFNBQVM7QUFDOUMsaUJBQWUsTUFBTSxJQUFJLGlCQUFpQixPQUFPLFdBQVc7QUFBQSxJQUMxRCxvQkFBb0IsQ0FBQyxLQUFLO0FBQUE7QUFBQSxJQUMxQix3QkFBd0I7QUFBQSxFQUFBLENBQ3pCO0FBQ0QsVUFBUSxJQUFJLHFCQUFxQjtBQUNqQyxTQUFPO0FBQ1Q7QUFHQSxTQUFTLFlBQVksT0FBZSxHQUFpQixVQUFrQjtBQUNyRSxRQUFNLFFBQVEsRUFBRSxTQUFTO0FBQ3pCLFdBQVMsSUFBSSxHQUFHLElBQUksVUFBVSxLQUFLO0FBQ2pDLFFBQUksTUFBTSxVQUFVLE1BQU0sV0FBVyxNQUFNO0FBQzNDLGFBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxLQUFLO0FBQzlCLFlBQU0sSUFBSSxFQUFFLElBQUksUUFBUSxDQUFDO0FBQ3pCLFVBQUksSUFBSSxJQUFLLE9BQU07QUFBRyxVQUFJLElBQUksSUFBSyxPQUFNO0FBQUcsYUFBTztBQUFBLElBQ3JEO0FBQ0EsWUFBUSxJQUFJLFVBQVUsS0FBSyxNQUFNLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxVQUFVLE1BQUksT0FBTyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQUEsRUFDbEg7QUFDRjtBQUdBLGVBQWUsZ0JBQWdCLGFBSTVCO0FBQ0QsUUFBTSxFQUFFLFNBQVMsTUFBTSxNQUFNLFdBQVcsRUFDckMsT0FBTyxLQUFLLEtBQUssRUFBRSxLQUFLLFFBQVEsUUFBUSxZQUFZLEVBQ3BELFlBQUEsRUFDQSxJQUFBLEVBQ0EsU0FBUyxFQUFFLG1CQUFtQixNQUFNO0FBRXZDLFFBQU0sRUFBRSxPQUFPLGVBQWUsUUFBUSxlQUFBLElBQW1CLE1BQU0sTUFBTSxXQUFXLEVBQUUsU0FBQTtBQUVsRixRQUFNLFNBQVMsTUFBTTtBQUNyQixRQUFNLFNBQVMsSUFBSSxhQUFhLElBQUksSUFBSSxNQUFNO0FBQzlDLFdBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxLQUFLO0FBQy9CLFdBQU8sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUk7QUFDMUIsV0FBTyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUk7QUFDdkMsV0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSTtBQUFBLEVBQzdDO0FBQ0EsY0FBWSxlQUFlLFFBQVEsQ0FBQztBQUNwQyxTQUFPLEVBQUUsUUFBUSxlQUErQixlQUFBO0FBQ2xEO0FBR0EsZUFBZSxlQUFlLFlBQTJDO0FBQ3ZFLFFBQU0sRUFBRSxTQUFTLE1BQU0sTUFBTSxVQUFVLEVBQ3BDLE9BQU8sS0FBSyxLQUFLLEVBQUUsS0FBSyxPQUFBLENBQVEsRUFDaEMsWUFDQSxJQUFBLEVBQ0EsU0FBUyxFQUFFLG1CQUFtQixNQUFNO0FBRXZDLFFBQU0sU0FBUyxNQUFNO0FBQ3JCLFFBQU0sU0FBUyxJQUFJLGFBQWEsSUFBSSxJQUFJLE1BQU07QUFDOUMsV0FBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLEtBQUs7QUFDL0IsV0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksTUFBTSxJQUFNO0FBQUEsRUFDcEM7QUFDQSxjQUFZLGNBQWMsUUFBUSxDQUFDO0FBQ25DLFNBQU87QUFDVDtBQUdBLFNBQVMsZUFBZSxHQUE2QjtBQUNuRCxRQUFNLFNBQVMsTUFBTTtBQUNyQixRQUFNLE1BQU0sSUFBSSxXQUFXLFNBQVMsQ0FBQztBQUVyQyxNQUFJLFNBQVM7QUFDYixXQUFTLElBQUksR0FBRyxJQUFJLFNBQVMsR0FBRyxLQUFLO0FBQUUsUUFBSSxFQUFFLENBQUMsSUFBSSxPQUFRLFVBQVMsRUFBRSxDQUFDO0FBQUEsRUFBRTtBQUN4RSxRQUFNLFFBQVEsU0FBUyxJQUFJLElBQUk7QUFDL0IsV0FBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLEtBQUs7QUFDL0IsUUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxTQUFTLENBQUM7QUFDckQsUUFBSSxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksR0FBRztBQUFFLFdBQUssSUFBRSxLQUFHO0FBQUcsV0FBSyxJQUFFLEtBQUc7QUFBRyxXQUFLLElBQUUsS0FBRztBQUFBLElBQUU7QUFDckUsUUFBSSxJQUFFLENBQUMsSUFBTSxLQUFLLE1BQU0sS0FBSyxJQUFJLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQztBQUM3RCxRQUFJLElBQUUsSUFBRSxDQUFDLElBQUksS0FBSyxNQUFNLEtBQUssSUFBSSxHQUFHLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLENBQUM7QUFDN0QsUUFBSSxJQUFFLElBQUUsQ0FBQyxJQUFJLEtBQUssTUFBTSxLQUFLLElBQUksR0FBRyxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQUEsRUFDL0Q7QUFDQSxTQUFPO0FBQ1Q7QUFHQSxlQUFlLG9CQUNiLGNBQ0EsZUFDQSxnQkFDQSxxQkFDQSxZQUNpQjtBQUNqQixjQUFZLGdCQUFnQixjQUFjLENBQUM7QUFDM0MsUUFBTSxrQkFBa0IsZUFBZSxZQUFZO0FBR25ELFFBQU0sRUFBRSxNQUFNLE9BQUEsSUFBVyxNQUFNLE1BQU0saUJBQWlCO0FBQUEsSUFDcEQsS0FBSyxFQUFFLE9BQU8sS0FBSyxRQUFRLEtBQUssVUFBVSxFQUFBO0FBQUEsRUFBRSxDQUM3QyxFQUFFLE9BQU8sZUFBZSxnQkFBZ0IsRUFBRSxLQUFLLFFBQVEsUUFBUSxXQUFBLENBQVksRUFDekUsSUFBQSxFQUFNLFNBQVMsRUFBRSxtQkFBbUIsTUFBTTtBQUc3QyxRQUFNLEVBQUUsTUFBTSxTQUFBLElBQWEsTUFBTSxNQUFNLFVBQVUsRUFDOUMsT0FBTyxlQUFlLGdCQUFnQixFQUFFLEtBQUssT0FBQSxDQUFRLEVBQ3JELFVBQUEsRUFBWSxVQUFVLEdBQUcsRUFDekIsSUFBQSxFQUFNLFNBQVMsRUFBRSxtQkFBbUIsTUFBTTtBQUc3QyxRQUFNLEVBQUUsTUFBTSxhQUFhLE1BQU0sTUFBTSxtQkFBbUIsRUFDdkQsT0FBTyxlQUFlLGdCQUFnQixFQUFFLEtBQUssT0FBQSxDQUFRLEVBQ3JELGNBQ0EsSUFBQSxFQUFNLFNBQVMsRUFBRSxtQkFBbUIsTUFBTTtBQUc3QyxRQUFNLFFBQVEsZ0JBQWdCO0FBQzlCLFFBQU0sU0FBUyxJQUFJLFdBQVcsUUFBUSxDQUFDO0FBQ3ZDLFdBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxLQUFLO0FBQzlCLFFBQUksU0FBUyxDQUFDLElBQUksS0FBSztBQUNyQixhQUFPLElBQUUsQ0FBQyxJQUFFLE9BQU8sSUFBRSxDQUFDO0FBQUcsYUFBTyxJQUFFLElBQUUsQ0FBQyxJQUFFLE9BQU8sSUFBRSxJQUFFLENBQUM7QUFBRyxhQUFPLElBQUUsSUFBRSxDQUFDLElBQUUsT0FBTyxJQUFFLElBQUUsQ0FBQztBQUFBLElBQ2xGLE9BQU87QUFDTCxhQUFPLElBQUUsQ0FBQyxJQUFFLFNBQVMsSUFBRSxDQUFDO0FBQUcsYUFBTyxJQUFFLElBQUUsQ0FBQyxJQUFFLFNBQVMsSUFBRSxJQUFFLENBQUM7QUFBRyxhQUFPLElBQUUsSUFBRSxDQUFDLElBQUUsU0FBUyxJQUFFLElBQUUsQ0FBQztBQUFBLElBQ3hGO0FBQUEsRUFDRjtBQUVBLFNBQU8sTUFBTSxNQUFNLFFBQVE7QUFBQSxJQUN6QixLQUFLLEVBQUUsT0FBTyxlQUFlLFFBQVEsZ0JBQWdCLFVBQVUsRUFBQTtBQUFBLEVBQUUsQ0FDbEUsRUFBRSxJQUFBLEVBQU0sU0FBQTtBQUNYO0FBR08sU0FBUywyQkFBMkIsS0FBb0I7QUFDN0QsVUFBUSxPQUFPLGdCQUFnQixPQUFPLFFBQVEsWUFJeEM7QUFDSixRQUFJO0FBQ04sY0FBUSxJQUFJLHFDQUFxQztBQUU3QyxZQUFNLFNBQVMsT0FBTyxLQUFLLFFBQVEsV0FBVztBQUM5QyxZQUFNLFVBQVUsT0FBTyxLQUFLLFFBQVEsVUFBVTtBQUU5QyxjQUFRLElBQUksc0JBQXNCO0FBQ2xDLFlBQU0sVUFBVSxNQUFNLFdBQUE7QUFDdEIsY0FBUSxJQUFJLFFBQVEsYUFBYTtBQUVqQyxZQUFNLGFBQWMsUUFBUTtBQUM1QixZQUFNLGNBQWMsUUFBUTtBQUM1QixjQUFRLElBQUksd0JBQXdCLFlBQVksWUFBWSxXQUFXO0FBRXZFLFlBQU0sZUFBZSxXQUFXLENBQUM7QUFDakMsWUFBTSxnQkFBZ0IsV0FBVyxDQUFDO0FBQ2xDLFlBQU0sVUFBVSxZQUFZLENBQUM7QUFHN0IsWUFBTSxFQUFFLFFBQVEsYUFBYSxlQUFlLG1CQUFtQixNQUFNLGdCQUFnQixNQUFNO0FBQzNGLFlBQU0sYUFBYSxNQUFNLGVBQWUsT0FBTztBQUcvQyxZQUFNLFdBQVcsSUFBSSxJQUFJLE9BQU8sV0FBVyxhQUFhLENBQUMsR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDO0FBQ3hFLFlBQU0sVUFBVSxJQUFJLElBQUksT0FBTyxXQUFXLFlBQVksQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUM7QUFFdEUsY0FBUSxJQUFJLHVCQUF1QjtBQUNuQyxZQUFNLFVBQVUsTUFBTSxRQUFRLElBQUk7QUFBQSxRQUNoQyxDQUFDLFlBQVksR0FBRztBQUFBLFFBQ2hCLENBQUMsYUFBYSxHQUFHO0FBQUEsTUFBQSxDQUNsQjtBQUNELFlBQU0sZUFBZ0IsUUFBUSxPQUFPLEVBQWlCO0FBQ3RELGNBQVEsSUFBSSx1QkFBdUI7QUFFbkMsWUFBTSxlQUFlLE1BQU07QUFBQSxRQUN6QjtBQUFBLFFBQWM7QUFBQSxRQUFlO0FBQUEsUUFBZ0I7QUFBQSxRQUFRO0FBQUEsTUFBQTtBQUd2RCxhQUFPLEVBQUUsU0FBUyxNQUFNLE1BQU0sYUFBQTtBQUFBLElBQ2hDLFNBQVMsS0FBVTtBQUNqQixjQUFRLE1BQU0sZ0JBQWdCLEdBQUc7QUFDakMsYUFBTyxFQUFFLFNBQVMsT0FBTyxPQUFPLElBQUksUUFBQTtBQUFBLElBQ3RDO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUMxTkEsU0FBd0IsZ0JBQWdCLEtBQW9CO0FBRXhELFVBQVEsR0FBRyxtQkFBbUIsTUFBTTtBQUNoQyxRQUFJLFNBQUE7QUFBQSxFQUNSLENBQUM7QUFFRCxVQUFRLEdBQUcsbUJBQW1CLE1BQU07QUFDaEMsUUFBSSxJQUFJLGVBQWU7QUFDbkIsVUFBSSxXQUFBO0FBQUEsSUFDUixPQUFPO0FBQ0gsVUFBSSxTQUFBO0FBQUEsSUFDUjtBQUFBLEVBQ0osQ0FBQztBQUVELFVBQVEsR0FBRyxnQkFBZ0IsTUFBTTtBQUM3QixRQUFJLE1BQUE7QUFBQSxFQUNSLENBQUM7QUFHRCxVQUFRLE9BQU8saUJBQWlCLFlBQVk7QUFDeEMsV0FBTyxNQUFNLGFBQUE7QUFBQSxFQUNqQixDQUFDO0FBRUQsVUFBUSxPQUFPLHNCQUFzQixDQUFDLEdBQUcsUUFBZ0I7QUFDckQsV0FBTyxpQkFBaUIsR0FBRztBQUFBLEVBQy9CLENBQUM7QUFFRCxVQUFRLE9BQU8scUJBQXFCLE1BQU07QUFDdEMsV0FBTyxnQkFBQTtBQUFBLEVBQ1gsQ0FBQztBQUVELFVBQVEsT0FBTyx5QkFBeUIsQ0FBQyxHQUFHLFFBQWdCO0FBQ3hELFdBQU8sa0JBQWtCLEdBQUc7QUFBQSxFQUNoQyxDQUFDO0FBRUQsVUFBUSxPQUFPLHdCQUF3QixNQUFNO0FBQ3pDLFdBQU8sa0JBQUE7QUFBQSxFQUNYLENBQUM7QUFFRCxVQUFRLE9BQU8sd0JBQXdCLENBQUMsR0FBR0UsVUFBaUI7QUFDeEQsV0FBTyxtQkFBbUJBLEtBQUk7QUFBQSxFQUNsQyxDQUFDO0FBRUQsVUFBUSxPQUFPLGdCQUFnQixDQUFDLEdBQUcsUUFBZ0I7QUFDL0MsV0FBTyxZQUFZLEdBQUc7QUFBQSxFQUMxQixDQUFDO0FBRUQsVUFBUSxPQUFPLGdCQUFnQixDQUFDLEdBQUcsWUFBb0I7QUFDbkQsV0FBTyxpQkFBaUIsT0FBTztBQUFBLEVBQ25DLENBQUM7QUFFRCxVQUFRLE9BQU8scUJBQXFCLE1BQU07QUFDdEMsV0FBTyxHQUFHLE9BQUE7QUFBQSxFQUNkLENBQUM7QUFHRCxVQUFRLElBQUksbUNBQW1DO0FBQy9DLDZCQUE4QjtBQUM5QixVQUFRLElBQUksK0JBQStCO0FBQy9DO0FDaEVBLE1BQU0sUUFBUSxZQUFZLGFBQWE7QUFDdkMsTUFBTVAsZUFBYSxjQUFjLFlBQVksR0FBRztBQUNoRCxNQUFNQyxjQUFZLEtBQUssUUFBUUQsWUFBVTtBQUN6QyxNQUFNLHNCQUFzQixRQUFBLElBQVk7QUFFeEMsU0FBUyxlQUFlO0FBQ3BCLE1BQUksY0FBYyxnQkFBZ0IsU0FBUyxHQUFHO0FBQzFDLGtCQUFjLGNBQUEsRUFBZ0IsQ0FBQyxFQUFFLEtBQUE7QUFDakM7QUFBQSxFQUNKO0FBQ0EsUUFBTSxNQUFNLElBQUksY0FBYztBQUFBLElBQzFCLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLE9BQU87QUFBQSxJQUNQLGVBQWU7QUFBQSxJQUNmLGdCQUFnQjtBQUFBLE1BQ1osU0FBUyxLQUFLLEtBQUtDLGFBQVcscUJBQXFCO0FBQUEsTUFDbkQsaUJBQWlCO0FBQUEsTUFDakIsa0JBQWtCO0FBQUEsSUFBQTtBQUFBLEVBQ3RCLENBQ0g7QUFFRCxNQUFJLHFCQUFxQjtBQUNyQixRQUFJLFFBQVEsbUJBQW9CO0FBQUEsRUFDcEMsT0FBTztBQUNILFFBQUksU0FBUyxLQUFLLEtBQUtBLGFBQVcsdUJBQXVCLENBQUM7QUFBQSxFQUM5RDtBQUVBLE1BQUksT0FBTztBQUNQLFFBQUksWUFBWSxhQUFBO0FBQUEsRUFDcEI7QUFDQSxhQUFBO0FBQ0Esa0JBQWdCLEdBQUc7QUFFbkIsVUFBUSxJQUFJLHlEQUF5RDtBQUV6RTtBQUVBLFNBQVMsYUFBYTtBQUNsQixRQUFNLE9BQU8sSUFBSSxLQUFLLEtBQUssS0FBS0EsYUFBVywyQkFBMkIsQ0FBQztBQUN2RSxRQUFNLGNBQWMsS0FBSyxrQkFBa0I7QUFBQSxJQUN2QyxFQUFFLE9BQU8sU0FBUyxPQUFPLGFBQUE7QUFBQSxJQUN6QixFQUFFLE9BQU8sUUFBUSxPQUFPLE1BQU07QUFBRSxVQUFJLEtBQUE7QUFBQSxJQUFPLEVBQUE7QUFBQSxFQUFFLENBQ2hEO0FBQ0QsT0FBSyxXQUFXLGNBQWM7QUFDOUIsT0FBSyxlQUFlLFdBQVc7QUFDbkM7QUFFQSxJQUFJLFVBQUEsRUFBWSxLQUFLLE1BQU07QUFDdkIsZUFBQTtBQUNKLENBQUM7QUFFRCxJQUFJLEdBQUcsWUFBWSxNQUFNO0FBQ3JCLE1BQUksY0FBYyxnQkFBZ0IsV0FBVyxHQUFHO0FBQzVDLGlCQUFBO0FBQUEsRUFDSjtBQUNKLENBQUM7QUFHRCxJQUFJLEdBQUcscUJBQXFCLE1BQU07QUFDOUIsTUFBSSxRQUFRLGFBQWEsVUFBVTtBQUMvQixRQUFJLEtBQUE7QUFBQSxFQUNSO0FBQ0osQ0FBQzsifQ==
