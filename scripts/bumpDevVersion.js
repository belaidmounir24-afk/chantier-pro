import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env.dev');

if (!fs.existsSync(envPath)) {
  console.error('❌ Fichier .env.dev non trouvé');
  process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');

// Extraire version actuelle
const versionMatch = content.match(/VITE_APP_VERSION=1\.0\.0-dev\.(\d+)/);
if (!versionMatch) {
  console.error('❌ Format version DEV non trouvé');
  process.exit(1);
}

const currentNum = parseInt(versionMatch[1], 10);
const newNum = currentNum + 1;
const newVersion = `1.0.0-dev.${newNum}`;

// Remplacer
content = content.replace(
  /VITE_APP_VERSION=1\.0\.0-dev\.\d+/,
  `VITE_APP_VERSION=${newVersion}`
);

fs.writeFileSync(envPath, content, 'utf8');
console.log(`✅ Version DEV bump: ${newVersion}`);
