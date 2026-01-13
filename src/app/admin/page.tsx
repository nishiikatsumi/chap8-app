import Link from "next/link";
import classes from "../_styles/Admin.module.css";
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
      <div className={classes.header}>
        <h1 className={classes.title}>記事一覧</h1>
        <Link href="/admin/posts/new" className={classes.createButton}>
          新規作成
        </Link>
      </div>
      <ul className={classes.postList}>
        {posts.map((post) => (
          <li key={post.id} className={classes.postItem}>
            <Link href={`/admin/posts/${post.id}`} className={classes.postLink}>
              <h2 className={classes.postTitle}>{post.title}</h2>
              <p className={classes.postDate}>
                {getDateString(post.createdAt)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
