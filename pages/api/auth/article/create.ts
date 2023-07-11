import type { NextApiRequest, NextApiResponse } from "next";
import { createArticle } from "@/crud/article";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content, keywords } = req.body;
  const article = await createArticle({
    title,
    content,
    keywords,
  });
  res.status(200).json({ article });
}