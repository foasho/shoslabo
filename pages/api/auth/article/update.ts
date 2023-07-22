import type { NextApiRequest, NextApiResponse } from "next";
import { updateArticle } from "@/crud/blog";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, title, content, keywords } = req.body;
  const article = await updateArticle({
    id,
    title,
    content,
    keywords,
  });
  res.status(200).json({ article });
}