'use client'

import Link from "next/link";
import { CategoriesIndexResponse } from "../../_types/PrismaTypes";
import { getDateString } from "../../_utils/getDateString";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const { token, isLoading } = useSupabaseSession();
  const [categories, setCategories] = useState<CategoriesIndexResponse['categories']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const getCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: CategoriesIndexResponse = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, [token, isLoading]);

  if (loading) {
    return <div>読み込み中...</div>;
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
