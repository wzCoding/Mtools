import { app } from 'electron';

const defaultIconUrl = '';
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
        return defaultIconUrl;
    }
}

export {
    getAppIconByPath
}

