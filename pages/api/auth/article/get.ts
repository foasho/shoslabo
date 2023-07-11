import type { NextApiRequest, NextApiResponse } from "next";
import { getArticle } from "@/crud/article";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const article = await getArticle(id as string);
  res.status(200).json({ article });
}