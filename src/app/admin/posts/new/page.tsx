"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from "../../../_components/AdminSidebar";
import classes from "../../../_styles/Admin.module.css";

interface Category {
  id: number;
  name: string;
}

export default function PostNewPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts`, {
        method: 'POST',
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
        alert('記事を作成しました');
        router.push('/admin');
      } else {
        alert('作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('作成に失敗しました');
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
    return (
      <>
        <div className={classes.container}>
          <AdminSidebar />
          <main className={classes.mainContent}>
            <div>読み込み中...</div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={classes.container}>
        <AdminSidebar />
        <main className={classes.mainContent}>
          <h1 className={classes.title}>記事作成</h1>
          <form onSubmit={handleSubmit} className={classes.form}>
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
                作成
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
