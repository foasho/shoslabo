import { Layout } from '@/components/dom/Layout'
import '@/global.css';
import RootProvider from "@/root.container";

export default function RootLayout({ children }) {
  return (
      <html lang='ja' className='antialiased'>
        <head />
        <body>
        <RootProvider>
          <Layout>{children}</Layout>
        </RootProvider>
        </body>
      </html>
  )
}
