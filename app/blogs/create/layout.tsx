
import AuthProvider from "@/AuthProvider";
import ClientOnly from "@/ClientOnly";

export default function CreateBlogLayout({ children }) {

  return (
    <ClientOnly>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClientOnly>
  )
}