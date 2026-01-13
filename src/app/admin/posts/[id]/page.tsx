"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import classes from "../../../_styles/Admin.module.css";
import type { Post, Category } from "../../../_types/Types";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function PostEditPage({ params }: Props) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;

        const [postRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
            cache: 'no-store',
          }),
        ]);

        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData.post);
          setTitle(postData.post.title);
          setContent(postData.post.content);
          setThumbnailUrl(postData.post.thumbnailUrl);
          setSelectedCategoryIds(
            postData.post.postCategories.map((pc: Category) => pc.id)
          );
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { id } = await params;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categories: selectedCategoryIds.map((id) => ({ id })),
        }),
      });

      if (res.ok) {
        alert('記事を更新しました');
        router.push('/admin');
      } else {
        alert('更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    setSubmitting(true);

    try {
      const { id } = await params;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('記事を削除しました');
        router.push('/admin');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('削除に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: number[] = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(Number(options[i].value));
      }
    }

    setSelectedCategoryIds(selected);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!post) {
    return <div>記事が見つかりませんでした</div>;
  }

  return (
    <>
          <h1 className={classes.title}>記事編集</h1>
          <form onSubmit={handleUpdate} className={classes.form}>
            <div className={classes.formGroup}>
              <label htmlFor="title" className={classes.label}>
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={classes.input}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="content" className={classes.label}>
                内容
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={classes.textarea}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="thumbnailUrl" className={classes.label}>
                サムネイルURL
              </label>
              <input
                type="url"
                id="thumbnailUrl"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className={classes.input}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="categories" className={classes.label}>
                カテゴリー
              </label>
              <select
                id="categories"
                multiple
                value={selectedCategoryIds.map(String)}
                onChange={handleCategoryChange}
                className={classes.select}
                size={5}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.buttonGroup}>
              <button
                type="submit"
                className={classes.updateButton}
                disabled={submitting}
              >
                更新
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={classes.deleteButton}
                disabled={submitting}
              >
                削除
              </button>
            </div>
          </form>
    </>
  );
}
