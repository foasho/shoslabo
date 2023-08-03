"use client"
import React from "react";
import dynamic from "next/dynamic";
import { Loading2D } from "@/components/commons/Loading2D";
import ClientOnly from "@/client-only";
import AuthProvider from "@/auth.container";

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
  loading: () => <Loading2D />,
});

const Page = ({ params }) => {
  const { blogId } = params;
  const [blog, setBlog] = React.useState<any>(null);

  const getBlog = async (blogId) => {
    const res = await fetch(`/api/blog/get?blogId=${blogId}`);
    return res.json();
  }

  React.useEffect(() => {
    getBlog(blogId).then((data) => {
      setBlog(data);
    });
  }, [blogId]);

  return (
    <div className="w-full h-full bg-slate-200">
      {blog &&
        // @ts-ignore
        <Editor
          initContent={blog.content}
          initTitle={blog.title}
          initKeywords={blog.keywords}
          initDescription={blog.description}
          initThumbnail={blog.image}
          blogId={blog.id}
        />
      }
    </div>
  )
}

export default Page;