"use client"
import React, { useEffect } from 'react';
import { Props } from "./layout";
import dynamic from 'next/dynamic';

const Preview = dynamic(() => import('@/components/editor/Preview'), {
  ssr: false
});

interface BlogData {
  id: string;

}
async function getData({ blogId }) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
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
  const blogData = await getData({ blogId });
  console.log(blogData);
  const samplehtml = `
    <h1>h1</h1>
    <h2>h2</h2>
    <h3>h3</h3>
    <p>paragraph</p>
    <a href="https://zenn.dev">link</a>
    <img src="https://zenn.dev/images/og.png" />
    <pre><code>code</code></pre>
  `;
  return (
    <div>
      Page: {blogId}
      {/** @ts-ignore */}
      <Preview html={samplehtml} />
    </div>
  );
}

export default Page;