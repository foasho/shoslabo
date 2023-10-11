
import { NextResponse } from 'next/server';
import { uploadFileToS3 } from "@/s3controls";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const file = files[0];
    const fileBuffer =(await file.arrayBuffer()) as Buffer;
    const contentType = file.type || "application/octet-stream";
    const filePath = formData.get("filePath") as string;

    const result = await uploadFileToS3(fileBuffer, contentType, filePath);

    return NextResponse.json({ data: result });

  } catch (error) {
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}