import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogs } from '@/crud/blog';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const blogs = await getBlogs();
        return res.json(blogs);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}