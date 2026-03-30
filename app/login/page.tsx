'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/app/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({
        email: form.email,
        password: form.password,
      });

      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">เข้าสู่ระบบ</h1>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text mb-4">{error}</p>}

            <div className="mb-5">
              <label className="form-label">อีเมล</label>
              <input
                name="email"
                type="email"
                className="form-input"
                placeholder="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="form-label">รหัสผ่าน</label>
              <input
                name="password"
                type="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
          </div>
        </div>
      </div>
    </div>
  );
}