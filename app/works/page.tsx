'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic'
import Header from '@/components/commons/Header';
import { useRouter } from 'next/navigation';

export default function Page() {

  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const cards = [
    {
      key: 'work-1',
      title: 'PrimeMeterEye',
      description: '株式会社プライムキャスト 様',
      image: '/works/pme.png',
      route: 'https://www.primemeter-eye.com/',
      tags: ['Python', 'Tensorflow', 'FastAPI', 'PlatfromIO', 'React'],
    },
    {
      key: 'card-2',
      title: 'Uniee',
      description: '株式会社プライムキャスト 様',
      image: '/works/uniee.png',
      route: 'https://uniee.vercel.app/',
      tags: ['React', 'Three.js', 'R3F', 'Next.js'],
    },
    {
      key: 'card-3',
      title: 'お絵描き道場',
      description: '多機能Webペイントツール',
      image: '/works/oekaki.png',
      route: 'https://paintmonitor.com/',
      tags: ['個人開発', 'Django', 'Python', 'Vue.js'],
    },
    {
      key: 'card-4',
      title: 'NinjaGL(調整中)',
      description: 'WebGLゲームエンジン',
      image: '/works/ninjagl.png',
      route: 'https://ninjagl.vercel.app/',
      tags: ['個人開発', 'Three.js', 'Next.js', 'R3F'],
    },
    {
      key: 'card-5',
      title: 'らくらく健康IoT(調整中)',
      description: 'オープンソースIoTプロジェクト',
      image: '/works/rakuken.png',
      route: 'https://rakuken-iot.net/',
      tags: ['個人開発', 'Python', 'FastAPI', 'Kotlin', 'C++'],
    },
  ];

  const filteredCards = cards.filter((card) => {
    // 検索文字列が空の場合は全てのカードを表示
    if (searchText === '') {
      return true;
    }
    // 小文字に変換して検索
    const title = card.title.toLowerCase();
    const description = card.description.toLowerCase();
    const tags = card.tags.join(' ').toLowerCase();
    const search = searchText.toLowerCase();
    return title.includes(search) || description.includes(search) || tags.includes(search);
  });

  return (
    <div className="fixed w-screen h-screen top-0 left-0 overflow-y-auto z-10">
      <Header fontColor={"#1e1e1e"} />
      <div
        className="container mx-auto px-4 py-8 text-gray-800 pt-24"
      >
        {/** タイトル */}
        <div className="text-4xl font-bold mb-8">
          Works
        </div>
        {/** サブタイトル */}
        <div className="text-xl font-bold mb-8">
          開発実績
          <div className="text-xs text-gray-400 text-light">
            ※ここに掲載させていただいている実績は、許可をいただけたもののみ掲載しています。
          </div>
        </div>
        {/** 検索 */}
        <div className="mb-8">
          <input
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:border-indigo-500"
            type="text"
            placeholder="検索"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
        </div>
        {/** カードリスト */}
        <div className="flex flex-wrap -mx-4">
          {filteredCards.map((card, idx) => (
            <div
              key={`card-${idx}`}
              className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8"
              onClick={() => {
                if (card.route.startsWith('http')) {
                  window.open(card.route, '_blank');
                } else {
                  router.push(card.route);
                }
              }}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  className="w-full h-56 object-cover object-center"
                  src={card.image}
                  alt="avatar"
                />
                <div className="p-4">
                  <p className="uppercase tracking-wide text-sm font-bold text-gray-700">
                    {card.tags.map((tag, i) => (
                      <span key={`tag-${i}`} className="mr-2">{tag}</span>
                    ))}
                  </p>
                  <p className="text-3xl font-semibold">{card.title}</p>
                  <p className="mt-2 text-gray-600">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}