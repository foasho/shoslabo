import type { NextApiRequest, NextApiResponse } from "next";
import { deleteArticle } from "@/crud/blog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  await deleteArticle(id as string);
  res.status(200).json({});
}