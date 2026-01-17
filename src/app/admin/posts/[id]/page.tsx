"use client";
import { use } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
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
  const { token } = useSupabaseSession();
  const { id } = use(params);

  const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch post');
    }

    const data = await res.json();
    return data.post;
  };

  const { data: post, error, isLoading } = useSWR<Post>(
    token ? [`/api/admin/posts/${id}`, token] : null,
    ([url, token]: [string, string]) => fetcher(url, token)
  );

  const handleUpdate = async (data: PostFormData) => {
    if (!token) return;
    const res = await fetch(`/api/admin/posts/${id}`, {
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
    const res = await fetch(`/api/admin/posts/${id}`, {
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

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    console.error('Failed to fetch post:', error);
    return <div>記事の読み込みに失敗しました</div>;
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
          thumbnailImageKey: post.thumbnailImageKey,
          selectedCategoryIds: post.postCategories.map((pc) => pc.category.id),
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitLabel="更新"
      />
    </>
  );
}
