import { NextResponse } from 'next/server';

import { createBlog } from '@/crud/blog';

type Payload = {
  title: string;
  content: string;
  description: string;
  image: string;
  keywords: string;
  status: number;
};

export async function POST(req: Request) {
  try {
    const data: Payload = await req.json();
    const { title, content, description, image, keywords, status } = data;
    if (!title || !content) {
      return NextResponse.json({ message: 'Missing title or content' });
    }
    const blog = await createBlog({
      title,
      content,
      description,
      image,
      keywords,
      status,
    });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ ...error, message: error.message });
  }
}

