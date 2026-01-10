"use client";
import { useState } from 'react';
import classes from "../_styles/Contact.module.css";

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
    <div className={classes.container}>
      <div className={classes['form-wrapper']}>
        <h1 className={classes.title}>問合わせフォーム</h1>

        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <div className={classes['form-group']}>
            <div className={classes['form-row']}>
              <label className={classes['form-label']}>お名前</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
				        required
				        disabled={loading}
                className={`${classes['form-input']} ${errors.name ? classes['input-error'] : ''}`}
              />
            </div>
              {errors.name && (
              <div className={classes['error-message']}>{errors.name}</div>
            )}
          </div>

          <div className={classes['form-group']}>
            <div className={classes['form-row']}>
              <label className={classes['form-label']}>メールアドレス</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
				        required
				        disabled={loading}
                className={`${classes['form-input']} ${errors.email ? classes['input-error'] : ''}`}
              />
            </div>
            {errors.email && (
              <div className={classes['error-message']}>{errors.email}</div>
            )}
          </div>

          <div className={classes['form-group']}>
            <div className={`${classes['form-row']} ${classes['form-row-textarea']}`}>
              <label className={classes['form-label']}>本文</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={8}
				        required
				        disabled={loading}
                className={`${classes['form-textarea']} ${errors.message ? classes['input-error'] : ''}`}
              />
            </div>
            {errors.message && (
              <div className={classes['error-message']}>{errors.message}</div>
            )}
          </div>

          <div className={classes['button-group']}>
            <button type="submit" disabled={loading} className={`${classes.btn} ${classes['btn-submit']}`}>
              送信
            </button>
            <button type="button" disabled={loading} onClick={handleClear} className={`${classes.btn} ${classes['btn-clear']}`}>
              クリア
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
