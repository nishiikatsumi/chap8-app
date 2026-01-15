"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/app/_components/CategoryForm';

interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryEditPage({ params }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setCategory(data.category);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params]);

  const handleUpdate = async (name: string) => {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('カテゴリーを削除しました');
      router.push('/admin/categories');
    } else {
      alert('削除に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
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
