"use client";
import React, { useEffect, useRef, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "./editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { MdLogout, MdSave, MdHome, MdChangeCircle } from "react-icons/md";
import mermaid from "mermaid";
import plantumlEncoder from "plantuml-encoder";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SNSLinkPreview } from "../commons/SNSLinkPreview";
import { FiBox } from "react-icons/fi";
import Image from "next/image";
import clsx from "clsx";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
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
});

const COLOR = {
  primary: "#0099cc",
  secondary: "#66cccc",
  third: "#808080",
  strong: "#FFA500",
};

enum ViewType {
  Preview = "preview",
  Edit = "edit",
  Live = "live",
}

const randomSeedStr = (seed: number = 19382721): string => {
  const x = Math.sin(seed) * 10000;
  return String(x - Math.floor(x));
};

enum EStatus {
  Draft = 0,
  Published = 1,
}

/**
 * ブログ記事の編集
 * @returns
 */
const Editor = ({
  initContent = undefined,
  initTitle = "",
  initDescription = "",
  initThumbnail = null,
  initKeywords = null,
  blogId = null,
  initStatus = null,
}: {
  initContent?: string | undefined | null;
  initTitle?: string;
  initDescription?: string;
  initThumbnail?: string | null;
  initKeywords?: string | null;
  blogId?: string | null;
  initStatus?: EStatus | null;
}) => {
  const [title, setTitle] = useState<string>(initTitle || "");
  const [description, setDescription] = useState<string>(initDescription || "");
  const [thumbnail, setThumbnail] = useState<string | null>(initThumbnail || null);
  const [keywords, setKeywords] = useState<string | null>(initKeywords || null);
  const [content, setContent] = useState(initContent || "");
  const [status, setStatus] = useState<EStatus>(initStatus || EStatus.Draft);
  const [viewType, setViewType] = useState<ViewType>(ViewType.Edit);

  const { data: session } = useSession();
  const router = useRouter();

  /**
   * 画像アップロード
   * @param file
   * @returns
   */
  const uploadImage = async (file: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filePath", "thumbnails/" + file.name);
    const res = await fetch("/api/storage/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.data) return null;
    if (!data.data.signedUrl) return null;
    return data.data.publicUrl;
  };

  const onChangeEditor = (value?: string) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

  const save = async () => {
    // 値の確認
    if (!title || title === "") {
      Swal.fire({
        title: "タイトルが入力されていません",
        text: "タイトルを入力してください",
        icon: "error",
      });
      return;
    }
    if (!thumbnail) {
      Swal.fire({
        title: "サムネイルが設定されていません",
        text: "サムネイルを設定してください",
        icon: "error",
      });
      return;
    }
    if (!content || content === "") {
      Swal.fire({
        title: "記事が入力されていません",
        text: "記事を入力してください",
        icon: "error",
      });
      return;
    }

    if (session && (session.user as any).isAdmin) {
      Swal.fire({
        title: "保存しますか？",
        text: "保存すると、記事が公開されます。",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "保存",
        cancelButtonText: "キャンセル",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const url = blogId ? `/api/blog/update?blogId=${blogId}` : "/api/blog/create";
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
              image: thumbnail,
              keywords,
              content,
              status,
            }),
          });
          const data = await res.json();
          if (data.error) {
            Swal.fire({
              title: "エラーが発生しました",
              text: data.error.message,
              icon: "error",
            });
          } else {
            router.push(`/blogs/${data.id}`);
          }
        }
      });
    } else {
      Swal.fire({
        title: "権限がありません",
        text: "管理者権限が必要です",
        icon: "error",
      });
    }
  };

  const color_primary = `text-[${COLOR.primary}]`;
  const color_secondary = `text-[${COLOR.secondary}]`;
  const color_third = `text-[${COLOR.third}]`;

  return (
    <>
      <div className={"relative h-full w-full"} data-color-mode={"light"}>
        {/** ログアウトボタン/保存ボタン */}
        <div className='absolute right-2 top-10 z-10 flex h-[20vh] flex-col items-center justify-center gap-4'>
          <div>
            <button
              className='rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100'
              onClick={() => save()}
            >
              <MdSave />
            </button>
          </div>
          <div>
            <button
              className='rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100'
              onClick={() => signOut()}
            >
              <MdLogout />
            </button>
          </div>
          <div>
            <button
              className='rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100'
              onClick={() => router.push("/")}
            >
              <MdHome />
            </button>
          </div>
        </div>
        {session && (session.user as any).isAdmin && (
          <>
            <div className='absolute top-0 w-full px-4 py-8'>
              <div className='mb-2 flex items-center'>
                {/** タイトル入力 */}
                <div className='w-1/3 px-2' data-te-input-wrapper-init>
                  <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='title'>
                    タイトル
                  </label>
                  <input
                    className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
                    id='title'
                    type='text'
                    value={title}
                    placeholder='タイトルを入力してください'
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                {/** 説明入力(任意) */}
                <div className='w-2/3 px-2 pr-16' data-te-input-wrapper-init>
                  <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='description'>
                    説明(任意)
                  </label>
                  <input
                    className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
                    id='title'
                    type='text'
                    value={description}
                    placeholder='必要に応じて説明を入力してください'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className='mb-2 flex items-center'>
                {/** 画像 */}
                <div className='w-1/3 px-2'>
                  <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='file_input'>
                    サムネイル
                  </label>
                  <input
                    className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400'
                    id='file_input'
                    type='file'
                    accept='image/*'
                    onChange={async (e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        const url = await uploadImage(file);
                        if (url) {
                          setThumbnail(url);
                        }
                      }
                    }}
                    disabled={thumbnail !== null}
                  />
                </div>
                {/** タグ入力(任意) */}
                <div className='w-2/3 px-2 pr-16' data-te-input-wrapper-init>
                  <div className='inline-block w-2/3'>
                    <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='tags'>
                      タグ(任意)
                    </label>
                    <input
                      className='w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
                      id='tags'
                      type='text'
                      placeholder='(例: タグ1,タグ2,タグ3,...)'
                      value={keywords || ""}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                  <div className='inline-block w-1/3'>
                    {/** Status選択 */}
                    <div className='px-2'>
                      <label className='mb-2 block text-sm font-bold text-gray-700' htmlFor='status'>
                        公開状態
                      </label>
                      <select
                        className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400'
                        id='status'
                        value={status}
                        onChange={(e) => setStatus(Number(e.target.value))}
                      >
                        <option value={EStatus.Draft}>下書き</option>
                        <option value={EStatus.Published}>公開</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/** モード変更 */}
            <div className='fixed bottom-8 right-8 z-30 flex h-16 w-16 items-center justify-center'>
              <button
                className='rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100'
                onClick={() => {
                  switch (viewType) {
                    case ViewType.Live:
                      setViewType(ViewType.Preview);
                      break;
                    case ViewType.Edit:
                      setViewType(ViewType.Live);
                      break;
                    case ViewType.Preview:
                      setViewType(ViewType.Edit);
                      break;
                  }
                }}
              >
                {(() => {
                  switch (viewType) {
                    case ViewType.Live:
                      return <MdChangeCircle />;
                    case ViewType.Edit:
                      return <MdChangeCircle />;
                    case ViewType.Preview:
                      return <MdChangeCircle />;
                  }
                })()}
              </button>
            </div>
            {/** Editor */}
            <div className='absolute left-1/2 top-[28vh] w-full -translate-x-1/2 px-6'>
              {/** @ts-ignore */}
              <MDEditor
                className='min-h-[70vh] w-full'
                value={content}
                onChange={onChangeEditor}
                preview={viewType}
                hideToolbar={true}
                // visibleDragbar={false}
                style={{
                  fontFamily: "/fonts/MPLUS1-Light.ttf !important",
                }}
                previewOptions={{
                  components: {
                    code: Code,
                    p: ({ children }) => (
                      <>
                        {children.map((p, i) => {
                          if (typeof p === "string") {
                            const splitP = p.split("\n");
                            return splitP.map((p, j) => (
                              <p key={`${p}${i}_${j}`} className={"pl-3"}>
                                {p}
                              </p>
                            ));
                          }
                          return (
                            <p key={`${p}${i}`} className={"pl-3"}>
                              {p}
                            </p>
                          );
                        })}
                      </>
                    ),
                    a: ({ children, href, node: { properties } }) => {
                      // リンク付きの場合は、OGPを表示する
                      if (href && href.startsWith("http")) {
                        return (
                          <>
                            <SNSLinkPreview text={href} />
                          </>
                        );
                      }
                      return <a {...properties}>{children.pop()}</a>;
                    },
                    br: ({ children }) => {
                      return (
                        <>
                          {children}
                          <br />
                        </>
                      );
                    },
                    h1: ({ children }) => {
                      const textContent = React.Children.toArray(children).find((child) => typeof child === "string");
                      return (
                        <div
                          id={`${textContent}`}
                          className={clsx(`!border-none py-7 text-2xl font-bold md:text-3xl`, color_primary)}
                          style={{
                            color: COLOR.primary,
                            fontWeight: "bold",
                          }}
                        >
                          <div className='mr-2 inline-block animate-slowspin'>
                            <FiBox size={16} />
                          </div>
                          <div className='inline-block'>{children}</div>
                        </div>
                      );
                    },
                    h2: ({ children }) => {
                      const textContent = React.Children.toArray(children).find((child) => typeof child === "string");
                      return (
                        <div
                          id={`${textContent}`}
                          className={clsx(`!border-none py-5 text-xl font-bold md:text-2xl`, color_secondary)}
                          style={{
                            color: COLOR.secondary,
                            fontWeight: "bold",
                          }}
                        >
                          {children}
                        </div>
                      );
                    },
                    h3: ({ children }) => {
                      return (
                        <div
                          className={clsx(`!border-none py-2 pl-3 text-lg font-bold md:text-xl`, color_third)}
                          style={{
                            color: COLOR.third,
                            fontWeight: "bold",
                          }}
                        >
                          {children}
                        </div>
                      );
                    },
                    h4: ({ children }) => {
                      return (
                        <div
                          className={clsx(`!border-none py-2 pl-3 text-lg font-bold md:text-xl`, color_third)}
                          style={{
                            color: COLOR.third,
                            fontWeight: "bold",
                          }}
                        >
                          {children}
                        </div>
                      );
                    },
                    strong: ({ children }) => {
                      return (
                        <strong
                          style={{
                            color: COLOR.strong,
                            fontWeight: "bold",
                          }}
                        >
                          {children}
                        </strong>
                      );
                    },
                  },
                }}
              />
            </div>
          </>
        )}
        {!session && (
          <div id='login_title' className='my-4 font-bold text-gray-700'>
            <h1 className='text-center text-4xl font-bold'>権限がありません。</h1>
          </div>
        )}
      </div>
    </>
  );
};

