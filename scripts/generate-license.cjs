#!/usr/bin/env node
/**
 * ChantierPro - Private Key Generator for Publisher / Owner
 * Usage: node scripts/generate-license.cjs [annual|lifetime] [Client_Name]
 */

const SALT = 'CHANTIERPRO_2026_BTP_SECURE_SALT';
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function computeChecksum(prefix, seed) {
  const combined = `${prefix}_${seed}_${SALT}`;
  const hash = simpleHash(combined);
  let res = '';
  let temp = hash;
  for (let i = 0; i < 4; i++) {
    const index = temp % CHARS.length;
    res += CHARS[index];
    temp = Math.floor(temp / CHARS.length) + (i * 7);
  }
  return res;
}

function generateKey(type = 'lifetime', clientRef = 'CLIENT') {
  const typeCode = type.toLowerCase() === 'annual' ? 'ANN' : 'LIFE';
  const rawRef = clientRef.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'BTP';
  const seed1 = (rawRef + '7892').slice(0, 4).padEnd(4, 'X');
  
  let seed2 = '';
  for (let i = 0; i < 4; i++) {
    seed2 += CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  const payload = `${seed1}-${seed2}`;
  const checksum = computeChecksum(typeCode, payload);

  return `CP-${typeCode}-${seed1}-${seed2}-${checksum}`;
}

// CLI arguments
const typeArg = process.argv[2] || 'lifetime';
const clientArg = process.argv[3] || 'CLIENT_BTP';

const key = generateKey(typeArg, clientArg);
console.log('\n=============================================');
console.log('🏗️  CHANTIERPRO - CLÉ OFFICIELLE ÉDITEUR');
console.log('=============================================');
console.log(`Type:     ${typeArg === 'annual' ? 'Licence Annuelle (1 An)' : 'Licence À Vie (Illimitée)'}`);
console.log(`Client:   ${clientArg}`);
console.log(`Clé:      ${key}`);
console.log('=============================================\n');
