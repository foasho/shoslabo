import { AdminProvider } from "@/admin.container";

export default function AdminLayout({ children }) {
  return (
    <section>
      <AdminProvider>{children}</AdminProvider>
    </section>
  )
}