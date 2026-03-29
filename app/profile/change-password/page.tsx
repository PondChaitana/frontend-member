'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { changePassword, isAuthenticated } from '@/app/lib/api';

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
    if (!isAuthenticated()) {
      router.push('/login');
    }
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.current_password) newErrors.current_password = 'กรุณากรอกรหัสผ่านปัจจุบัน';

    if (!form.new_password) newErrors.new_password = 'กรุณากรอกรหัสผ่านใหม่';
    else if (form.new_password.length < 8) newErrors.new_password = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร';
    else if (form.new_password === form.current_password) newErrors.new_password = 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านปัจจุบัน';

    if (!form.confirm_password) newErrors.confirm_password = 'กรุณายืนยันรหัสผ่านใหม่';
    else if (form.new_password !== form.confirm_password) newErrors.confirm_password = 'รหัสผ่านไม่ตรงกัน';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);
    try {
      // ============================================
      // TODO [Backend]: POST /api/auth/change-password
      // Headers: Authorization: Bearer <access_token>
      // Body: {
      //   current_password: string,
      //   new_password: string,
      //   confirm_password: string
      // }
      // Response: { success: true, new_token?: string }
      //
      // Notes:
      // - Verify current_password against stored hash
      // - Hash new_password before saving
      // - Optionally return new JWT token
      // ============================================
      await changePassword({
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            id="back-to-profile-from-password"
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

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} id="change-password-form">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="success-text">เปลี่ยนรหัสผ่านสำเร็จ!</span>
              </div>
            )}

            {/* Server Error */}
            {serverError && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="error-text" style={{ marginTop: 0 }}>{serverError}</span>
              </div>
            )}

            {/* Security Notice */}
            <div className="mb-6 p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400 shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-300 font-medium">ยืนยันตัวตนด้วย JWT</p>
                  <p className="text-xs text-blue-300/70 mt-0.5">การเปลี่ยนรหัสผ่านจะใช้ token ปัจจุบันในการยืนยัน</p>
                </div>
              </div>
            </div>

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
                autoComplete="current-password"
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
                autoComplete="new-password"
              />
              {errors.new_password && <p className="error-text">{errors.new_password}</p>}
              {form.new_password && (
                <div className="mt-2">
                  <div className={`strength-bar strength-${strength}`}><div className="fill" /></div>
                  <p className="text-xs text-[#94a3b8] mt-1">ความแข็งแกร่ง: <span className="font-medium">{strengthLabels[strength]}</span></p>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
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
                autoComplete="new-password"
              />
              {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
              {form.confirm_password && form.new_password === form.confirm_password && (
                <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  รหัสผ่านตรงกัน
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={loading} id="change-password-submit-btn">
              {loading ? (
                <span className="flex items-center justify-center gap-2"><span className="spinner" />กำลังเปลี่ยนรหัสผ่าน...</span>
              ) : (
                'เปลี่ยนรหัสผ่าน'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
