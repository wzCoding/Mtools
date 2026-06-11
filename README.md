# Mtools

一个基于 **Electron + React + Vite** 构建的 Windows 桌面小工具，这个工具40%代码由 Vibe Coding 完成，目前功能包括进程监控、资源分析与图像水印修复。

## ✨ 主要功能

### 🔍 进程管理

- **进程列表展示** — 通过虚拟列表高性能展示所有正在运行的 Windows 进程，支持按名称、PID、类型等字段排序与筛选。
- **实时监控** — 自动轮询刷新进程状态，实时获取 CPU、内存等资源占用数据。
- **终止进程** — 支持一键结束指定进程，自动检测管理员权限。
- **系统概览** — 顶部卡片面板展示系统 CPU 使用率、内存占用、进程总数、活跃进程数及系统运行时长。
- **导出 Excel** — 支持将当前进程列表数据导出为 Excel 文件。
- **右键菜单** — 针对单个进程提供快捷操作上下文菜单。

### 🖼️ 图像水印修复

- **OpenCV.js 驱动** — 基于 OpenCV.js 实现图像修复（Inpainting），可用于去除图片水印、文字等。
- **两种算法** — 支持 **Telea 快速算法** 和 **Navier-Stokes 高质量算法**。
- **交互式选区** — 在图片上拖拽绘制矩形选区，标记需要修复的区域。
- **前后对比** — 提供修复前/修复后的切换预览，直观评估修复效果。
- **导入导出** — 支持上传本地图片、下载修复结果。

### 🖥️ Electron 桌面体验

- **无边框窗口** — 自定义标题栏，集成窗口最小化/最大化/关闭控制。
- **系统托盘** — 最小化到托盘运行，支持托盘菜单快速显示/退出。
- **安全通信** — 通过 `contextBridge` + IPC 实现渲染进程与主进程的安全隔离通信。

## 🛠️ 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Electron 39 + React 19 + TypeScript 5.9 |
| 构建 | Vite 7 + vite-plugin-electron |
| UI | Ant Design 6 + Less |
| 路由 | React Router v7 (HashRouter) |
| 图像处理 | OpenCV.js 4.x |
| 数据导出 | ExcelJS |
| 原生扩展 | C++ Node.js Addon (node-addon-api + node-gyp) |
| 代码规范 | ESLint 9 + typescript-eslint |

## 📁 项目结构

```
Mtools/
├── electron/                  # Electron 主进程 & 预加载
│   ├── main/index.ts          # 主进程入口，窗口 & 托盘管理
│   ├── preload/index.ts       # 预加载脚本，暴露 bridgeApis
│   ├── ipc/index.ts           # IPC 事件处理（进程操作、窗口控制）
│   └── utils/index.ts         # 工具函数（图标提取等）
├── native/                    # C++ 原生扩展（Node Addon）
│   ├── processesInfo/         # 枚举系统进程（Win32 API）
│   ├── cpuInfo/               # 获取进程 & 系统 CPU 时间
│   ├── memoryInfo/            # 获取进程 & 系统内存信息
│   ├── killProcess/           # 终止进程
│   └── descriptionInfo/       # 获取可执行文件描述信息
├── src/                       # React 渲染进程
│   ├── main.tsx               # 应用入口
│   ├── App.tsx                # 根组件，路由配置
│   ├── router/index.tsx       # 路由定义（懒加载）
│   ├── views/
│   │   ├── Home/              # 进程列表主页
│   │   ├── Chart/             # 图表分析页（开发中）
│   │   └── Re-watermark/      # 图像水印修复页
│   ├── components/            # 通用组件
│   │   ├── VirtualList/       # 虚拟滚动列表
│   │   ├── CardPanel/         # 系统数据卡片面板
│   │   ├── HeaderBar/         # 搜索 & 操作栏
│   │   ├── ContextMenu/       # 右键菜单
│   │   ├── TitleBar/          # 自定义标题栏
│   │   ├── MenuBar/           # 侧边导航菜单
│   │   └── SvgIcon/           # SVG 图标组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── utils/                 # 工具函数
│   ├── type/                  # TypeScript 类型定义
│   └── assets/                # 静态资源
├── scripts/                   # 构建脚本（native 重编译等）
├── public/                    # 公共静态文件
└── vite.config.ts             # Vite 配置（Electron 插件等）
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18
- **npm** >= 9
- **Windows** 操作系统（原生 C++ 模块依赖 Win32 API）
- **Visual Studio Build Tools**（用于编译 C++ Addon）

### 安装依赖

```bash
npm install
```

首次安装会自动触发 `postinstall` 脚本，编译 `native/` 下的 C++ 原生模块。

### 开发模式

```bash
npm run dev
```

启动 Vite 开发服务器 + Electron 窗口，支持热更新。

### 构建打包

```bash
npm run build
```

执行 TypeScript 编译 + Vite 生产构建，输出到 `dist/` 和 `dist-electron/`。

### 单独重编译原生模块

```bash
npm run rebuild:native
```

## 🔧 原生模块说明

项目通过 `node-addon-api` 封装了多个 C++ 原生模块，直接调用 Windows API 实现高性能进程信息采集：

- **processesInfo** — 使用 `CreateToolhelp32Snapshot` 遍历进程，`EnumWindows` 识别可见窗口进程
- **cpuInfo** — 通过 `OpenProcess` + `GetProcessTimes` 获取进程 CPU 时间
- **memoryInfo** — 通过 `GetProcessMemoryInfo` + `GlobalMemoryStatusEx` 获取内存数据
- **killProcess** — 通过 `OpenProcess` + `TerminateProcess` 终止进程
- **descriptionInfo** — 通过 `GetFileVersionInfo` 读取可执行文件的描述信息

## 📄 License

MIT
