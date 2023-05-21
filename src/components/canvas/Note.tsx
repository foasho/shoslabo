import dynamic from 'next/dynamic';
import { Common, IViewProps } from '@/components/canvas/View';
import { FiCopy } from 'react-icons/fi';
import { BsCodeSlash, BsBoxes, BsLayoutSplit } from 'react-icons/bs';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from 'react';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
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

const HighlightedCodeBlock = ({
  code = "",
  lang = "jsx",
}: {
  code?: string;
  lang?: string;
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setTooltipVisible(true);
    setTimeout(() => setTooltipVisible(false), 2000);  // 2秒後にメッセージを消去
  };

  return (
    <div
      className="relative w-full max-h-100"
      style={{
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* コピぺ用ボタン 位置は右上 */}
      <div className="relative">
        <a
          className="absolute top-0 right-0 z-10 text-xl p-5 text-gray-500 hover:text-gray-700 cursor-pointer select-none"
          onClick={copyCode}
        >
          <FiCopy />
          {tooltipVisible && (
            <div className="absolute top-2 right-11 z-20 mt-2 px-2 py-1 text-sm text-white bg-gray-600 rounded whitespace-nowrap select-none">
              コピーしました
            </div>
          )}
        </a>
      </div>
      <div
        
      ></div>
      <SyntaxHighlighter 
        language="tsx"
        style={vscDarkPlus}
        showLineNumbers={true}
        // wrapLines
        showInlineLineNumbers
        customStyle={{ margin: 0, paddingTop: 30 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

/**
 * 
 */
interface INoteProps extends IViewProps {
  children?: React.ReactNode | React.ReactNode[];
  sourceCode?: string;
  orbit?: boolean;
  debug?: boolean;
  common?: boolean;
}
export const R3FNote = (
  {
    children,
    sourceCode,
    orbit = false,
    debug = false,
    common = true,
  }: INoteProps,
) => {
  // childrenが2つある場合は、最後のもの以外をViewにいれて、最後のものをViewの外に出す
  let isArr = false;
  if (Array.isArray(children) && children.length > 1) {
    isArr = true;
  }
  const [viewType, setViewType] = useState<'view' | 'code' | 'split'>("view");
  return (
    <div className={`relative flex h-screen ${viewType !== 'split' ? 'justify-center' : ''}`}>
      {/** view */}
      {(viewType === 'view' || viewType == 'split') &&
      <div
          className={`absolute h-screen ${viewType === 'split' ? 'w-1/2 d-flex' : 'w-full'}`}
      >
        {/** @ts-ignore */}
        <View 
            className={`absolute w-full h-full ${viewType === 'split' ? 'w-1/2' : ''}`}
          orbit={orbit}
          debug={debug}
        >
          {children && isArr && Array.isArray(children) ? 
            children.slice(0, children.length - 1)
           : children}
          {common && <Common />}
        </View>
        {/** @ts-ignore */}
        {children && isArr && Array.isArray(children) &&
        <div
          className={`absolute z-10 ${viewType === 'split' ? 'w-1/2 d-flex left-1/2' : 'w-full'}`}
        >
          {children[children.length - 1]}
        </div>
        }
      </div>
      }
      {/** code */}
      {(viewType === 'code' || viewType == 'split') && 
        <div
          className={`absolute ${viewType === 'split' ? 'w-1/2 d-flex left-1/2' : 'w-full'}`}
        >
          <HighlightedCodeBlock code={sourceCode} />;
        </div>
      }
      {/** selectボタン */}
      <>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 z-10 flex justify-center">
          <a
            className={`px-4 py-2 rounded-l-md ${viewType === "view" ? "bg-gray-300" : "bg-gray-100"
              }`}
            onClick={() => setViewType("view")}
          >
            <BsBoxes />
          </a>
          <a
            className={`px-4 py-2 ${viewType === "split" ? "bg-gray-300" : "bg-gray-100"
              }`}
            onClick={() => setViewType("split")}
          >
            <BsLayoutSplit />
          </a>
          <a
            className={`px-4 py-2 rounded-r-md ${viewType === "code" ? "bg-gray-300" : "bg-gray-100"
              }`}
            onClick={() => setViewType("code")}
          >
            <BsCodeSlash />
          </a>
        </div>
      </>
    </div>
  )
}