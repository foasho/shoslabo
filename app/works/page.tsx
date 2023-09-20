import Header from '@/components/dom/Header';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {

  const cards = [
    {
      key: 'work-1',
      title: 'PrimeMeterEye',
      description: '株式会社プライムキャスト 様',
      image: '/works/pme.png',
      route: 'https://www.primemeter-eye.com/',
      tags: ['Python', 'Tensorflow', 'FastAPI', 'C++', 'React'],
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
      title: 'r3f-dom-masonry',
      description: 'R3F + Masonryライブラリ',
      image: '/works/r3f-dom-masonry.png',
      route: 'https://main.d3iw6f1p5q2t54.amplifyapp.com/?path=/story/r3fdommasonry--random-heights',
      tags: ['個人開発', 'OSS', 'R3F', 'React'],
    },
    {
      key: 'card-6',
      title: 'らくらく健康IoT(調整中)',
      description: 'オープンソースIoTプロジェクト',
      image: '/works/rakuken.png',
      route: 'https://rakuken-iot.net/',
      tags: ['個人開発', 'Python', 'FastAPI', 'Kotlin', 'C++'],
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
          Works
        </div>
        {/** サブタイトル */}
        <div className="mb-8 text-xl font-bold">
          開発実績
          <div className="text-light text-xs text-gray-400">
            ※ここに掲載させていただいている実績は、許可をいただけたもののみ掲載しています。
          </div>
        </div>
        {/** カードリスト */}
        <div className="-mx-4 flex flex-wrap">
          {cards.map((card, idx) => (
            <Link
              key={`card-${idx}`}
              href={card.route}
              target='_blank'
              className="mb-8 w-full px-4 md:w-1/2 lg:w-1/3"
            >
              <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
                <Image
                  className="relative h-56 w-full object-cover object-center"
                  src={card.image}
                  alt="avatar"
                  height={224}
                  width={450}
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