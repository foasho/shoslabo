import type { NextApiRequest, NextApiResponse } from 'next';

import { createBlog } from '@/crud/blog';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { title, content, description, image, keywords } = req.body;
        if (!title || !content) {
          return res.status(400).json({ message: 'Missing title or content' });
        }
        const blog = await createBlog({
          title,
          content,
          description,
          image,
          keywords,
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