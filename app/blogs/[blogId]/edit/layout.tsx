
import AuthProvider from "@/AuthProvider";
import ClientOnly from "@/ClientOnly";

export default function EditBlogLayout({ children }) {

  return (
    <ClientOnly>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClientOnly>
  )
}