const Code = ({ children = [], className }: ICode) => {
  const id = useRef(randomSeedStr(new Date().getTime()));
  const demo = useRef<HTMLElement | null>(null);
  const code = getCode(children);

  useEffect(() => {
    (async () => {
      if (demo.current) {
        try {
          const str = await mermaid.render(id.current, code, demo.current);
          // @ts-ignore
          demo.current.innerHTML = str.svg;
        } catch (error) {
          // @ts-ignore
          demo.current.innerHTML = error;
        }
      }
    })();
  }, [code, demo]);

  if (typeof code === "string" && typeof className === "string") {
    switch (true) {
      case /^language-mermaid/.test(className.toLocaleLowerCase()):
        return (
          <code ref={demo}>
            <code id={id.current} style={{ display: "none" }} />
          </code>
        );
      case /^language-plantuml/.test(className.toLocaleLowerCase()):
        const encoded = plantumlEncoder.encode(code);
        return (
          <div style={{ backgroundColor: "var(--color-canvas-subtle)" }}>
            <Image
              src={`http://www.plantuml.com/plantuml/img/${encoded}`}
              alt='plant uml diagram'
              width={750}
              height={480}
            />
          </div>
        );
    }
  }
  return <code className={String(className)}>{children}</code>;
};

const getCode = (arr = []): any =>
  arr
    .map((dt: any) => {
      if (typeof dt === "string") {
        return dt;
      }
      if (dt.props && dt.props.children) {
        return getCode(dt.props.children);
      }
      return false;
    })
    .filter(Boolean)
    .join("");

interface ICode {
  children?: any;
  className?: any;
}

export default Editor;
