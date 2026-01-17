'use client'

import Link from "next/link";
import { getDateString } from "../../_utils/getDateString";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";

interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function CategoriesPage() {
  const { token } = useSupabaseSession();

  const { data: categoriesData, error, isLoading: isLoadingCategories } = useFetch<{ categories: Category[] }>(
    '/api/admin/categories'
  );

  const categories = categoriesData?.categories;

  if (!token) {
    return <div className="text-red-600">認証が必要です</div>;
  }

  if (isLoadingCategories) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    console.error('Error fetching categories:', error);
    return <div className="text-red-600">カテゴリーの取得に失敗しました</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#1f2328]">カテゴリー一覧</h1>
          <Link href="/admin/categories/new" className="bg-blue-600 text-white px-6 py-3 border-0 rounded-md text-base font-semibold cursor-pointer no-underline inline-block transition-colors duration-200 hover:bg-blue-700">
            新規作成
          </Link>
        </div>
        <div>カテゴリーがまだありません</div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#1f2328]">カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className="bg-blue-600 text-white px-6 py-3 border-0 rounded-md text-base font-semibold cursor-pointer no-underline inline-block transition-colors duration-200 hover:bg-blue-700">
          新規作成
        </Link>
      </div>
      <ul className="list-none p-0 m-0">
        {categories.map((category) => (
          <li key={category.id} className="py-6 border-b border-gray-200 cursor-pointer transition-colors duration-200 hover:bg-gray-50">
            <Link href={`/admin/categories/${category.id}`} className="no-underline text-inherit block">
              <h2 className="text-xl font-semibold text-[#1f2328] mb-2">{category.name}</h2>
              <p className="text-sm text-gray-500">
                {getDateString(category.createdAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
