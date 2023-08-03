"use client"
import React, { useEffect, useMemo } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from "next/dynamic";
import { SNSLinkPreview } from '../commons/SNSLinkPreview';
import { FiBox } from 'react-icons/fi';

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
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

/**
 * Color
 */
const COLOR = {
  primary: '#0099cc',
  secondary: '#66cccc',
  third: '#808080',
  strong: '#FFA500',
}


/**
 * プレビュー
 */
const Preview = ({ blog }: { blog: any }) => {

  // blog.content(Markdown)の中身ヘッダーおよびサブヘッダーのツリー構造を作成する
  const createHeaderTree = useMemo(() => {
    const headerTree: any[] = [];
    const lines = blog.content.split('\n');
    // Codeの記述は無視する ```で囲まれた部分は無視する
    let isCode = false;
    const withoutLines = lines.filter((line) => {
      if (line.startsWith('```')) {
        isCode = !isCode;
      }
      return !isCode;
    });

    let currentHeader: any;
    if (blog) {
      withoutLines.forEach((line) => {
        // #の数でヘッダーのレベルを判定し、##までchildrenに格納する
        const headerLevel = line.match(/^#+/);
        if (headerLevel) {
          const header = line.replace(/^#+/, '').trim();
          if (headerLevel[0].length === 1) {
            currentHeader = {
              header,
              children: [],
            };
            headerTree.push(currentHeader);
          } else if (headerLevel[0].length === 2) {
            currentHeader.children.push({
              header,
            });
          }
        }
      });
    }
    return headerTree;
  }, [blog]);

  return (
    <div className="container mx-auto pt-12">
      <div className="md:w-3/4 w-full md:inline-block">
        <div className='w-[90%] mx-auto my-3'>
          {/** サムネイル画像 */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full px-1 py-3 mb-2 max-h-64 object-cover object-center"
          />
          <div className="py-4">
            {/** タイトル */}
            <div
              className="text-3xl font-bold my-3"
            >
              {blog.title}
            </div>
            {/** タグ */}
            <div
              className="py-2 text-sm text-gray-500 "
            >
              {blog.keywords.split(",").map((keyword, idx) => {
                return (
                  <span key={`kw-${idx}`} className='px-2 py-1 mx-1 rounded-xl bg-yellow-300 text-gray-500 text-bold'>
                    {keyword}
                  </span>
                )
              })}
            </div>
            {/** 作成日時 */}
            <div
              className="text-sm text-gray-500 mx-2"
            >
              {blog.createdAt.split("T")[0]}
            </div>
          </div>
        </div>
        <div className='w-[90%] mx-auto mb-12'>
          {/** @ts-ignore */}
          <MarkdownPreview
            wrapperElement={
              {
                "data-color-mode": "light"
              }
            }
            source={blog.content}
            components={
              {
                p: ({ children }) => (
                  <>
                    {children.map((p, i) => {
                      if (typeof p === 'string') {
                        const splitP = p.split('\n')
                        return splitP.map((p, j) => <p key={`${p}${i}_${j}`} className={"pl-3"}>{p}</p>)
                      }
                      return <p
                        key={`${p}${i}`}
                        className={"pl-3"}
                      >
                        {p}
                      </p>
                    })}
                  </>
                ),
                a: ({ children, href, node: { properties } }) => {
                  // リンク付きの場合は、OGPを表示する
                  if (href && href.startsWith('http')) {
                    return (
                      <>
                        <SNSLinkPreview text={href} />
                      </>
                    )
                  }
                  return <a {...properties}>{children.pop()}</a>
                },
                br: ({ children }) => {
                  return <>{children}<br /></>
                },
                h1: ({ children }) => {
                  return (
                    <div
                      className={`text-3xl text-bold py-7 text-[${COLOR.primary}] !border-none`}
                      style={{
                        color: COLOR.primary,
                        fontWeight: 'bold',
                      }}
                    >
                      <div className="inline-block animate-slowspin mr-2">
                        <FiBox size={16} />
                      </div>
                      <div className="inline-block">
                        {children}
                      </div>
                    </div>
                  )
                },
                h2: ({ children }) => {
                  return (
                    <div
                      className={`text-2xl text-bold py-3 text-[${COLOR.secondary}] !border-none`}
                      style={{
                        color: COLOR.secondary,
                        fontWeight: 'bold',
                      }}
                    >
                      {children}
                    </div>
                  )
                },
                h3: ({ children }) => {
                  return (
                    <div
                      className={`text-xl text-bold pl-3 py-2 text-[${COLOR.third}] !border-none`}
                      style={{
                        color: COLOR.third,
                        fontWeight: 'bold',
                      }}
                    >
                      {children}
                    </div>
                  )
                },
                strong: ({ children }) => {
                  return (
                    <strong
                      style={{
                        color: COLOR.strong,
                        fontWeight: 'bold',
                      }}
                    >
                      {children}
                    </strong>
                  )
                },

              }
            }
          />
        </div>
      </div>
      <div
        className="md:w-1/4 md:inline-block hidden fixed z-10 right-2 bottom-2"
      >
        <div className="px-2 py-4">
          {/** ツリー構造のナビゲーション */}
          <div className="text-xl font-bold mb-4" style={{ color: COLOR.third }}>
            目次
          </div>
          <div className="text-sm">
            {createHeaderTree.map((header, idx) => {
              return (
                <div key={`header-${idx}`}>
                  <div className="mb-2">
                    <a href={"#" + header.header} style={
                      {
                        color: COLOR.primary,
                      }
                    }>
                      {header.header}
                    </a>
                  </div>
                  {header.children.map((child, idx) => {
                    return (
                      <div key={`child-${idx}`} className="ml-4 mb-2">
                        <a
                          href={"#" + child.header}
                          style={
                            {
                              color: COLOR.secondary
                            }
                          }
                        >
                          {child.header}
                        </a>
                      </div>
                    )
                  })}
                </div>
              )
            }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview;