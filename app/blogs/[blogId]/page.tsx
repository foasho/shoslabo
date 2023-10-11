import { Props } from "./layout";
import dynamic from 'next/dynamic';
import type PreviewImpl from "@/components/editor/Preview";
import type HeaderImpl from "@/components/dom/Header";

const Preview = dynamic(() => import('@/components/editor/Preview'), {
  ssr: false
}) as typeof PreviewImpl;

const Header = dynamic(() => import('@/components/dom/Header'), {
  ssr: false
}) as typeof HeaderImpl;

// ISRで実装
const getBlog = async ({ blogId }): Promise<any> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/get?blogId=${blogId}`, {
    next: {
      // 5分後に再取得
      revalidate: 300
    }
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
      <Header fontColor={"#c2c2c2"} />
      <Preview blog={blog} />
    </>
  );
}

export default Page;