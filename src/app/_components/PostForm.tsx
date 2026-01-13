"use client";
import { useState } from 'react';

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
  categories: Category[];
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
  categories,
  onSubmit,
  onDelete,
  submitLabel,
}: PostFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    initialData.selectedCategoryIds
  );

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
          disabled={submitting}
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
