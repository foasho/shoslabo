
import AuthProvider from "@/auth.container";
import ClientOnly from "@/client-only";

export default function EditBlogLayout({ children }) {

  return (
    <ClientOnly>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClientOnly>
  )
}