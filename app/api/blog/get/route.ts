import { NextResponse } from 'next/server';
import { getBlog } from "@/crud/blog";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');
    if (blogId) {
      const blog = await getBlog(blogId.toString());
      return NextResponse.json(blog);
    }
    return NextResponse.json({ message: 'Missing blogId' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ ...error, message: error.message }, { status: 500 });
  }
}