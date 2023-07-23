
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable, { File } from "formidable";
import { uploadFileToS3 } from "@/s3controls";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = await new Promise<{ file: File; fields: formidable.Fields }>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ file: files.file as File, fields });
        });
      });
      const contentType = data.file.mimetype || "application/octet-stream";
      const filePath = data.fields.filePath as string;
      const fileBuffer = await fs.promises.readFile(data.file.filepath);
      const result = await uploadFileToS3(fileBuffer, contentType, filePath);
      res.status(200).json({ message: "File uploaded successfully", data: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error uploading file" });
    }
  } else {
    res.status(405).json({ error: "Only POST method is allowed" });
  }
}