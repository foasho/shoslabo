import { Props } from "./layout";
import dynamic from 'next/dynamic';

const Preview = dynamic(() => import('@/components/editor/Preview'), {
  ssr: false
});

const Header = dynamic(() => import('@/components/dom/Header'), {
  ssr: false
});

const getBlog = async ({ blogId }): Promise<any> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/get?blogId=${blogId}`, {
    cache: "force-cache",
  });
  return res.json();
}

const Page = async ({
  params
}: Props) => {
  const { blogId } = params;
  const blog = await getBlog({ blogId });
  return (
    <>
      {/** @ts-ignore */}
      <Header fontColor={"#c2c2c2"} />
      {/** @ts-ignore */}
      <Preview blog={blog} />
    </>
  );
}

export default Page;