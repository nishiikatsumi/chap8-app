"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostForm, { type PostFormData } from '@/app/_components/PostForm';
import type { Post } from "../../../_types/Types";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function PostEditPage({ params }: Props) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSupabaseSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const { id } = await params;

        const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": token,
          },
          cache: 'no-store',
        });

        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData.post);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, params]);

  const handleUpdate = async (data: PostFormData) => {
    const { id } = await params;
    if (!token) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('記事を更新しました');
      router.push('/admin');
    } else {
      alert('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      method: 'DELETE',
    });

    if (res.ok) {
      alert('記事を削除しました');
      router.push('/admin');
    } else {
      alert('削除に失敗しました');
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">記事編集</h1>
      <PostForm
        initialData={{
          title: post.title,
          content: post.content,
          thumbnailUrl: post.thumbnailUrl,
          selectedCategoryIds: post.postCategories.map((pc) => pc.category.id),
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitLabel="更新"
      />
    </>
  );
}
