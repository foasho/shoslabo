import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogs } from '@/crud/blog';
import { getSession } from "next-auth/react";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        let isAdmin = false;
        const session = await getSession(
          { req }
        );
        if (session) {
          isAdmin = (session.user as any).isAdmin;
        }
        const blogs = await getBlogs(isAdmin);
        return res.json(blogs);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}