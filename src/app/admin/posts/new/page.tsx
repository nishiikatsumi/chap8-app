"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostForm, { type PostFormData } from '@/app/_components/PostForm';

interface Category {
  id: number;
  name: string;
}

export default function PostNewPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (data: PostFormData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('記事を作成しました');
      router.push('/admin');
    } else {
      alert('作成に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">記事作成</h1>
      <PostForm
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="作成"
      />
    </>
  );
}
