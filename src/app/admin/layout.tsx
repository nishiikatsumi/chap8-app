import AdminSidebar from "../_components/AdminSidebar";
import classes from "../_styles/Admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={classes.container}>
      <AdminSidebar />
      <main className={classes.mainContent}>
        {children}
      </main>
    </div>
  );
}
