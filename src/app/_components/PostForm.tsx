"use client";
import { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '@/app/_libs/supabase'
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import Image from 'next/image'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

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
  initialData?: {
    title: string;
    content: string;
    thumbnailImageKey: string;
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
    thumbnailImageKey: '',
    selectedCategoryIds: [],
  },
  onSubmit,
  onDelete,
  submitLabel,
}: PostFormProps) {
  const { token, isLoading: isTokenLoading } = useSupabaseSession();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    initialData.selectedCategoryIds
  );
  const [thumbnailImageKey, setThumbnailImageKey] = useState<string>(initialData.thumbnailImageKey);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );  

  useEffect(() => {
    if (!thumbnailImageKey) return

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  useEffect(() => {
    if (isTokenLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
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
  }, [token, isTokenLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({
        title,
        content,
        thumbnailImageKey: thumbnailImageKey || '',
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
      .from('post_thumbnail')　// ここでバケット名を指定
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
    setThumbnailImageKey(data.path)
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

  if (loading || isTokenLoading) {
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
