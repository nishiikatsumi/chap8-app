'use client'

import Link from "next/link";
import { PostsIndexResponse } from "../_types/PrismaTypes";
import { getDateString } from "../_utils/getDateString";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export default function AdminPage() {
  const { token } = useSupabaseSession();

  const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token,
    },
    cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data: PostsIndexResponse = await res.json();
    return data.posts;
  };

  const { data: posts, error, isLoading: isLoadingPosts } = useSWR(
    token ? ['/api/admin/posts', token] : null,
    ([url, token]) => fetcher(url, token)
  );

  if (isLoadingPosts) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    console.error('Error fetching posts:', error);
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
        {posts?.map((post) => (
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
