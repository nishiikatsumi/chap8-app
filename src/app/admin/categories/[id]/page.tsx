"use client";

import { useRouter } from 'next/navigation';
import CategoryForm from '@/app/_components/CategoryForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { use } from 'react';
import useSWR from 'swr';
import type { Category } from '../../../_types/Types';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryEditPage({ params }: Props) {
  const router = useRouter();
  const { token } = useSupabaseSession();
  const { id } = use(params)

  const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch category');
    }

    const data = await res.json();
    return data.category;
  }

  const { data: category, error, isLoading} = useSWR<Category>(
    token ? [`/api/admin/categories/${id}`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token)
  );

  const handleUpdate = async (name: string) => {
    if (!token) return;
    const { id } = await params;
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
      router.push('/admin/categories');
    } else {
      alert('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    const { id } = await params;
    const res = await fetch(`/api/admin/categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      method: 'DELETE',
    });

    if (res.ok) {
      alert('カテゴリーを削除しました');
      router.push('/admin/categories');
    } else {
      alert('削除に失敗しました');
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  if (!category) {
    return <div>カテゴリーが見つかりませんでした</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">カテゴリー編集</h1>
      <CategoryForm
        initialName={category.name}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitLabel="更新"
      />
    </>
  );
}
