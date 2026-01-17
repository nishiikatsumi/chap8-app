'use client'

import { supabase } from '@/app/_libs/supabase'; // 前の工程で作成したファイル
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { UserInputs } from '@/app/_types/Types';

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInputs>()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: UserInputs) => {

    setIsSubmitting(true)

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })
    if (error) {
      alert('登録に失敗しました')
      setIsSubmitting(false)
    } else {
      alert('確認メールを送信しました。メールのリンクをクリックして登録を完了してください。')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center pt-60">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-100">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.email ? 'border-red-400 bg-red-500/5' : 'border-white/10'}`}
            placeholder="name@company.com"
            disabled={isSubmitting}
            {...register('email', {
              required: 'メールアドレスは必須です',
               pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください',
              },
            })}
          />
          {errors.email && (
            <span className="flex items-center gap-1.5 mt-2 text-sm text-red-400">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${errors.password ? 'border-red-400 bg-red-500/5' : 'border-white/10'}`}
            disabled={isSubmitting}
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 8,
                message: 'パスワードは8文字以上で入力してください',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: '大文字・小文字・数字を含めてください',
              },
            })}
          />
          {errors.password && (
            <span className="flex items-center gap-1.5 mt-2 text-sm text-red-400">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isSubmitting}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}