import { PostType } from "@/interfaces/blog";
import { Metadata } from "next";
import { AppleWebApp } from "next/dist/lib/metadata/types/extra-types";
import "./style.css"

export interface Props {
  params: { blogId: string };
}

const authorName = "ShoOsaka";

const getBlog = async (blogId: string): Promise<any> => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/get?blogId=${blogId}`, {
    next: {
      revalidate: 30,
    }
  });
  return res.json();
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { blogId } = params;
  const blog = await getBlog(blogId);
  const title = blog.title;
  const description = blog.description || "";
  const applicationName = title;
  const manifest = "/manifest.json";
  const themeColor = "#efcb16";
  const keywords = blog.keywords;
  const authors = {
    name: authorName,
    url: process.env.NEXTAUTH_URL as string,
  };
  const viewport = "width=device-width, initial-scale=1.0";
  const appleWebApp: AppleWebApp = {
    capable: true,
    statusBarStyle: "default",
    title: title,
  };
  const twitter = {
    title: title,
    description: description,
    site: authorName,
    siteId: authorName,
  };
  const shareImage = blog.image;
  const openGraph = {
    title: title,
    type: "website",
    url: process.env.NEXTAUTH_URL,
    description: description,
    siteName: title,
    images: shareImage,
  };
  const url = new URL(`${process.env.NEXTAUTH_URL}/blogs/${blogId}`);
  return {
    metadataBase: new URL(url),
    title,
    description,
    applicationName,
    manifest,
    themeColor,
    keywords,
    authors,
    viewport,
    appleWebApp,
    twitter,
    openGraph,
  }
}

export default function BlogLayout({ children }) {
  return (
    <section className="fixed left-0 top-0 z-10 h-screen w-screen overflow-y-auto">
      {children}
    </section>
  );
}