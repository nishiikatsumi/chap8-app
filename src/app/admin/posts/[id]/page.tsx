"use client";
import { use } from 'react';
import { useRouter } from 'next/navigation';
import PostForm, { type PostFormData } from '@/app/_components/PostForm';
import type { Post } from "../../../_types/Types";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { useFetch } from '@/app/_hooks/useFetch';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function PostEditPage({ params }: Props) {
  const router = useRouter();
  const { token } = useSupabaseSession();
  const { id } = use(params);

  // 投稿詳細と一覧のmutateを取得
  const { data: postData, error, isLoading, mutate: mutatePost } = useFetch<{ post: Post }>(
    `/api/admin/posts/${id}`
  );
  const { mutate: mutatePosts } = useFetch<{ posts: Post[] }>(
    '/api/admin/posts'
  );

  const post = postData?.post;

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
      // 現在のページのSWRキャッシュを再検証
      await mutatePost();
      // 一覧ページのSWRキャッシュを再検証
      await mutatePosts();
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
      // 一覧ページのSWRキャッシュを再検証
      await mutatePosts();
      router.push('/admin');
    } else {
      alert('削除に失敗しました');
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }

  if (error) {
    console.error('Failed to fetch post:', error);
    return <div>記事の読み込みに失敗しました</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">記事編集</h1>
      <PostForm
        defaultValues={{
          title: post.title,
          content: post.content,
          thumbnailImageKey: post.thumbnailImageKey,
          categories: post.postCategories.map((pc) => ({ id: pc.category.id })),
        }}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        submitLabel="更新"
      />
    </>
  );
}
