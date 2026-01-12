"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "../../../_components/Header";
import AdminSidebar from "../../../_components/AdminSidebar";
import classes from "../../../_styles/Admin.module.css";

interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryEditPage({ params }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          setCategory(data.category);
          setName(data.category.name);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { id } = await params;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        alert('カテゴリーを更新しました');
        router.push('/admin/categories');
      } else {
        alert('更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('カテゴリーを削除しました');
        router.push('/admin/categories');
      } else {
        alert('削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('削除に失敗しました');
    } finally {
      setSubmitting(false);
    }
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

  if (!category) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <AdminSidebar />
          <main className={classes.mainContent}>
            <div>カテゴリーが見つかりませんでした</div>
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
          <h1 className={classes.title}>カテゴリー編集</h1>
          <form onSubmit={handleUpdate} className={classes.form}>
            <div className={classes.formGroup}>
              <label htmlFor="name" className={classes.label}>
                カテゴリー名
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={classes.input}
                required
              />
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
        </main>
      </div>
    </>
  );
}
