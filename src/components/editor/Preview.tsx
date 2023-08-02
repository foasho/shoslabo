"use client"
import React from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from "next/dynamic";
import { MdOpenInNew } from 'react-icons/md';
import { SNSLinkPreview } from '../commons/SNSLinkPreview';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className='flex h-96 w-full flex-col items-center justify-center'>
        <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      </div>
    ),
  }
);

const getOGP = async (url: string) => {

}

const Preview = ({ content }: { content: string }) => {

  return (
    <div className="container">
      {/** @ts-ignore */}
      <MDEditor
        className="h-full w-full"
        value={content}
        preview="preview"
        hideToolbar={true}
        fullscreen={true}
        previewOptions={{
          components: {
            a: ({ children, href, node: { properties } }) => {
              // リンク付きの場合は、クリックしたときに別タブで開く
              if (href && href.startsWith('http')) {
                // OGPの画像を表示するために、aタグの中にimgタグを入れる
                return (
                  <SNSLinkPreview text={href} />
                )
              }
              return <a {...properties}>{children.pop()}</a>
            },
          }
        }}
      />
    </div>
  )
}

export default Preview;