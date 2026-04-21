import fs from 'node:fs/promises';
import { put } from '@vercel/blob';
import {
  ensureBlobConfigured,
  getBlobPathname,
  getCatalogAsset,
  getContentType,
  readPrintAssetCatalog,
  resolveSourceAbsolutePath,
  writePrintAssetCatalog,
} from './catalog.mjs';

export async function uploadPrintAsset({ productId, filePath = null, allowOverwrite = true } = {}) {
  if (!productId) {
    throw new Error('productId requis');
  }

  const token = ensureBlobConfigured();
  const catalog = await readPrintAssetCatalog();
  const currentAsset = getCatalogAsset(catalog, productId);
  const sourceFilePath = filePath || currentAsset.sourceFilePath;

  if (!sourceFilePath) {
    throw new Error(`Fichier source introuvable pour ${productId}`);
  }

  const sourceAbsolutePath = resolveSourceAbsolutePath(sourceFilePath);
  const fileBuffer = await fs.readFile(sourceAbsolutePath);
  const blobPathname = getBlobPathname(productId, sourceFilePath, currentAsset.blobPathname);

  const uploaded = await put(blobPathname, fileBuffer, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite,
    contentType: getContentType(sourceFilePath),
    token,
  });

  const updatedCatalog = {
    ...catalog,
    [productId]: {
      ...currentAsset,
      sourceFilePath,
      blobPathname,
      blobUrl: uploaded.url,
    },
  };

  await writePrintAssetCatalog(updatedCatalog);

  return {
    productId,
    blobPathname,
    blobUrl: uploaded.url,
  };
}

export async function uploadPrintAssets(productIds = []) {
  const catalog = await readPrintAssetCatalog();
  const idsToUpload = productIds.length > 0 ? productIds : Object.keys(catalog);
  const uploadedAssets = [];

  for (const productId of idsToUpload) {
    uploadedAssets.push(await uploadPrintAsset({ productId }));
  }

  return uploadedAssets;
}
