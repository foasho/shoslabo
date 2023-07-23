'use client'
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic'
import { Header } from '@/components/commons/Header';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loading2D } from '@/components/commons/Loading2D';

export default function Page() {

  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const cards = [
    {
      key: 'card-1',
      title: 'Sasuke',
      description: '実家にいたミニチュアダックスフンド',
      image: 'https://i.pinimg.com/originals/05/38/37/053837841e45d256511bae656f3fd776.png',
      route: 'https://www.pinterest.jp/pin/677369600197854915/',
      tags: ['油絵', '動物', 'Art'],
    },
    {
      key: 'card-2',
      title: 'Colmar',
      description: 'Colmarの街並み',
      image: 'https://i.pinimg.com/originals/23/57/b0/2357b0c5858ee6ca2dadb26c09915a13.jpg',
      route: 'https://www.pinterest.jp/pin/677369600197854915/',
      tags: ['水彩画', '風景画', 'Art'],
    },
    {
      key: 'card-3',
      title: '民族衣装の女性',
      description: '2021東京都恵比寿弘重ギャラリーにて展示',
      image: 'https://i.pinimg.com/originals/bb/bd/86/bbbd86410c2a516b854b08f99efffea6.jpg',
      route: 'https://www.pinterest.jp/pin/677369600228748321/',
      tags: ['油絵', '人物画', 'Art'],
    },
    {
      key: 'card-4',
      title: 'Girl01',
      description: '美人画',
      image: 'https://i.pinimg.com/originals/94/8a/89/948a8962a165d4fa59a9d023c7de9e00.jpg',
      route: 'https://www.pinterest.jp/pin/677369600228748335/',
      tags: ['油絵', '人物画', 'Art'],
    },
    {
      key: 'card-5',
      title: 'Sketch01',
      description: 'デジタルペイントでのスケッチ01',
      image: 'https://i.pinimg.com/originals/69/1a/1f/691a1f7130c88e3dd48e8d8e893a8845.png',
      route: 'https://www.pinterest.jp/pin/677369600228748502',
      tags: ['油絵', '人物画', 'Art'],
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
          Arts / Designs
        </div>
        {/** サブタイトル */}
        <div className="text-xl font-bold mb-8">
          趣味の油絵やWebGLで作ったアート、そのほかデザインしたものを紹介します。
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
                <Suspense fallback={<Loading2D/>}>
                <img
                  className="w-full h-56 object-cover object-center"
                  src={card.image}
                  alt="avatar"
                />
                </Suspense>
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