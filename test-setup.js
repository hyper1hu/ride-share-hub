#!/usr/bin/env node

/**
 * Project Setup Verification Script
 * Validates that the project is properly configured and ready for development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking project setup...\n');

// Check Node.js version
const nodeVersion = process.version;
const requiredNodeVersion = '22.0.0';
const currentVersion = nodeVersion.replace('v', '');

console.log(`✅ Node.js version: ${nodeVersion}`);

// Verify major version
const [major] = currentVersion.split('.').map(Number);
const [requiredMajor] = requiredNodeVersion.split('.').map(Number);

if (major < requiredMajor) {
  console.error(`❌ Node.js version ${requiredNodeVersion} or higher is required`);
  process.exit(1);
}

// Check if dependencies are installed
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.error('❌ Dependencies not installed. Run: npm install');
  process.exit(1);
}

console.log('✅ Dependencies installed');

// Check if required directories exist
const requiredDirs = ['client', 'server', 'shared', 'script'];
let allDirsExist = true;

for (const dir of requiredDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ Directory exists: ${dir}/`);
  } else {
    console.error(`❌ Missing directory: ${dir}/`);
    allDirsExist = false;
  }
}

if (!allDirsExist) {
  process.exit(1);
}

// Check for required configuration files
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'client/vite.config.ts',
  'tailwind.config.ts',
  'drizzle.config.ts'
];

let allFilesExist = true;

for (const file of requiredFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Configuration file exists: ${file}`);
  } else {
    console.error(`❌ Missing configuration file: ${file}`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  process.exit(1);
}

// Check environment file
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Environment file (.env) exists');
} else {
  console.warn('⚠️  No .env file found. Copy .env.example to .env if needed');
}

console.log('\n✅ All checks passed! Project setup is valid.');
console.log('\n📋 Available commands:');
console.log('  npm run dev       - Start development server');
console.log('  npm run build     - Build for production');
console.log('  npm run db:push   - Push database schema');
console.log('  npm run db:seed   - Seed database with sample data');

process.exit(0);
