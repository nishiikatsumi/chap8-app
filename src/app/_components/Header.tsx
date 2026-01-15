"use client";
import Link from 'next/link';

export default function Header() {
  return (
    <div>
      <header className="bg-gray-800 text-white px-8 py-4 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link href='/' className="text-white no-underline">Blog</Link>
        </div>
        <div className="text-sm">
          <Link href='/contact' className="text-white no-underline hover:no-underline">お問い合わせ</Link>
        </div>
      </header>
    </div>
  );
}
