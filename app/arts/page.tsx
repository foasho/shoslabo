import Header from '@/components/dom/Header';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtPage() {

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

  return (
    <div className="fixed left-0 top-0 z-10 h-screen w-screen overflow-y-auto">
      <Header fontColor={"#1e1e1e"} />
      <div
        className="container mx-auto px-4 py-8 pt-24 text-gray-800"
      >
        {/** タイトル */}
        <div className="mb-8 text-4xl font-bold">
          Arts / Designs
        </div>
        {/** サブタイトル */}
        <div className="mb-8 text-xl font-bold">
          趣味の油絵やWebGLで作ったアート、そのほかデザインしたものを紹介します。
        </div>
        {/** カードリスト */}
        <div className="-mx-4 flex flex-wrap">
          {cards.map((card, idx) => (
            <Link
              key={`card-${idx}`}
              href={`${card.route}`}
              target='_blank'
              className="mb-8 w-full px-4 md:w-1/2 lg:w-1/3"
            >
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <Image
                  className="h-56 w-full object-cover object-center"
                  src={card.image}
                  alt=""
                  width={224}
                  height={450}
                />
                <div className="p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-gray-700">
                    {card.tags.map((tag, i) => (
                      <span key={`tag-${i}`} className="mr-2">{tag}</span>
                    ))}
                  </p>
                  <p className="text-3xl font-semibold">{card.title}</p>
                  <p className="mt-2 text-gray-600">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}