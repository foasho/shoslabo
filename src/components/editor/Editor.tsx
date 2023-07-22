"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import { commands, ICommand, TextState } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { MdOpenInNew } from "react-icons/md"
import { BsBoxes, BsCodeSlash, BsLayoutSplit } from "react-icons/bs";
import mermaid from 'mermaid'
import plantumlEncoder from 'plantuml-encoder'
import dynamic from "next/dynamic";

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

enum ViewType {
  Preview = 'preview',
  Edit = 'edit',
  Live = 'live',
}

const randomSeedStr = (seed: number = 19382721): string => {
  const x = Math.sin(seed) * 10000
  return String(x - Math.floor(x))
}

const Editor = ({
  initContent = undefined,
  viewType = ViewType.Live,
}: {
  initContent: string | undefined | null,
  viewType: ViewType
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [content, setContent] = useState(initContent || '');

  const onChangeEditor = (value?: string) => {
    if (value !== undefined) {
      setContent(value)
    }
  }

  return (
    <div
      className={"container mx-auto md:px-8 px-20 relative h-screen"}
      data-color-mode={'light'}
    >
      <div className="absolute top-0 left-1/2 w-full">
        {/** タイトル入力 */}
        <div className="relative mb-3" data-te-input-wrapper-init>
          <input
            type="text"
            className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            id="exampleFormControlInput2"
            placeholder="Form control lg" />
          <label
            htmlFor="exampleFormControlInput2"
            className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
          >
            タイトル
          </label>
        </div>
        {/** サムネイルアップロード */}
        {/** タグ入力(任意) */}
        {/** 説明入力(任意) */}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full">
        {/** @ts-ignore */}
        <MDEditor
          className="min-h-[78vh]"
          value={content}
          onChange={onChangeEditor}
          preview={viewType}
          hideToolbar={viewType === ViewType.Preview}
          visibleDragbar={false}
          previewOptions={{
            components: {
              code: Code,
              p: ({ children }) => (
                <>
                  {children.map((p, i) => {
                    if (typeof p === 'string') {
                      const splitP = p.split('\n')
                      return splitP.map((p, j) => <p key={`${p}${i}_${j}`}>{p}</p>)
                    }
                    return <p key={`${p}${i}`}>{p}</p>
                  })}
                </>
              ),
              a: ({ children, href, node: { properties } }) => {
                // リンク付きの場合は、クリックしたときに別タブで開く
                if (href && href.startsWith('http')) {
                  return (
                    <>
                      <a href={href} target='_blank' rel='noopener noreferrer'>
                        {children.pop()}
                      </a>
                      <MdOpenInNew style={{ fontSize: '.8rem' }} />
                    </>
                  )
                }
                return <a {...properties}>{children.pop()}</a>
              },
            },
          }}
        />
      </div>
    </div>
  )
}

const Code = ({ children = [], className }: ICode) => {
  const id = useRef(randomSeedStr(new Date().getTime()))
  const demo = useRef<HTMLElement | null>(null)
  const code = getCode(children)

  useEffect(() => {
    ; (async () => {
      if (demo.current) {
        try {
          const str = await mermaid.render(id.current, code, demo.current)
          // @ts-ignore
          demo.current.innerHTML = str.svg
        } catch (error) {
          // @ts-ignore
          demo.current.innerHTML = error
        }
      }
    })()
  }, [code, demo])

  if (typeof code === 'string' && typeof className === 'string') {
    switch (true) {
      case /^language-mermaid/.test(className.toLocaleLowerCase()):
        return (
          <code ref={demo}>
            <code id={id.current} style={{ display: 'none' }} />
          </code>
        )
      case /^language-plantuml/.test(className.toLocaleLowerCase()):
        const encoded = plantumlEncoder.encode(code)
        return (
          <div style={{ backgroundColor: 'var(--color-canvas-subtle)' }}>
            <img
              src={`http://www.plantuml.com/plantuml/img/${encoded}`}
              alt='plant uml diagram'
            />
          </div>
        )
    }
  }
  return <code className={String(className)}>{children}</code>
}

const getCode = (arr = []): any =>
  arr
    .map((dt: any) => {
      if (typeof dt === 'string') {
        return dt
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children)
      }
      return false
    })
    .filter(Boolean)
    .join('')

interface ICode {
  children?: any
  className?: any
}

export default Editor;