"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from "../_styles/Admin.module.css";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={classes.sidebar}>
      <Link
        href="/admin"
        className={`${classes.sidebarItem} ${pathname === '/admin' ? classes.active : ''}`}
      >
        記事一覧
      </Link>
      <Link
        href="/admin/categories"
        className={`${classes.sidebarItem} ${pathname === '/admin/categories' ? classes.active : ''}`}
      >
        カテゴリー一覧
      </Link>
    </aside>
  );
}
