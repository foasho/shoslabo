import '@/global.css';
import { Metadata } from "next";
import { hannari } from '@/styles/font';

const title = 'Sho\'s Labo'
const url = 'https://shoslabo.vercel.app/'
const description = 'Portfolio Site of ShoOsaka'
const author = 'ShoOsaka'
const twitter = '@sakanosho'
const themeColor = '#efcb16';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: "%s - SOLB",
  },
  description: description,
  applicationName: title,
  manifest: "/manifest.json",
  themeColor: themeColor,
  formatDetection: {
    telephone: false,
  },
  icons: {
    shortcut: "/icons/apple-touch-icon.png",
    apple: [
      { rel: "apple-touch-icon", url: "/icons/apple-touch-icon.png" },
      { rel: "apple-touch-icon", url: "/icons/favicon-16x16.png", sizes: "16x16" },
      { rel: "apple-touch-icon", url: "/icons/favicon-32x32.png", sizes: "32x32", href: '/icons/favicon-32x32.png' },
      { rel: "apple-touch-icon", url: "/icons/apple-touch-icon.png", sizes: "180x180" }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: title,
  },
  twitter: {
    title: title,
    description: description,
    site: twitter,
    siteId: twitter,
  },
  openGraph: {
    title: title,
    type: "website",
    url: url,
    description: description,
    siteName: title,
    images: '/icons/share.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang='ja' className='antialiased'>
      <head />
      <body className={`${hannari.variable}`}>
        {children}
      </body>
    </html>
  )
}
