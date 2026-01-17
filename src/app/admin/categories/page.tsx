'use client'

import Link from "next/link";
import { CategoriesIndexResponse } from "../../_types/PrismaTypes";
import { getDateString } from "../../_utils/getDateString";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export default function CategoriesPage() {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error('Failed to fetch categories:', res.status, errorData);
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    const data: CategoriesIndexResponse = await res.json();
    return data.categories;
  }

  const { data: categories, error, isLoading: isLoadingCategories } = useSWR(
    token ? ['/api/admin/categories', token] : null,
    ([url, token]: [string, string]) => fetcher(url, token)
  );

  if (!token) {
    return <div className="text-red-600">認証が必要です</div>;
  }

  if (isLoadingCategories) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    console.error('Error fetching categories:', error);
    return <div className="text-red-600">カテゴリーの取得に失敗しました: {error.message}</div>;
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
        {categories?.map((category: {id: number, name: string, createdAt: Date, updatedAt: Date}) => (
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
