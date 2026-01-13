"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[360px] bg-[#e8eef5] p-0">
      <Link
        href="/admin"
        className={`py-5 px-7 border-b border-[#d0d7de] cursor-pointer text-base font-medium text-[#1f2328] no-underline block transition-colors duration-200 hover:bg-[#d0d7de] ${
          pathname === '/admin' ? 'bg-[#d0d7de]' : ''
        }`}
      >
        記事一覧
      </Link>
      <Link
        href="/admin/categories"
        className={`py-5 px-7 border-b border-[#d0d7de] cursor-pointer text-base font-medium text-[#1f2328] no-underline block transition-colors duration-200 hover:bg-[#d0d7de] ${
          pathname === '/admin/categories' ? 'bg-[#d0d7de]' : ''
        }`}
      >
        カテゴリー一覧
      </Link>
    </aside>
  );
}
