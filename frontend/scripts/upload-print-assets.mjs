import { uploadPrintAsset, uploadPrintAssets } from '../server/blob/upload-print-asset.mjs';

const productId = process.argv[2];
const filePath = process.argv[3] || null;

try {
  if (productId) {
    const uploadedAsset = await uploadPrintAsset({ productId, filePath });
    console.log(`[done] ${uploadedAsset.productId} -> ${uploadedAsset.blobPath}`);
  } else {
    const uploadedAssets = await uploadPrintAssets();
    for (const uploadedAsset of uploadedAssets) {
      console.log(`[done] ${uploadedAsset.productId} -> ${uploadedAsset.blobPath}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
