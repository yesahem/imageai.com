export const config = {
  port: process.env.PORT || 4000,
  r2: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
    bucket: process.env.BUCKET_NAME!,
    endpoint: process.env.R2_ENDPOINT!,
  },
  webhookUrl: process.env.WEBHOOK_URL!,
  falApiKey: process.env.FAL_KEY!,
};
