'use client'

import Link from "next/link";
import { getDateString } from "../_utils/getDateString";
import { useFetch } from "@/app/_hooks/useFetch";
import type { Post } from "../_types/Types";

export default function AdminPage() {
  const { data: postsData, error, isLoading: isLoadingPosts, token } = useFetch<{ posts: Post[] }>(
    '/api/admin/posts'
  );

  const posts = postsData?.posts;

  if (!token) {
    return <div className="text-red-600">認証が必要です</div>;
  }

  if (isLoadingPosts) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    console.error('Error fetching posts:', error);
    return <div className="text-red-600">記事の取得に失敗しました</div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#1f2328]">記事一覧</h1>
          <Link href="/admin/posts/new" className="bg-blue-600 text-white px-6 py-3 border-0 rounded-md text-base font-semibold cursor-pointer no-underline inline-block transition-colors duration-200 hover:bg-blue-700">
            新規作成
          </Link>
        </div>
        <div>記事がまだありません</div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#1f2328]">記事一覧</h1>
        <Link href="/admin/posts/new" className="bg-blue-600 text-white px-6 py-3 border-0 rounded-md text-base font-semibold cursor-pointer no-underline inline-block transition-colors duration-200 hover:bg-blue-700">
          新規作成
        </Link>
      </div>
      <ul className="list-none p-0 m-0">
        {posts.map((post) => (
          <li key={post.id} className="py-6 border-b border-gray-200 cursor-pointer transition-colors duration-200 hover:bg-gray-50">
            <Link href={`/admin/posts/${post.id}`} className="no-underline text-inherit block">
              <h2 className="text-xl font-semibold text-[#1f2328] mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500">
                {getDateString(post.createdAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
