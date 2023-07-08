'use client'
import dynamic from 'next/dynamic'

export default function Page() {

  const cards = [
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
    {
      title: 'Card 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
      image: 'https://tailwindcss.com/img/card-top.jpg',
      tags: ['tag1', 'tag2', 'tag3'],
    },
  ];

  return (
    // @ts-ignore
    <div 
      className="container mx-auto px-4 py-8 text-gray-800"
    >
      {/** タイトル */}
      <div className="text-4xl font-bold mb-8">
        Works
      </div>
      {/** サブタイトル */}
      <div className="text-xl font-bold mb-8">
        ここには、技術的なメモを残していきます。
      </div>
      {/** カードリスト */}
      <div className="flex flex-wrap -mx-4">
        {cards.map((card, idx) => (
          <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8" key={idx}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                className="w-full h-56 object-cover object-center"
                src={card.image}
                alt="avatar"
              />
              <div className="p-4">
                <p className="uppercase tracking-wide text-sm font-bold text-gray-700">
                  {card.tags.map((tag) => (
                    <span className="mr-2">{tag}</span>
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
  )
}