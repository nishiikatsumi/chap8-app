"use client";
import { useRouter } from 'next/navigation';
import PostForm, { type PostFormData } from '@/app/_components/PostForm';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { useFetch } from '@/app/_hooks/useFetch';
import type { Post } from "../../../_types/Types";

export default function PostNewPage() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  // 一覧のmutateを取得
  const { mutate: mutatePosts } = useFetch<{ posts: Post[] }>(
    '/api/admin/posts'
  );

  const handleSubmit = async (data: PostFormData) => {
    if (!token) return;
    const res = await fetch(`/api/admin/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('記事を作成しました');
      // SWRのキャッシュを再検証
      await mutatePosts();
      router.push('/admin');
    } else {
      alert('作成に失敗しました');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">記事作成</h1>
      <PostForm
        onSubmit={handleSubmit}
        submitLabel="作成"
      />
    </>
  );
}
