"use client";
import { useState, ChangeEvent } from 'react';
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import Image from 'next/image'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useFetch } from '@/app/_hooks/useFetch';

interface Category {
  id: number;
  name: string;
}

export interface PostFormData {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: { id: number }[];
}

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel: string;
}

// サムネイル画像URL取得用のfetcher関数
const thumbnailFetcher = async (key: string) => {
  const {
    data: { publicUrl },
  } = await supabase.storage
    .from('post_thumbnail')
    .getPublicUrl(key);

  return publicUrl;
};

export default function PostForm({
  defaultValues,
  onSubmit,
  onDelete,
  submitLabel
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostFormData>({
    defaultValues: {
      title: defaultValues?.title || '',
      content: defaultValues?.content || '',
      thumbnailImageKey: defaultValues?.thumbnailImageKey || '',
      categories: defaultValues?.categories || [],
    }
  });

  const [submitting, setSubmitting] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    defaultValues?.categories?.map(cat => cat.id) || []
  );

  const thumbnailImageKey = watch('thumbnailImageKey');

  // useFetchでカテゴリーを取得
  const { data: categoriesData, isLoading: isCategoriesLoading } = useFetch<{ categories: Category[] }>(
    '/api/admin/categories'
  );

  const categories = categoriesData?.categories;

  // SWRでサムネイル画像URLを取得
  const { data: thumbnailImageUrl } = useSWR(
    thumbnailImageKey ? thumbnailImageKey : null,
    thumbnailFetcher
  );

  const handleFormSubmit = async (data: PostFormData) => {
    setSubmitting(true);

    try {
      await onSubmit({
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: selectedCategoryIds.map(id => ({ id })),
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

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    const file = event.target.files[0] // 選択された画像を取得

    const filePath = `private/${uuidv4()}` // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setValue('thumbnailImageKey', data.path)
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

  if (isCategoriesLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-6xl">
      <div className="mb-8">
        <label htmlFor="title" className="block text-base font-semibold text-[#1f2328] mb-2">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'タイトルは必須です' })}
          className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600"
          disabled={submitting}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-8">
        <label htmlFor="content" className="block text-base font-semibold text-[#1f2328] mb-2">
          内容
        </label>
        <textarea
          id="content"
          {...register('content', { required: '内容は必須です' })}
          className="w-full min-h-[200px] px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 resize-y font-inherit focus:border-blue-600"
          disabled={submitting}
        />
        {errors.content && (
          <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="mb-8">
        <label
          htmlFor="thumbnailImageKey"
          className="block text-base font-semibold text-[#1f2328] mb-2"
        >
          サムネイル画像
        </label>
        {!thumbnailImageUrl ? (
          <input
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
            disabled={submitting}
            className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        ) : (
          <div>
            <div className="mb-4">
              <Image
                src={thumbnailImageUrl}
                alt="thumbnail"
                width={400}
                height={400}
                className="rounded-md border border-[#d0d7de]"
              />
            </div>
            <label
              htmlFor="thumbnailImageKey"
              className="inline-block bg-gray-100 text-gray-700 px-6 py-2 border border-[#d0d7de] rounded-md text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-gray-200"
            >
              画像を変更
              <input
                type="file"
                id="thumbnailImageKey"
                onChange={handleImageChange}
                accept="image/*"
                disabled={submitting}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>


      <div className="mb-8">
        <label className="block text-base font-semibold text-[#1f2328] mb-2">
          カテゴリー
        </label>
        <div className="border border-[#d0d7de] rounded-md p-4 bg-white">
          {!categories || categories.length === 0 ? (
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
