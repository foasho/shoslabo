import type { NextApiRequest, NextApiResponse } from 'next';

import { updateBlog } from '@/crud/blog';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { blogId } = req.query;
        const { title, content, description, image, keywords, status } = req.body;
        if (!title || !content) {
          return res.status(400).json({ message: 'Missing title or content' });
        }
        const blog = await updateBlog({
          id: blogId as string,
          title,
          content,
          description,
          image,
          keywords,
          status,
        });
        return res.json(blog);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}