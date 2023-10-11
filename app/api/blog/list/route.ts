import { NextResponse } from 'next/server';
import { getBlogs } from '@/crud/blog';
import { getServerSession } from "next-auth/next";
import { options } from "@/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    switch (req.method) {
      case 'GET': {
        let isAdmin = false;
        const session = await getServerSession(options);
        if (session) {
          isAdmin = (session.user as any).isAdmin;
        }
        const blogs = await getBlogs(isAdmin);
        return NextResponse.json(blogs, { status: 200 });
      }
      default:
        break;
    }
  } catch (error) {
    return NextResponse.json({ ...error, message: error.message }, { status: 500 });
  }
}