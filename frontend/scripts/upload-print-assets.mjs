import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(frontendRoot, '..');
const catalogPath = path.join(frontendRoot, 'src', 'data', 'printAssetCatalog.json');

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!blobToken) {
  console.error('BLOB_READ_WRITE_TOKEN is missing.');
  console.error('Add it to your environment, then run: npm --prefix frontend run upload:blob-masters');
  process.exit(1);
}

const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));
const updatedCatalog = structuredClone(catalog);

for (const [productId, asset] of Object.entries(catalog)) {
  if (!asset?.sourceFilePath || !asset?.blobPathname) {
    console.warn(`[skip] ${productId}: missing sourceFilePath or blobPathname`);
    continue;
  }

  const sourceAbsolutePath = path.resolve(repoRoot, asset.sourceFilePath);
  const fileBuffer = await fs.readFile(sourceAbsolutePath);

  console.log(`[upload] ${productId} -> ${asset.blobPathname}`);

  const uploaded = await put(asset.blobPathname, fileBuffer, {
    access: 'public',
    allowOverwrite: true,
    addRandomSuffix: false,
    token: blobToken,
  });

  updatedCatalog[productId] = {
    ...asset,
    blobUrl: uploaded.url,
  };

  console.log(`[done] ${productId} -> ${uploaded.url}`);
}

await fs.writeFile(catalogPath, `${JSON.stringify(updatedCatalog, null, 2)}\n`, 'utf8');

console.log('Catalog updated:', catalogPath);
