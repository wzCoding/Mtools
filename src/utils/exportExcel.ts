import ExcelJS from 'exceljs';
import type { ProcessInfo } from '@/type/index';

/** 递归展开树形结构，所有层级全部平铺（默认全部展开） */
const flattenAll = (list: ProcessInfo[], level: number = 0): ProcessInfo[] => {
    const result: ProcessInfo[] = [];
    for (const item of list) {
        result.push({ ...item, level });
        if (item.children && item.children.length > 0) {
            result.push(...flattenAll(item.children, level + 1));
        }
    }
    return result;
};

/** 列定义 */
interface ColumnDef {
    header: string;
    key: keyof ProcessInfo | 'typeDisplay';
    width: number;
}

const COLUMNS: ColumnDef[] = [
    { header: '名称', key: 'description', width: 28 },
    { header: '类型', key: 'typeDisplay', width: 12 },
    { header: 'CPU', key: 'cpu', width: 12 },
    { header: '内存', key: 'memory', width: 14 },
    { header: '进程', key: 'name', width: 22 },
    { header: 'PID', key: 'pid', width: 12 },
];

/** 获取单元格显示值 */
const getCellValue = (item: ProcessInfo, key: ColumnDef['key']): string | number => {
    switch (key) {
        case 'typeDisplay':
            return item.type === 'app' ? '应用' : '后台程序';
        case 'description':
            // 树形缩进：每级加 3 个空格
            const indent = '   '.repeat(item.level ?? 0);
            const desc = item.description || item.name || '';
            return `${indent}${desc}`;
        case 'cpu':
            return item.cpu != null ? `${(item.cpu as number).toFixed(1)}%` : '0.0%';
        case 'memory':
            return item.memory != null ? `${(item.memory as number).toFixed(1)} MB` : '0.0 MB';
        case 'pid':
            return item.pid ?? '';
        default:
            return (item as any)[key] ?? '';
    }
};

/**
 * 导出进程列表到 Excel 文件，保留树形结构（全部展开）
 */
export const exportToExcel = async (data: ProcessInfo[]): Promise<void> => {
    if (!data || data.length === 0) return;

    const flatList = flattenAll(data);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('进程列表');

    // 设置列宽
    sheet.columns = COLUMNS.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width,
    }));

    // 写入数据行
    flatList.forEach(item => {
        const row: Record<string, string | number> = {};
        for (const col of COLUMNS) {
            row[col.key] = getCellValue(item, col.key);
        }
        sheet.addRow(row);
    });

    // 样式：表头加粗 + 背景色
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' },
    };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 24;

    // 数据行样式
    for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        row.alignment = { vertical: 'middle' };
        // 隔行底色
        if (i % 2 === 0) {
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF2F2F2' },
            };
        }
    }

    // 生成 buffer 并触发下载
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `进程列表_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
