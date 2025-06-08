const fs = require('fs');
const path = require('path');

// 配置文件路径
const txt_DIR = path.join('./dist/img');   // 文件存放目录
const OUTPUT_FILE = path.join(txt_DIR, 'img.json'); // 输出文件路径

// 解析.txt文件内容
function parsetxtFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').map(line => line.trim());
        
        // 直接取前5行（保留空行位置）
        const effectiveLines = lines.slice(0, 4);
        const [
            tittle,
            a1,
            a2,
            date,
            
        ] = effectiveLines;
        
        // 获取文件名并去掉.txt扩展名
        // const fileName = path.basename(filePath, '.txt');
        
        return {
            file: path.basename(filePath),
            tittle: tittle || '标题',
            a1: a1 || '#',
            a2: a2 || '#',
            date: date || '2020-01-01',
        };
    } catch (error) {
        console.error(`解析文件失败: ${filePath}`, error);
        return null;
    }
}
// 生成文件列表
function imgList() {
    try {
        // 获取所有.txt文件
        const files = fs.readdirSync(txt_DIR)
            .filter(f => f.endsWith('.txt'))
            .map(f => path.join(txt_DIR, f));
        
        // 解析所有文件
        const result = files
            .map(parsetxtFile)
            .sort((a, b) => b.date.localeCompare(a.date))
            .filter(Boolean); // 过滤解析失败的文件
        
        // 写入JSON文件
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
        console.log(`成功生成 ${result.length} 个文件列表到 ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('生成文件列表失败:', error);
        process.exit(1);
    }
}

// 执行生成
imgList();