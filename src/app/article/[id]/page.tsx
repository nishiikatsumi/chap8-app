"use client";
import { useState, useEffect } from 'react';
import { getDateString } from '../../_utils/getDateString';
import DOMPurify from 'isomorphic-dompurify';
import type { Post } from '../../_types/Types';
import Image from 'next/image';

interface Props {
  params: Promise<{
    id: string;
  }>;
}


export default function Article(props: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { id } = await props.params;
        const res = await fetch(`/api/posts/${id}`, {
          cache: "no-cache"
        });

        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          setPost(null);
        }
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [props.params]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (post == null) {
    return <div>記事が見つかりませんでした</div>;
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto py-10 px-5">
        <article key={post.id} className="bg-white border border-gray-200 px-8 py-6 mb-6">
          <div>
            <Image
              height={500}
              width={800}
              src={post.thumbnailUrl}
              alt={`${post.title}の画像`}
              className="w-full h-auto rounded"
            />
          </div>
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
