import Link from "next/link";
import { PostsIndexResponse } from "../_types/PrismaTypes";
import { getDateString } from "../_utils/getDateString";

async function getPosts(): Promise<PostsIndexResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

export default async function AdminPage() {
  const { posts } = await getPosts();

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
