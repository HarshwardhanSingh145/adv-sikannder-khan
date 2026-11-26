const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let original = code;

  // Replace pure white container/card backgrounds with light olive smoke #E2DDD0 or #DCD7C8
  code = code.replace(/bg-white\/\[0\.03\]/g, 'bg-[#E2DDD0]/90');
  code = code.replace(/bg-white\/\[0\.02\]/g, 'bg-[#E2DDD0]/80');
  code = code.replace(/bg-white\/\[0\.05\]/g, 'bg-[#E2DDD0]');
  code = code.replace(/bg-white\/\[0\.06\]/g, 'bg-[#DCD7C8]');
  code = code.replace(/bg-white\/10/g, 'bg-[#706C61]/15');
  code = code.replace(/bg-white\/5/g, 'bg-[#706C61]/10');
  code = code.replace(/bg-white\/20/g, 'bg-[#706C61]/20');

  // Replace border-white variants with olive smoke borders
  code = code.replace(/border-white\/\[0\.1\]/g, 'border-[#706C61]/25');
  code = code.replace(/border-white\/\[0\.08\]/g, 'border-[#706C61]/20');
  code = code.replace(/border-white\/\[0\.05\]/g, 'border-[#706C61]/15');
  code = code.replace(/border-white\/10/g, 'border-[#706C61]/25');
  code = code.replace(/border-white\/20/g, 'border-[#706C61]/35');
  code = code.replace(/border-white\/30/g, 'border-[#706C61]/40');
  code = code.replace(/border-white\/40/g, 'border-[#706C61]/50');

  // Replace text-white variants with high-contrast readable dark text
  code = code.replace(/text-white\/90/g, 'text-[#221C16]');
  code = code.replace(/text-white\/80/g, 'text-[#221C16]');
  code = code.replace(/text-white\/70/g, 'text-[#382F25]');
  code = code.replace(/text-white\/60/g, 'text-[#524738]');
  code = code.replace(/text-white\/50/g, 'text-[#706C61]');
  code = code.replace(/text-white\/40/g, 'text-[#706C61]');
  code = code.replace(/text-white\/30/g, 'text-[#706C61]/80');
  code = code.replace(/text-white\/20/g, 'text-[#706C61]/60');

  // Specific hover text & bg
  code = code.replace(/hover:text-white\/90/g, 'hover:text-[#221C16]');
  code = code.replace(/hover:text-white/g, 'hover:text-[#221C16]');
  code = code.replace(/hover:bg-white\/5/g, 'hover:bg-[#706C61]/15');
  code = code.replace(/hover:bg-white\/10/g, 'hover:bg-[#706C61]/20');
  code = code.replace(/hover:bg-white\/\[0\.02\]/g, 'hover:bg-[#706C61]/10');
  code = code.replace(/hover:bg-white\/\[0\.03\]/g, 'hover:bg-[#706C61]/15');
  code = code.replace(/hover:bg-white\/\[0\.06\]/g, 'hover:bg-[#DCD7C8]');

  // Standalone text-white in classes (avoiding text-white-something)
  code = code.replace(/text-white(?=[\s"'>])/g, 'text-[#221C16]');

  // Shadows
  code = code.replace(/shadow-black\/40/g, 'shadow-[#524738]/15');

  if (code !== original) {
    fs.writeFileSync(filePath, code);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir('src/components/admin');
