'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/app/lib/api';

export default function RegisterUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field error on change
    if (errors[e.target.name]) {
      const newErrors = { ...errors };
      delete newErrors[e.target.name];
      setErrors(newErrors);
    }
    setServerError('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    else if (form.username.length < 3) newErrors.username = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร';

    if (!form.email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';

    if (!form.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    else if (!/^[0-9]{9,10}$/.test(form.phone.replace(/[-\s]/g, ''))) newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';

    if (!form.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    else if (form.password.length < 8) newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';

    if (!form.confirm_password) newErrors.confirm_password = 'กรุณายืนยันรหัสผ่าน';
    else if (form.password !== form.confirm_password) newErrors.confirm_password = 'รหัสผ่านไม่ตรงกัน';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      // ============================================
      // TODO [Backend]: POST /api/auth/register
      // Body: { username, email, phone, password }
      // Response: { success: true, user_id: string }
      // ============================================
      await registerUser({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength
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

  const strength = getPasswordStrength(form.password);

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="glass-card p-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">สมัครสมาชิกสำเร็จ!</h2>
            <p className="text-[#94a3b8]">กำลังนำไปหน้าเข้าสู่ระบบ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] mb-4 shadow-lg shadow-purple-500/20">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">สมัครสมาชิก</h1>
          <p className="text-[#94a3b8] mt-2 text-sm">สร้างบัญชีผู้ใช้ใหม่</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} id="register-user-form">
            {serverError && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="error-text" style={{ marginTop: 0 }}>{serverError}</span>
              </div>
            )}

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="reg-username" className="form-label">ชื่อผู้ใช้</label>
              <input id="reg-username" name="username" type="text" className={`form-input ${errors.username ? 'error' : ''}`} placeholder="username" value={form.username} onChange={handleChange} />
              {errors.username && <p className="error-text">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="reg-email" className="form-label">อีเมล</label>
              <input id="reg-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="reg-phone" className="form-label">เบอร์โทรศัพท์</label>
              <input id="reg-phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="0812345678" value={form.phone} onChange={handleChange} />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="reg-password" className="form-label">รหัสผ่าน</label>
              <input id="reg-password" name="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="อย่างน้อย 8 ตัวอักษร" value={form.password} onChange={handleChange} />
              {errors.password && <p className="error-text">{errors.password}</p>}
              {form.password && (
                <div className="mt-2">
                  <div className={`strength-bar strength-${strength}`}><div className="fill" /></div>
                  <p className="text-xs text-[#94a3b8] mt-1">ความแข็งแกร่ง: <span className="font-medium">{strengthLabels[strength]}</span></p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="reg-confirm-password" className="form-label">ยืนยันรหัสผ่าน</label>
              <input id="reg-confirm-password" name="confirm_password" type="password" className={`form-input ${errors.confirm_password ? 'error' : ''}`} placeholder="กรอกรหัสผ่านอีกครั้ง" value={form.confirm_password} onChange={handleChange} />
              {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={loading} id="register-user-submit-btn">
              {loading ? (
                <span className="flex items-center justify-center gap-2"><span className="spinner" />กำลังสมัคร...</span>
              ) : (
                'สมัครสมาชิก'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center text-sm text-[#94a3b8]">
            <p>
              เป็น Author?{' '}
              <Link href="/register/author" className="auth-link" id="link-to-register-author">
                สมัครเป็น Author
              </Link>
            </p>
            <p>
              มีบัญชีอยู่แล้ว?{' '}
              <Link href="/login" className="auth-link" id="link-to-login">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
