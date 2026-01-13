"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDateString } from './_utils/getDateString';
import DOMPurify from 'isomorphic-dompurify';
import type { Post } from './_types/Types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts', {
          cache: "no-cache"
        });

        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (posts.length === 0) {
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
