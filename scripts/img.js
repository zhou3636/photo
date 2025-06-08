const fs = require('fs');
const path = require('path');

// 配置项
const IMG_DIR = path.join('dist/img'); // 图片目录路径
const OUTPUT_FILE = path.join(IMG_DIR, 'img.json'); // 输出文件路径
const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.jfif', '.png', '.gif', '.webp', '.bmp']; // 支持的图片格式

/**
 * 从文件名解析日期和标题
 * 支持格式示例: "2025-01-01草神.jpg" -> { date: "2025-01-01", title: "草神" }
 */
function parseFilename(filename) {
    // 正则匹配: 日期部分(YYYY-MM-DD) + 标题 + 扩展名
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})([^\.]+)(\..+)$/);
    if (!match) {
        console.warn(`[警告] 文件名格式不符合要求: ${filename}`);
        return {
            date: '',
            title: path.parse(filename).name // 无日期时使用整个文件名(不含扩展名)
        };
    }
    return {
        date: match[1], // 日期部分
        title: match[2].trim() // 标题部分(去除前后空格)
    };
}

/**
 * 主函数
 */
function generateImageManifest() {
    try {
        // 1. 读取img目录
        const files = fs.readdirSync(IMG_DIR);

        // 2. 过滤图片文件并处理
        const result = files
            .filter(file => IMG_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => {
                const { date, title } = parseFilename(file);
                return {
                    file,
                    title,
                    date
                };
            })
            .sort((a, b) => b.date.localeCompare(a.date));

        // 3. 写入JSON文件
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
        console.log(`成功生成 ${result.length} 个图片信息到 ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('出错:', error.message);
    }
}

// 执行
generateImageManifest();