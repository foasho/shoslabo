import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

/**
 * パブリックURLを取得する
 * @returns 
 */
export const publicUrl = (key: string) => {
  let url = key;
  if (!url) return "";
  // "//"の重複を防ぐ
  if (url.startsWith("/")) {
    url = url.slice(1);
  }
  const _url = `${process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL}${url}`;
  const decodeUrl = decodeURIComponent(_url);
  return decodeUrl;
};

/**
 * プライベートURLを取得する
 */
export const getSingedUrl = async (key: string) => {
  const command = new GetObjectCommand({ Bucket: process.env.S3_BUCKET_NAME as string, Key: key });
  const src = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return src;
}

/**
 * ファイルをS3にアップロードする
 */
export const uploadFileToS3 = async (
  file: Buffer,
  contentType: string,
  filePath: string,
): Promise<any> => {
  try {
    await s3.send(new PutObjectCommand({ 
      Bucket: process.env.S3_BUCKET_NAME as string, 
      Key: filePath, 
      Body: file
    }));
  }
  catch (error) {
    console.error("error: ", error);
  }


  const signedUrl = await getSingedUrl(filePath);

  return {
    signedUrl: signedUrl,
    publicUrl: publicUrl(filePath),
  }
};