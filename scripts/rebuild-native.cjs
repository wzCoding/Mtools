const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. 获取路径配置
const rootDir = path.resolve(__dirname, '..');
const nativeDir = path.join(rootDir, 'native');

// 提取用户传递的模块名参数
// 例如: node scripts/rebuild-native.js moduleA moduleB
// process.argv 前两个是 node路径 和 脚本路径，切掉它们
const targetModules = process.argv.slice(2).filter(arg => !arg.startsWith('-'));
console.log(`\x1b[36m[Info] Target modules from args: ${targetModules.join(', ') || 'None'}\x1b[0m`);
// 2. 自动检测 Electron 版本
// 确保原生模块版本与 Electron 运行时版本严格匹配
let electronVersion;
try {
    // 从 node_modules/electron/package.json 读取版本
    const electronPkg = require(path.join(rootDir, 'node_modules', 'electron', 'package.json'));
    electronVersion = electronPkg.version;
    console.log(`\x1b[36m[Info] Detected Electron version: ${electronVersion}\x1b[0m`);
} catch (e) {
    console.error('\x1b[31m[Error] Could not detect Electron version. Is electron installed?\x1b[0m');
    process.exit(1);
}

// 3. 定义 node-gyp 命令路径 (Windows下是 .cmd)
const nodeGypBin = path.join(rootDir, 'node_modules', '.bin', process.platform === 'win32' ? 'node-gyp.cmd' : 'node-gyp');

// 4. 扫描 native 目录下的所有模块
if (!fs.existsSync(nativeDir)) {
    console.log('[Info] No native directory found.');
    process.exit(0);
}

let modules = fs.readdirSync(nativeDir).filter(dir => {
    // 只保留目录，且目录下必须有 binding.gyp
    const modulePath = path.join(nativeDir, dir);
    return fs.statSync(modulePath).isDirectory() && fs.existsSync(path.join(modulePath, 'binding.gyp'));
});

// 如果用户指定了目标模块，进行筛选
if (targetModules.length > 0) {
    console.log(`\x1b[33m[Filter] User requested to build only: ${targetModules.join(', ')}\x1b[0m`);

    modules = modules.filter(modName => {
        // 支持精确匹配或包含匹配
        const isMatch = targetModules.some(target =>
            modName === target || modName.toLowerCase().includes(target.toLowerCase())
        );
        return isMatch;
    });

    if (modules.length === 0) {
        console.error(`\x1b[31m[Error] No matching modules found for inputs: ${targetModules.join(', ')}\x1b[0m`);
        console.error(`Available modules: ${fs.readdirSync(nativeDir).join(', ')}`);
        process.exit(1);
    }
}

if (modules.length === 0) {
    console.log('[Info] No native modules found to build.');
    process.exit(0);
}

// 4. 执行构建
console.log(`\x1b[32m[Start] Building ${modules.length} modules: ${modules.join(', ')}\x1b[0m\n`);

let hasError = false;
modules.forEach(mod => {
    const modulePath = path.join(nativeDir, mod);
    console.log(`\x1b[34m---> Building [${mod}]...\x1b[0m`);

    try {
        // 组装命令
        // --target: Electron 版本
        // --arch: CPU 架构 (通常是 x64)
        // --dist-url: Electron 头文件下载地址
        const cmd = `"${nodeGypBin}" rebuild --target=${electronVersion} --arch=x64 --dist-url=https://electronjs.org/headers`;

        // 执行命令
        execSync(cmd, {
            cwd: modulePath, // 切换到模块目录执行
            stdio: 'inherit', // 将子进程的输出直接打印到控制台
            env: process.env  // 继承当前环境变量
        });

        console.log(`\x1b[32m---> Success: [${mod}]\x1b[0m\n`);
    } catch (error) {
        console.error(`\x1b[31m---> Failed: [${mod}]\x1b[0m\n`);
        hasError = true;
        // 这里不退出，尝试继续编译其他模块
    }
});

// 5. 最终汇总
if (hasError) {
    console.error('\x1b[31m[Done] Some modules failed to build. Check logs above.\x1b[0m');
    process.exit(1);
} else {
    console.log('\x1b[32m[Done] All target modules built successfully!\x1b[0m');
}