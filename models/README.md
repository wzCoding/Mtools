# LaMa ONNX 模型

## 下载模型

LaMa (Large Mask Inpainting) 是 Samsung AI 提出的图像修复模型。

### 推荐来源

从 HuggingFace 下载 ONNX 转换版本：

```
https://huggingface.co/Carve/LaMa-ONNX
```

下载 `lama_fp32.onnx` 文件并重命名为 `lama.onnx`，放置在当前目录下。

### 文件路径

```
models/
  └── lama.onnx    ← 下载的模型文件（约 150-200MB）
```

### 模型信息

- 输入: image (1, 3, 512, 512), mask (1, 1, 512, 512)
- 输出: inpainted image (1, 3, 512, 512)
- 格式: ONNX (Open Neural Network Exchange)

### 生产部署

构建 Electron 应用时，将 `models/` 目录配置为 `extraResources`：

```json
// package.json
"build": {
  "extraResources": [
    { "from": "models", "to": "models" }
  ]
}
```

## 备选模型

如果上述链接不可用，可以尝试：

1. https://huggingface.co/timbrooks/instruct-pix2pix
2. https://github.com/advimman/lama (原始 PyTorch 项目，需自行转换为 ONNX)
