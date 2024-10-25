import Header from "@/components/dom/Header";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const cards = [
    {
      key: "card-1",
      title: "お絵描き道場",
      description: "多機能Webペイントツール",
      image: "/works/oekaki.png",
      route: "https://paintmonitor.com/",
      tags: ["個人開発", "Django", "Python", "Vue.js"],
    },
    {
      key: "card-2",
      title: "NinjaGL(調整中)",
      description: "WebGLゲームエンジン",
      image: "/works/ninjagl.png",
      route: "https://ninjagl.vercel.app/",
      tags: ["個人開発", "Three.js", "Next.js", "R3F"],
    },
    {
      key: "card-3",
      title: "r3f-dom-masonry",
      description: "R3F + Masonryライブラリ",
      image: "/works/r3f-dom-masonry.png",
      route: "https://main.d3iw6f1p5q2t54.amplifyapp.com/?path=/story/r3fdommasonry--random-heights",
      tags: ["ライブラリ", "R3F", "React"],
    },
    {
      key: "card-4",
      title: "r3f-earphones",
      description: "R3F + イヤホンデモ",
      image: "/works/r3f-earphones.png",
      route: "https://zippy-pony-1c4f8f.netlify.app/",
      tags: ["R3F", "Three.js", "React"],
    },
    {
      key: "card-5",
      title: "JARVIS英会話",
      description: "英会話教師JARVIS",
      image: "/works/jarvis-english.png",
      route: "https://english-lesson.vercel.app/",
      tags: ["個人開発", "AI", "Next.js", "R3F"],
    },
    {
      key: "card-6",
      title: "AI執事-WILL",
      description: "スマートホームAIアシスタント",
      image: "/works/will.png",
      route: "https://will-with-rakuken-iot.vercel.app",
      tags: ["個人開発", "Next.js", "AI", "SwitchBot", "StartHome"],
    },
    {
      key: "card-7",
      title: "スリーヒントクイズ",
      description: "AIが3つのヒントから4択クイズを出します",
      image: "/works/h3q.png",
      route: "https://hints3quiz-next.vercel.app/",
      tags: ["個人開発", "Next.js", "AI", "Quiz"],
    },
    {
      key: "card-8",
      title: "大喜利アプリ",
      description: "写真を添付するとAIがしょうもない大喜利を作ってくれます",
      image: "/works/ogiri.png",
      route: "https://ogiri-gyagu-app.vercel.app/",
      tags: ["個人開発", "Next.js", "AI", "大喜利"],
    },
  ];

  return (
    <div className='fixed left-0 top-0 z-10 h-screen w-screen overflow-y-auto'>
      <Header fontColor={"#1e1e1e"} />
      <div className='container mx-auto px-4 py-8 pt-24 text-gray-800'>
        {/** タイトル */}
        <div className='mb-8 text-4xl font-bold'>Works</div>
        {/** サブタイトル */}
        <div className='mb-8 text-xl font-bold'>個人開発 / 作品集 とかで主に仕事外で遊びで作ってるものです。</div>
        {/** カードリスト */}
        <div className='-mx-4 flex flex-wrap'>
          {cards.map((card, idx) => (
            <Link key={`card-${idx}`} href={card.route} target='_blank' className='mb-8 w-full px-4 md:w-1/2 lg:w-1/3'>
              <div className='relative overflow-hidden rounded-lg bg-white shadow-lg'>
                <Image
                  className='relative h-56 w-full object-cover object-center'
                  src={card.image}
                  alt='avatar'
                  height={224}
                  width={450}
                />
                <div className='p-4'>
                  <p className='text-sm font-bold uppercase tracking-wide text-gray-700'>
                    {card.tags.map((tag, i) => (
                      <span key={`tag-${i}`} className='mr-2'>
                        {tag}
                      </span>
                    ))}
                  </p>
                  <p className='text-3xl font-semibold'>{card.title}</p>
                  <p className='mt-2 text-gray-600'>{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
