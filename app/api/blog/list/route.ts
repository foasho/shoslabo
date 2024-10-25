import { NextResponse, NextRequest } from 'next/server';
import { getBlogs } from '@/crud/blog';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    let isAdmin = false;
    const session = await getServerSession(authOptions);
    if (session) {
      isAdmin = (session.user as any).isAdmin;
    }
    // queryに?all=trueがある場合は、すべてのBlogを取得する
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('all');
    if (query === 'true') {
      isAdmin = true; 
    }
    const blogs = await getBlogs(isAdmin);
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ ...error, message: error.message }, { status: 500 });
  }
}