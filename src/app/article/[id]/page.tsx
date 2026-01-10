"use client";
import { useState, useEffect } from 'react';
import { getDateString } from '../../_utils/getDateString';
import classes from '../../_styles/Article.module.css';
import DOMPurify from 'isomorphic-dompurify';
import type { MicroCmsPost } from '../../_types/MicroCmsPost';
import Image from 'next/image';

interface Props {
  params: Promise<{
    id: string;
  }>;
}


export default function Article(props: Props) {
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { id } = await props.params;
        const res = await fetch(`https://4v36lonum5.microcms.io/api/v1/posts/${id}`, {
          headers: {
            'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
          }
        });

        if (res.ok) {
          const data = await res.json();
          setPost(data);
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
              src={post.thumbnail.url}
              alt={`${post.title}の画像`}
              className={classes.img}
            />
          </div>
          <div className={classes.header}>
            <span className={classes.date}>{getDateString(post.createdAt)}</span>
            <div className={classes.tags}>
              {post.categories && post.categories.map((tag) => (
                <span key={tag.id} className={classes.tag}>{tag.name}</span> 
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
