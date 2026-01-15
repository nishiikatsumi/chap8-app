"use client";
import { useState } from 'react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

	const validateName = (name: string) => {
	  if (name.trim() === '') {
	    return 'お名前は必須です。';
	  } else if (name.length > 30) {
	    return 'お名前は30文字以内で入力してください。';
	  }
    return '';
	};

  const validateEmail = (email: string) => {
    if (!email) {
      return 'メールアドレスは必須です。';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'メールアドレスの形式が正しくありません。';
    }
    return '';
  };

	const validateMessage = (message: string) => {
		if (message.trim() === '') {
	    return '本文は必須です。';
	  } else if (message.length > 500) {
	    return '本文は500文字以内で入力してください。';
	  }
    return '';
	};

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'message':
        return validateMessage(value);
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message)
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
	  setLoading(true);

	  try {
	    const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
	      method: "POST",
		  headers: {
		    "Content-Type": "application/json"
		  },
		  body: JSON.stringify(formData)
	    });
		  if (res.ok) {
		    alert('送信しました');
		    handleClear();
		  }
	  } catch {
	    alert("送信に失敗しました");
	  } finally {
	    setLoading(false);
	  }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setErrors({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-10">問合わせフォーム</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="flex flex-col">
            <div className="flex items-center gap-8">
              <label className="w-32 text-sm flex-shrink-0">お名前</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
				        required
				        disabled={loading}
                className={`flex-1 px-4 py-3 border rounded-lg text-base outline-none transition-colors duration-200 ${
                  errors.name
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-300'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300'
                }`}
              />
            </div>
              {errors.name && (
              <div className="text-red-600 text-sm mt-2 ml-40">{errors.name}</div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-8">
              <label className="w-32 text-sm flex-shrink-0">メールアドレス</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
				        required
				        disabled={loading}
                className={`flex-1 px-4 py-3 border rounded-lg text-base outline-none transition-colors duration-200 ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-300'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300'
                }`}
              />
            </div>
            {errors.email && (
              <div className="text-red-600 text-sm mt-2 ml-40">{errors.email}</div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-start gap-8">
              <label className="w-32 text-sm flex-shrink-0 pt-3">本文</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={8}
				        required
				        disabled={loading}
                className={`flex-1 px-4 py-3 border rounded-lg text-base outline-none transition-colors duration-200 resize-y font-inherit ${
                  errors.message
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-300'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300'
                }`}
              />
            </div>
            {errors.message && (
              <div className="text-red-600 text-sm mt-2 ml-40">{errors.message}</div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 text-white px-8 py-2.5 rounded-lg text-base cursor-pointer border-0 transition-colors duration-200 hover:bg-gray-700"
            >
              送信
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleClear}
              className="bg-gray-200 text-gray-800 px-8 py-2.5 rounded-lg text-base cursor-pointer border-0 transition-colors duration-200 hover:bg-gray-300"
            >
              クリア
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
