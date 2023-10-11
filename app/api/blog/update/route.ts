import { NextResponse } from 'next/server';
import { updateBlog } from '@/crud/blog';

export async function POST(req: Request) {
  try {
    switch (req.method) {
      case 'POST': {
        const { searchParams } = new URL(req.url);
        const blogId = searchParams.get('blogId');
        const { title, content, description, image, keywords, status } = await req.json();
        if (!title || !content) {
          return NextResponse.json({ message: 'Missing title or content' }, { status: 400 });
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
        return NextResponse.json(blog, { status: 200 });
      }
      default:
        break;
    }
  } catch (error) {
    return NextResponse.json({ ...error, message: error.message }, { status: 500 });
  }
}