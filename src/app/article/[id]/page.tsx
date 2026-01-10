"use client";
import { useState, useEffect } from 'react';
import { getDateString } from '../../_utils/getDateString';
import classes from '../../_styles/Article.module.css';
import DOMPurify from 'isomorphic-dompurify';
import type { Post } from '../../_types/Post';
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
        const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`, {
          cache: 'no-store'
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
      <main className={classes.main}>
        <article key={post.id} className={classes.card}>
          <div>
            <Image
              height={500}
              width={800}
              src={post.thumbnailUrl}
              alt={`${post.title}の画像`}
              className={classes.img}
            />
          </div>
          <div className={classes.header}>
            <span className={classes.date}>{getDateString(post.createdAt)}</span>
            <div className={classes.tags}>
              {post.categories && post.categories.map((tag) => (
                <span key={tag} className={classes.tag}>{tag}</span>
              ))}
            </div>
          </div>
          <h2 className={classes.title}>{post.title}</h2>
          <p
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </article>
      </main>
    </div>
  );
}
