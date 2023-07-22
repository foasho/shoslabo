import type { NextApiRequest, NextApiResponse } from 'next'
import { getBlog } from "@/crud/blog";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { blogId } = req.query;
        if (blogId) {
          const blog = await getBlog(blogId.toString());
          return res.json(blog)
        }
        return res.status(400).json({ message: 'Missing blogId' })
      }
      default:
        break
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message })
  }
}