import Header from "@/components/dom/Header";
import Image from "next/image";
import Link from "next/link";


const getBlogs = async (): Promise<any[]> => {
  const _blogs = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_URL}/api/blog/list`, {
    cache: "force-cache",
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    }
    else {
      return [];
    }
  }).catch((err) => {
    return [];
  });
  return _blogs;
}

interface BlogProp {
  key: string;
  title: string;
  description: string;
  image: string;
  route: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default async function BlogPage() {

  const blogs = await getBlogs();

  return (
    <div className="fixed left-0 top-0 z-10 h-screen w-screen overflow-y-auto">
      <Header fontColor={"#1e1e1e"} />
      <div
        className="container mx-auto px-4 py-8 pt-24 text-gray-800"
      >
        {/** タイトル */}
        <div className="mb-8 text-4xl font-bold">
          Blog
        </div>
        {/** サブタイトル */}
        <div className="mb-8 text-xl font-bold">
          ここには、技術的なメモを残していきます。
        </div>
        {/** カードリスト */}
        <div className="-mx-4 flex flex-wrap">
          {blogs.map((card, idx) => (
            <Link
              key={`card-${idx}`}
              href={`/${card.route}`}
              className="mb-8 w-full px-4 md:w-1/2 lg:w-1/3"
            >
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <Image
                  className="h-56 w-full object-cover object-center"
                  src={card.image}
                  alt="avatar"
                  width={224}
                  height={450}
                />
                <div className="p-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-gray-700">
                    {card.tags &&
                      <>
                        {card.tags.map((tag, i) => (
                          <span key={`tag-${i}`} className="mr-2">{tag}</span>
                        ))}
                      </>
                    }
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