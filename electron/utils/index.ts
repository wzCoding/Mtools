import path from 'path';
import fs from 'fs';
import { app } from 'electron';

const defaultIconPath = path.join(app.getAppPath(), 'public', 'app.png');
const defaultIconData = fs.readFileSync(defaultIconPath).toString('base64');
const defaultIconUrl = `data:image/png;base64,${defaultIconData}`;
async function getAppIconByPath(appPath: string) {

    if (!appPath) {
        return defaultIconUrl;
    }

    try {
        const icon = await app.getFileIcon(appPath, { size: 'normal' });
        const dataUrl = icon.toDataURL();

        return dataUrl;
    } catch (error) {
        console.error(`无法获取图标: ${appPath}`, error);
        return defaultIconUrl; // 获取失败返回默认图标
    }
}

export {
    getAppIconByPath
}

