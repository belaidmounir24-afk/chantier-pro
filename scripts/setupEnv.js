import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.argv[2] || 'dev';

const envFiles = {
  dev: '.env.dev',
  staging: '.env.staging',
  production: '.env.production'
};

const envFile = envFiles[env];

if (!envFile) {
  console.error(`❌ Environnement inconnu: ${env}`);
  console.log(`✅ Environnements disponibles: ${Object.keys(envFiles).join(', ')}`);
  process.exit(1);
}

const envPath = path.join(__dirname, '..', envFile);
// For Vite, .env.local overrides .env
const envLocalPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error(`❌ Fichier ${envFile} non trouvé`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(envPath, 'utf8');
  fs.writeFileSync(envLocalPath, content, 'utf8');
  console.log(`✅ Setup terminé: ${env} → .env.local`);
} catch (error) {
  console.error(`❌ Erreur: ${error.message}`);
  process.exit(1);
}
