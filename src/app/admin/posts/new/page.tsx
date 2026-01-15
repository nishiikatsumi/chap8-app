"use client";
import { useRouter } from 'next/navigation';
import PostForm, { type PostFormData } from '@/app/_components/PostForm';

export default function PostNewPage() {
  const router = useRouter();

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
