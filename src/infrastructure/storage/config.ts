import { S3Client, RequestChecksumCalculation, ResponseChecksumValidation } from "@aws-sdk/client-s3"

export const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT!,
  region: process.env.B2_REGION!,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
  requestChecksumCalculation: RequestChecksumCalculation.WHEN_REQUIRED,
  responseChecksumValidation: ResponseChecksumValidation.WHEN_REQUIRED,
})

export const B2_BUCKET = process.env.B2_BUCKET_NAME!
export const B2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_B2_DOMAIN!
