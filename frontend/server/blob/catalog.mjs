import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const frontendRoot = path.resolve(__dirname, '..', '..');
export const repoRoot = path.resolve(frontendRoot, '..');
export const catalogPath = path.join(repoRoot, 'server', 'catalog', 'printAssetCatalog.private.json');
export const backendEnvPath = path.join(repoRoot, 'backend', '.env');

function parseDotEnv(rawContent) {
  const parsed = {};

  for (const rawLine of rawContent.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (!value) {
      parsed[key] = '';
      continue;
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      const inlineCommentIndex = value.indexOf(' #');
      if (inlineCommentIndex >= 0) {
        value = value.slice(0, inlineCommentIndex).trim();
      }
    }

    parsed[key] = value;
  }

  return parsed;
}

function loadUploadEnvironment() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return;
  }

  if (!fsSync.existsSync(backendEnvPath)) {
    return;
  }

  const rawEnv = fsSync.readFileSync(backendEnvPath, 'utf8');
  const parsedEnv = parseDotEnv(rawEnv);

  for (const [key, value] of Object.entries(parsedEnv)) {
    if (!process.env[key] && value != null) {
      process.env[key] = value;
    }
  }
}

export function ensureBlobConfigured() {
  loadUploadEnvironment();
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    const error = new Error('Vercel Blob non configuré');
    error.code = 'BLOB_NOT_CONFIGURED';
    throw error;
  }

  return token;
}

export async function readPrintAssetCatalog() {
  const rawCatalog = await fs.readFile(catalogPath, 'utf8');
  return JSON.parse(rawCatalog);
}

export async function writePrintAssetCatalog(catalog) {
  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
}

export function getCatalogAsset(catalog, productId) {
  const asset = catalog[productId];

  if (!asset) {
    const error = new Error(`Produit inconnu dans le catalogue Blob: ${productId}`);
    error.code = 'UNKNOWN_PRODUCT';
    throw error;
  }

  return asset;
}

export function getBlobPathname(productId, sourceFilePath, existingPathname) {
  if (existingPathname?.startsWith('prints/')) {
    return existingPathname;
  }

  const extension = path.extname(sourceFilePath || '').toLowerCase() || '.jpg';
  return `prints/${productId}${extension}`;
}

export function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

export function resolveSourceAbsolutePath(sourceFilePath) {
  return path.resolve(repoRoot, sourceFilePath);
}
