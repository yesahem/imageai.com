import { S3Client } from "bun";
import { config } from "../config";

export class StorageService {
  generatePresignedUrl(key: string): string {
    // Don't specify 'type' to avoid Content-Type in signature
    const presignedUrl = S3Client.presign(key, {
      method: "PUT",
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey,
      bucket: config.r2.bucket,
      endpoint: config.r2.endpoint,
      expiresIn: 3600,
      // NO 'type' parameter - this avoids signing Content-Type
    });

    console.log("Generated presigned URL for key:", key);
    console.log("Presigned URL:", presignedUrl);

    return presignedUrl;
  }

  generateStorageKey(prefix: string = "models"): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000000000000);
    return `${prefix}/${timestamp}_${random}.zip`;
  }
}

export const storageService = new StorageService();
