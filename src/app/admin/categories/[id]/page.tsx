"use client";

import { useRouter } from 'next/navigation';
import CategoryForm from '@/app/_components/CategoryForm';
import { use } from 'react';
import { useFetch } from '@/app/_hooks/useFetch';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

interface Category {
  id: number;
  name: string;
}

export default function CategoryEditPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);

  // カテゴリー詳細と一覧のmutateとtokenを取得
  const { mutate: mutateCategory, token } = useFetch<{ category: Category }>(
    `/api/admin/categories/${id}`
  );
  const { mutate: mutateCategories } = useFetch<{ categories: Category[] }>(
    '/api/admin/categories'
  );

  const handleUpdate = async (name: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert('カテゴリーを更新しました');
      // 現在のページのSWRキャッシュを再検証
      await mutateCategory();
      // 一覧ページのSWRキャッシュを再検証
      await mutateCategories();
      router.push('/admin/categories');
    } else {
      alert('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      method: 'DELETE',
    });

    if (res.ok) {
      alert('カテゴリーを削除しました');
      // 一覧ページのSWRキャッシュを再検証
      await mutateCategories();
      router.push('/admin/categories');
    } else {
      alert('削除に失敗しました');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">カテゴリー編集</h1>
      <CategoryForm
        categoryId={id}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitLabel="更新"
      />
    </>
  );
}
