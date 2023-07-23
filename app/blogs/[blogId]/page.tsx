import React, { useEffect } from 'react';
import { Props } from "./layout";
import dynamic from 'next/dynamic';

const Preview = dynamic(() => import('@/components/editor/Preview'), {
  ssr: false
});

const getBlog = async ({ blogId }): Promise<any> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/get?blogId=${blogId}`, {
    next: {
      revalidate: 30,
    }
  });
  return res.json();
}

const Page = async ({
  params
}: Props) => {
  const { blogId } = params;
  const blog = await getBlog({ blogId });
  return (
    <div>
      {/** タイトル */}
      <div 
        className="text-3xl font-bold text-center"
      >
        {blog.title}
      </div>
      {/** タグ */}
      <div
        className="text-center"
      >
        {blog.keywords.split(",").map((keyword, idx) => {
          return (
            <span key={`kw-${idx}`}>
              {keyword}
            </span>
          )
        })}
      </div>

      {/** @ts-ignore */}
      <Preview content={blog.content} />
    </div>
  );
}

export default Page;