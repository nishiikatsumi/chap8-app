"use client";
import Link from 'next/link';
import { getDateString } from './_utils/getDateString';
import DOMPurify from 'isomorphic-dompurify';
import type { Post } from './_types/Types';
import { usePublicFetch } from './_hooks/useFetch';

export default function Home() {
  // usePublicFetchで投稿一覧を取得（認証不要）
  const { data: postsData, isLoading, error } = usePublicFetch<{ posts: Post[] }>('/api/posts');

  const posts = postsData?.posts;

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>記事の読み込みに失敗しました</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>記事がまだありません</div>;
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto py-10 px-5">
        {posts.map(article => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="no-underline text-inherit"
          >
            <article className="bg-white border border-gray-200 px-8 py-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">{getDateString(article.createdAt)}</span>
                <div className="flex gap-2">
                  {article.postCategories && article.postCategories.map((tag) => (
                    <span key={tag.category.id} className="border border-blue-500 text-blue-500 px-3 py-1 rounded text-xs bg-transparent">{tag.category.name}</span>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-normal mb-4 text-gray-800">{article.title}</h2>
              <p
                className="text-sm text-gray-600 leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
              />
            </article>
          </Link>
        ))}
      </main>
    </div>
  );
}
