"use client";
import { useRouter } from 'next/navigation';
import CategoryForm from '@/app/_components/CategoryForm';

export default function CategoryNewPage() {
  const router = useRouter();

  const handleSubmit = async (name: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert('カテゴリーを作成しました');
      router.push('/admin/categories');
    } else {
      alert('作成に失敗しました');
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">カテゴリー作成</h1>
      <CategoryForm
        onSubmit={handleSubmit}
        submitLabel="作成"
      />
    </>
  );
}
