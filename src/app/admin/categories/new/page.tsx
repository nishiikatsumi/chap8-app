"use client";
import { useRouter } from 'next/navigation';
import CategoryForm from '@/app/_components/CategoryForm';
import { useFetch } from '@/app/_hooks/useFetch';

interface Category {
  id: number;
  name: string;
}

export default function CategoryNewPage() {
  const router = useRouter();

  // 一覧のmutateとtokenを取得
  const { mutate: mutateCategories, token } = useFetch<{ categories: Category[] }>(
    '/api/admin/categories'
  );

  const handleSubmit = async (name: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      alert('カテゴリーを作成しました');
      // SWRのキャッシュを再検証
      await mutateCategories();
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
