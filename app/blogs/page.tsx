'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic'
import { Header } from '@/components/commons/Header';
import { useRouter } from 'next/navigation';

export default function Page() {

  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const cards = [
    {
      key: 'card-1',
      title: 'BVH-Walk',
      description: 'BVH法を利用したThridPerson移動',
      image: '/img/blogs/s1-bvhwalk.png',
      route: 'https://codesandbox.io/s/bvh-walk-5942gn',
      tags: ['React', 'Three.js', 'R3F'],
    },
    {
      key: 'card-2',
      title: 'R3F-JP-FORM',
      description: '日本語対応のWebGL用3D入力フォーム',
      image: '/img/blogs/s2-r3f-jp-form.jpg',
      route: 'https://codesandbox.io/s/r3f-jp-form-q8pxhf',
      tags: ['React', 'Three.js', 'R3F', 'XR'],
    },
    {
      key: 'card-3',
      title: 'SimpleGrass',
      description: 'WebGLでの草原の描画',
      image: '/img/blogs/s3-3d-grass.jpg',
      route: '/blogs/s3-grass',
      tags: ['React', 'Three.js', 'R3F'],
    },
    {
      key: 'card-4',
      title: 'お絵描き道場',
      description: '多機能Webペイントツール',
      image: '/img/blogs/s4-oekakidojo.png',
      route: 'https://paintmonitor.com/',
      tags: ['個人開発', 'Python', 'Vue.js', 'Django'],
    },
    {
      key: 'card-5',
      title: 'NinjaGL',
      description: 'WebGLゲームエンジン',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      route: '/blogs/s5-voxel',
      tags: ['Three.js', 'Next.js', 'R3F'],
    },
    {
      key: 'card-6',
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      route: '/blogs/s6-voxel',
      tags: ['tag1', 'tag2', 'tag3'],
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
    <>
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
          ここには、技術的なメモを残していきます。
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
    </>
  )
}