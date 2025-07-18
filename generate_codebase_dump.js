const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    // Skip node_modules, .git, .next, and other build/generated directories
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', '.yarn', '__tests__'].includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      // Only include relevant file types
      const ext = path.extname(file).toLowerCase();
      const relevantExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md', '.txt', '.yml', '.yaml', '.html'];
      
      if (relevantExtensions.includes(ext) || file === 'package.json' || file === 'tailwind.config.js' || file === 'next.config.js') {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Function to get file content with proper formatting
function getFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    return `// Error reading file: ${error.message}`;
  }
}

// Main function to generate the codebase dump
function generateCodebaseDump() {
  const rootDir = process.cwd();
  const outputFile = `CrankSmith_Codebase_Dump_${new Date().toISOString().slice(0, 19).replace(/:/g, '')}.txt`;
  
  console.log('🔍 Scanning codebase...');
  const allFiles = getAllFiles(rootDir);
  
  console.log(`📁 Found ${allFiles.length} files to process`);
  
  let output = '';
  output += '='.repeat(80) + '\n';
  output += 'CRANKSMITH CODEBASE DUMP\n';
  output += `Generated: ${new Date().toISOString()}\n`;
  output += '='.repeat(80) + '\n\n';
  
  // Sort files for consistent output
  allFiles.sort().forEach((filePath, index) => {
    const relativePath = path.relative(rootDir, filePath);
    const content = getFileContent(filePath);
    
    output += `\n${'='.repeat(60)}\n`;
    output += `FILE ${index + 1}: ${relativePath}\n`;
    output += `${'='.repeat(60)}\n\n`;
    output += content;
    output += '\n';
    
    console.log(`📄 Processed: ${relativePath}`);
  });
  
  output += '\n' + '='.repeat(80) + '\n';
  output += 'END OF CODEBASE DUMP\n';
  output += '='.repeat(80) + '\n';
  
  // Write to file
  fs.writeFileSync(outputFile, output, 'utf8');
  
  console.log(`\n✅ Codebase dump generated successfully!`);
  console.log(`📄 Output file: ${outputFile}`);
  console.log(`📊 Total files processed: ${allFiles.length}`);
  console.log(`📏 File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
  
  return outputFile;
}

// Run the script
if (require.main === module) {
  try {
    const outputFile = generateCodebaseDump();
    console.log(`\n🎉 Codebase dump complete! Check: ${outputFile}`);
  } catch (error) {
    console.error('❌ Error generating codebase dump:', error);
    process.exit(1);
  }
}

module.exports = { generateCodebaseDump };