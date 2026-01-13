"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

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
          setName(data.category.name);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
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
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    setSubmitting(true);

    try {
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
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('削除に失敗しました');
    } finally {
      setSubmitting(false);
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
          <form onSubmit={handleUpdate} className="max-w-6xl">
            <div className="mb-8">
              <label htmlFor="name" className="block text-base font-semibold text-[#1f2328] mb-2">
                カテゴリー名
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600"
                required
              />
            </div>

            <div className="flex gap-4 mt-10">
              <button
                type="submit"
                className="bg-purple-800 text-white px-8 py-3 border-0 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                更新
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-8 py-3 border-0 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                削除
              </button>
            </div>
          </form>
    </>
  );
}
