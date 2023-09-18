
import AuthProvider from "@/auth.container";
import ClientOnly from "@/client-only";

export default function CreateBlogLayout({ children }) {

  return (
    <ClientOnly>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClientOnly>
  )
}