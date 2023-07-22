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
import Swal from "sweetalert2";

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
  const [keywords, setKeywords] = useState<string | null>(null);
  const [content, setContent] = useState(initContent || '');


  /**
   * 画像アップロード
   * @param file 
   * @returns 
   */
  const uploadImage = async (file: File) => {
    if (!file) return;
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filePath', "thumbnails/" + file.name)
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!data.data) return null;
    if (!data.data.signedUrl) return null;
    return data.data.signedUrl;
  }

  const onChangeEditor = (value?: string) => {
    if (value !== undefined) {
      setContent(value)
    }
  }

  const save = async () => {
    // 値の確認
    if (!title || title === '') {
      Swal.fire({
        title: 'タイトルが入力されていません',
        text: 'タイトルを入力してください',
        icon: 'error',
      })
      return;
    }
    if (!thumbnail) {
      Swal.fire({
        title: 'サムネイルが設定されていません',
        text: 'サムネイルを設定してください',
        icon: 'error',
      })
      return;
    }
    if (!content || content === '') {
      Swal.fire({
        title: '記事が入力されていません',
        text: '記事を入力してください',
        icon: 'error',
      })
      return;
    }

    Swal.fire({
      title: '保存しますか？',
      text: '保存すると、記事が公開されます。',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: 'キャンセル',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch('/api/blogs/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            thumbnail,
            keywords,
            content,
          }),
        })
        const data = await res.json()
        if (data.error) {
          Swal.fire({
            title: 'エラーが発生しました',
            text: data.error.message,
            icon: 'error',
          })
        } else {
          Swal.fire({
            title: '保存しました',
            text: '記事を公開しました',
            icon: 'success',
          })
        }
      }
    })
  }

  return (
    <div
      className={"h-full w-full relative"}
      data-color-mode={'light'}
    >
      <div className="absolute top-0 w-full py-8 px-4">
        <div className="flex items-center mb-2">
          {/** タイトル入力 */}
          <div className="w-1/3 px-2" data-te-input-wrapper-init>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              タイトル
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={title}
              placeholder="タイトルを入力してください"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/** 説明入力(任意) */}
          <div className="w-2/3 px-2" data-te-input-wrapper-init>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              説明(任意)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={description}
              placeholder="必要に応じて説明を入力してください"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        {/** 画像 */}
        <div className="flex items-center mb-2">
          <div className="w-1/3 px-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file_input"
            >
              サムネイル
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files) {
                  const file = e.target.files[0]
                  const url = await uploadImage(file)
                  if (url) {
                    setThumbnail(url)
                  }
                }
              }}
              disabled={thumbnail !== null}
            />
          </div>
          {/** タグ入力(任意) */}
          <div className="w-2/3 px-2" data-te-input-wrapper-init>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tags"
            >
              タグ(任意)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tags"
              type="text"
              placeholder="必要に応じてタグを入力してください"
            />
          </div>
        </div>
      </div>
      <div
        className="absolute top-[28vh] left-1/2 -translate-x-1/2 w-full px-6"
      >
        {/** @ts-ignore */}
        <MDEditor
          className="min-h-[70vh] w-full"
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