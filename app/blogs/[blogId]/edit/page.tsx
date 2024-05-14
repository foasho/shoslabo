"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Loading2D } from "@/components/commons/Loading2D";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
  loading: () => <Loading2D />,
});

const Page = ({ params }) => {
  const { blogId } = params;
  const [blog, setBlog] = React.useState<any>(null);

  const getBlog = async (blogId: string) => {
    const res = await fetch(`/api/blog/get?blogId=${blogId}`);
    return res.json();
  };

  React.useEffect(() => {
    getBlog(blogId).then((data) => {
      setBlog(data);
    });
  }, [blogId]);

  console.log(blog);

  return (
    <div className='h-full w-full bg-slate-200'>
      {blog && (
        // @ts-ignore
        <Editor
          initContent={blog.content}
          initTitle={blog.title}
          initKeywords={blog.keywords}
          initDescription={blog.description}
          initThumbnail={blog.image}
          blogId={blog.id}
          initStatus={blog.status}
        />
      )}
    </div>
  );
};

export default Page;
