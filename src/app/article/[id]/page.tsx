"use client";
import { use } from 'react';
import { getDateString } from '../../_utils/getDateString';
import DOMPurify from 'isomorphic-dompurify';
import type { Post } from '../../_types/Types';
import Image from 'next/image';
import { supabase } from '@/app/_libs/supabase';
import useSWR from 'swr';
import { usePublicFetch } from '@/app/_hooks/useFetch';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// サムネイル画像URL取得用のfetcher関数
const thumbnailFetcher = async (key: string) => {
  const { data: urlData } = supabase.storage
    .from('post_thumbnail')
    .getPublicUrl(key);
  return urlData.publicUrl;
};

export default function Article(props: Props) {
  const { id } = use(props.params);

  // usePublicFetchで投稿データを取得（認証不要）
  const { data: postData, isLoading: isPostLoading, error } = usePublicFetch<{ post: Post }>(
    `/api/posts/${id}`
  );

  const post = postData?.post;

  // SWRでサムネイル画像URLを取得
  const { data: thumbnailUrl } = useSWR(
    post?.thumbnailImageKey ? post.thumbnailImageKey : null,
    thumbnailFetcher
  );

  if (isPostLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>記事の読み込みに失敗しました</div>;
  }

  if (post == null) {
    return <div>記事が見つかりませんでした</div>;
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto py-10 px-5">
        <article key={post.id} className="bg-white border border-gray-200 px-8 py-6 mb-6">
          {thumbnailUrl && (
            <div>
              <Image
                height={500}
                width={800}
                src={thumbnailUrl}
                alt={`${post.title}の画像`}
                className="w-full h-auto rounded"
              />
            </div>
          )}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">{getDateString(post.createdAt)}</span>
            <div className="flex gap-2">
              {post.postCategories && post.postCategories.map((tag) => (
                <span key={tag.category.id} className="border border-blue-500 text-blue-500 px-3 py-1 rounded text-xs bg-transparent">{tag.category.name}</span>
              ))}
            </div>
          </div>
          <h2 className="text-xl font-normal mb-4 text-gray-800">{post.title}</h2>
          <p
            className="text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </article>
      </main>
    </div>
  );
}
