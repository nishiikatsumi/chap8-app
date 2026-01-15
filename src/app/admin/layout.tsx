import AdminSidebar from "../_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-60px)]">
      <AdminSidebar />
      <main className="flex-1 px-15 py-10">
        {children}
      </main>
    </div>
  );
}
