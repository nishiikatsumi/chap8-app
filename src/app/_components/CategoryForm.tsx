"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '@/app/_hooks/useFetch';

interface CategoryFormData {
  name: string;
}

interface CategoryFormProps {
  categoryId?: string; // 編集時に渡されるカテゴリーID
  onSubmit: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel: string;
}

interface Category {
  id: number;
  name: string;
}

export default function CategoryForm({
  categoryId,
  onSubmit,
  onDelete,
  submitLabel,
}: CategoryFormProps) {
  const [submitting, setSubmitting] = useState(false);

  // 編集モードの場合のみカテゴリーデータを取得
  const { data: categoryData, isLoading: isCategoryLoading } = useFetch<{ category: Category }>(
    categoryId ? `/api/admin/categories/${categoryId}` : null
  );

  const category = categoryData?.category;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
    },
  });

  // カテゴリーデータがフェッチされたらフォームに反映
  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    setSubmitting(true);

    try {
      await onSubmit(data.name);
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

  // 編集モードでデータ読み込み中の場合
  if (categoryId && isCategoryLoading) {
    return <div>読み込み中...</div>;
  }

  // 編集モードでカテゴリーが見つからない場合
  if (categoryId && !category && !isCategoryLoading) {
    return <div>カテゴリーが見つかりませんでした</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-6xl">
      <div className="mb-8">
        <label htmlFor="name" className="block text-base font-semibold text-[#1f2328] mb-2">
          カテゴリー名
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'カテゴリー名は必須です' })}
          className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600"
          disabled={submitting}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
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
