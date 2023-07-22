// import {} from 'funcs'

import { PostType } from "@/interfaces/blog";
import { Metadata } from "next";
import { AppleWebApp } from "next/dist/lib/metadata/types/extra-types";

export interface Props {
  params: { blogId: string };
}

const authorName = "ShoOsaka";

export async function generateMetadata(
  { params }: Props
): Promise<Metadata>{
  const { blogId } = params;
  const title = "title";
  const description = "description";
  const applicationName = "applicationName";
  const manifest = "/manifest.json";
  const themeColor = "#efcb16";
  const keywords = "keywords";
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
  const shareImage = "/icons/share.png";
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
    <>
      {children}
    </>
  );
}