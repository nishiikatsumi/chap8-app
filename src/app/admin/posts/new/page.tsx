"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

export default function PostNewPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categories: selectedCategoryIds.map((id) => ({ id })),
        }),
      });

      if (res.ok) {
        alert('記事を作成しました');
        router.push('/admin');
      } else {
        alert('作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('作成に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: number[] = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(Number(options[i].value));
      }
    }

    setSelectedCategoryIds(selected);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <>
          <h1 className="text-3xl font-bold text-[#1f2328]">記事作成</h1>
          <form onSubmit={handleSubmit} className="max-w-6xl">
            <div className="mb-8">
              <label htmlFor="title" className="block text-base font-semibold text-[#1f2328] mb-2">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="content" className="block text-base font-semibold text-[#1f2328] mb-2">
                内容
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 resize-y font-inherit focus:border-blue-600"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="thumbnailUrl" className="block text-base font-semibold text-[#1f2328] mb-2">
                サムネイルURL
              </label>
              <input
                type="url"
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600"
                required
              />
            </div>

            <div className="mb-8">
              <label htmlFor="categories" className="block text-base font-semibold text-[#1f2328] mb-2">
                カテゴリー
              </label>
              <select
                id="categories"
                multiple
                value={selectedCategoryIds.map(String)}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 bg-white cursor-pointer focus:border-blue-600"
                size={5}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
