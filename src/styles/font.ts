import localFont from 'next/font/local';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// カスタムローカルフォントを定義する
const hannari = localFont({
  src: './hannari-regular.otf',
  variable: "--font-hannari",
  display: 'swap',
});

export { hannari };