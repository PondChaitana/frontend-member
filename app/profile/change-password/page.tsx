'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, isAuthenticated } from '@/app/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
    setServerError('');
    setSuccess(false);
  };

  const getPasswordStrength = (pw: string) => {
    if (!pw) return '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return 'weak';
    if (score === 2) return 'fair';
    if (score === 3) return 'good';
    return 'strong';
  };

  const strengthLabels: Record<string, string> = {
    weak: 'อ่อน',
    fair: 'พอใช้',
    good: 'ดี',
    strong: 'แข็งแกร่ง',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    // Validate form
    const newErrors: Record<string, string> = {};
    if (!form.current_password) newErrors.current_password = 'กรุณากรอกรหัสผ่านปัจจุบัน';
    if (!form.new_password) newErrors.new_password = 'กรุณากรอกรหัสผ่านใหม่';
    else if (form.new_password.length < 8) newErrors.new_password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
    else if (form.new_password === form.current_password) newErrors.new_password = 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านปัจจุบัน';
    if (!form.confirm_password) newErrors.confirm_password = 'กรุณายืนยันรหัสผ่านใหม่';
    else if (form.new_password !== form.confirm_password) newErrors.confirm_password = 'รหัสผ่านไม่ตรงกัน';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await apiFetch('/api/reset-password/', {
        method: 'POST',
        body: JSON.stringify({
          new_password: form.new_password,
          current_password: form.current_password,
        }),
      });
      setSuccess(true);
      setForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.new_password);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">เปลี่ยนรหัสผ่าน</h1>
            <p className="text-[#94a3b8] text-sm">ใช้ JWT token ในการยืนยันตัวตน</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            {success && <div className="mb-6 p-3.5 rounded-lg bg-green-500/10 border border-green-500/20">เปลี่ยนรหัสผ่านสำเร็จ!</div>}
            {serverError && <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20">{serverError}</div>}

            {/* Current Password */}
            <div className="mb-4">
              <label htmlFor="current-password" className="form-label">รหัสผ่านปัจจุบัน</label>
              <input
                id="current-password"
                name="current_password"
                type="password"
                className={`form-input ${errors.current_password ? 'error' : ''}`}
                value={form.current_password}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่านปัจจุบัน"
              />
              {errors.current_password && <p className="error-text">{errors.current_password}</p>}
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label htmlFor="new-password" className="form-label">รหัสผ่านใหม่</label>
              <input
                id="new-password"
                name="new_password"
                type="password"
                className={`form-input ${errors.new_password ? 'error' : ''}`}
                value={form.new_password}
                onChange={handleChange}
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
              {errors.new_password && <p className="error-text">{errors.new_password}</p>}
              {form.new_password && (
                <p className="text-xs text-[#94a3b8] mt-1">ความแข็งแกร่ง: {strengthLabels[strength]}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirm-new-password" className="form-label">ยืนยันรหัสผ่านใหม่</label>
              <input
                id="confirm-new-password"
                name="confirm_password"
                type="password"
                className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />
              {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'เปลี่ยนรหัสผ่าน'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}