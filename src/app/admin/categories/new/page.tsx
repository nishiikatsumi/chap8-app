"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryNewPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
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
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('作成に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-[#1f2328]">カテゴリー作成</h1>
          <form onSubmit={handleSubmit} className="max-w-6xl">
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
                作成
              </button>
            </div>
          </form>
    </>
  );
}
