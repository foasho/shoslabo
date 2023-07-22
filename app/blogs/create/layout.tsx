
import AuthProvider from "@/auth.container";
import ClientOnly from "@/client-only";
import RootProvider from "@/root.container";

export default function CreateBlogLayout({ children }) {

  return (
    <ClientOnly>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClientOnly>
  )
}