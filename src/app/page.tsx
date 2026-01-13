"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDateString } from './_utils/getDateString';
import classes from './_styles/Home.module.css';
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
      <main className={classes.main}>
        {posts.map(article => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className={classes.cardLink}
          >
            <article className={classes.card}>
              <div className={classes.header}>
                <span className={classes.date}>{getDateString(article.createdAt)}</span>
                <div className={classes.tags}>
                  {article.postCategories && article.postCategories.map((tag) => (
                    <span key={tag.category.id} className={classes.tag}>{tag.category.name}</span>
                  ))}
                </div>
              </div>
              <h2 className={classes.title}>{article.title}</h2>
              <p
                className={classes.excerpt}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
              />
            </article>
          </Link>
        ))}
      </main>
    </div>
  );
}
