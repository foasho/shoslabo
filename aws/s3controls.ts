import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
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
  return await s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Expires: 60 * 60 * 24, // 24 hour
  });
}

/**
 * ファイルをS3にアップロードする
 */
export const uploadFileToS3 = async (
  file: Buffer,
  contentType: string,
  filePath: string,
  saveType: string | null = null
): Promise<S3.ManagedUpload.SendData> => {
  const params: S3.PutObjectRequest = {
    Bucket: (saveType && saveType == "public") ? process.env.S3_BUCKET_PUBLIC_NAME! : process.env.S3_BUCKET_NAME!,
    Key: filePath,
    Body: file,
    ContentType: contentType,
  };

  const signedUrl = await getSingedUrl(filePath);

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data: any) => {
      if (err) {
        reject(err);
      } else {
        data.signedUrl = signedUrl;
        resolve(data);
      }
    });
  });
};

/**
 * JSONファイルをS3にアップロードする
 */
export const uploadJsonToS3 = async (
  jsonObject: any,
  filePath: string,
  saveType: string | null = null
): Promise<S3.ManagedUpload.SendData> => {
  const file = Buffer.from(JSON.stringify(jsonObject));
  return uploadFileToS3(file, 'application/json', filePath, saveType);
};