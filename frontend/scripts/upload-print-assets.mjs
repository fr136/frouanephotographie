import { uploadPrintAsset, uploadPrintAssets } from '../server/blob/upload-print-asset.mjs';

const productId = process.argv[2];

try {
  if (productId) {
    const uploadedAsset = await uploadPrintAsset({ productId });
    console.log(`[done] ${uploadedAsset.productId} -> ${uploadedAsset.blobUrl}`);
  } else {
    const uploadedAssets = await uploadPrintAssets();
    for (const uploadedAsset of uploadedAssets) {
      console.log(`[done] ${uploadedAsset.productId} -> ${uploadedAsset.blobUrl}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
