"use client";
import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

export interface PostFormData {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: { id: number }[];
}

interface PostFormProps {
  initialData?: {
    title: string;
    content: string;
    thumbnailUrl: string;
    selectedCategoryIds: number[];
  };
  onSubmit: (data: PostFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel: string;
}

export default function PostForm({
  initialData = {
    title: '',
    content: '',
    thumbnailUrl: '',
    selectedCategoryIds: [],
  },
  onSubmit,
  onDelete,
  submitLabel,
}: PostFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    initialData.selectedCategoryIds
  );

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
      await onSubmit({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategoryIds.map((id) => ({ id })),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (!confirm('本当に削除しますか？')) {
      return;
    }

    setSubmitting(true);

    try {
      await onDelete();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(categoryId)) {
        // すでに選択されている場合は削除
        return prev.filter((id) => id !== categoryId);
      } else {
        // 選択されていない場合は追加
        return [...prev, categoryId];
      }
    });
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
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
          disabled={submitting}
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
          disabled={submitting}
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
          disabled={submitting}
        />
      </div>

      <div className="mb-8">
        <label className="block text-base font-semibold text-[#1f2328] mb-2">
          カテゴリー
        </label>
        <div className="border border-[#d0d7de] rounded-md p-4 bg-white">
          {categories.length === 0 ? (
            <div className="text-gray-500">カテゴリーがありません</div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    disabled={submitting}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-base">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="submit"
          className="bg-purple-800 text-white px-8 py-3 border-0 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-8 py-3 border-0 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
