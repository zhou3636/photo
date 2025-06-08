// generate-thumbnails.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateThumbnails() {
  const inputDir = path.join('./dist/img');   // 文件存放目录;
  const outputDir = path.join('./dist/img2');   // 文件存放目录;
  
  console.log('🚀 开始生成缩略图...');
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 获取所有图片文件
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp|jfif)$/i.test(file)
  );
  
  console.log(`找到 ${imageFiles.length} 张图片`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    try {
      await sharp(inputPath)
        .resize(400, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 75,
          progressive: true
        })
        .toFile(outputPath);
        
      console.log(`✓ ${file}`);
    } catch (error) {
      console.error(`✗ ${file}: ${error.message}`);
    }
  }
  
  console.log('✅ 缩略图生成完成！');
}

generateThumbnails().catch(console.error);