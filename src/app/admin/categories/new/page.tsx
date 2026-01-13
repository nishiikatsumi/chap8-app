"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import classes from "../../../_styles/Admin.module.css";

export default function CategoryNewPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        alert('カテゴリーを作成しました');
        router.push('/admin/categories');
      } else {
        alert('作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('作成に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className={classes.title}>カテゴリー作成</h1>
          <form onSubmit={handleSubmit} className={classes.form}>
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
                作成
              </button>
            </div>
          </form>
    </>
  );
}
