"use client";
import { useState } from 'react';

interface CategoryFormProps {
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  submitLabel: string;
}

export default function CategoryForm({
  initialName = '',
  onSubmit,
  onDelete,
  submitLabel,
}: CategoryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(initialName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(name);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (!confirm('本当に削除しますか？')) {
      return;
    }

    setSubmitting(true);

    try {
      await onDelete();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl">
      <div className="mb-8">
        <label htmlFor="name" className="block text-base font-semibold text-[#1f2328] mb-2">
          カテゴリー名
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 text-base border border-[#d0d7de] rounded-md outline-none transition-colors duration-200 focus:border-blue-600"
          required
          disabled={submitting}
        />
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="submit"
          className="bg-purple-800 text-white px-8 py-3 border-0 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-purple-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-8 py-3 border-0 rounded-md text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
