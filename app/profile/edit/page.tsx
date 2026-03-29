'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProfile, updateProfile, isAuthenticated } from '@/app/lib/api';
import type { UserProfile } from '@/app/types/user';

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ email: '', phone: '', expertise: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    async function fetchProfile() {
      try {
        // ============================================
        // TODO [Backend]: GET /api/profile
        // Headers: Authorization: Bearer <access_token>
        // Response: UserProfile (pre-fill form)
        // ============================================
        const data = await getProfile();
        setProfile(data);
        setForm({
          email: data.email || '',
          phone: data.phone || '',
          expertise: data.expertise || '',
        });
      } catch {
        setServerError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';

    if (!form.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    else if (!/^[0-9]{9,10}$/.test(form.phone.replace(/[-\s]/g, ''))) newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';

    if (profile?.role === 'author' && !form.expertise.trim()) {
      newErrors.expertise = 'กรุณากรอกความเชี่ยวชาญ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setSuccess(false);

    if (!validate()) return;

    setSaving(true);
    try {
      // ============================================
      // TODO [Backend]: PUT /api/profile
      // Headers: Authorization: Bearer <access_token>
      // Body: { email?, phone?, expertise? }
      // Response: { success: true, user: UserProfile }
      // ============================================
      const payload: Record<string, string> = {
        email: form.email,
        phone: form.phone,
      };
      if (profile?.role === 'author') {
        payload.expertise = form.expertise;
      }

      await updateProfile(payload);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ';
      setServerError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner mb-4 mx-auto" style={{ width: '2.5rem', height: '2.5rem', borderWidth: '3px' }} />
          <p className="text-[#94a3b8]">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            id="back-to-profile"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">แก้ไขโปรไฟล์</h1>
            <p className="text-[#94a3b8] text-sm">อัปเดตข้อมูลส่วนตัวของคุณ</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} id="edit-profile-form">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="success-text">บันทึกข้อมูลสำเร็จ!</span>
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

            {/* Username (read-only) */}
            <div className="mb-4">
              <label className="form-label">ชื่อผู้ใช้</label>
              <input
                type="text"
                className="form-input opacity-50 cursor-not-allowed"
                value={profile?.username || ''}
                disabled
                id="edit-username-readonly"
              />
              <p className="text-xs text-[#64748b] mt-1">ชื่อผู้ใช้ไม่สามารถเปลี่ยนได้</p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="edit-email" className="form-label">อีเมล</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="edit-phone" className="form-label">เบอร์โทรศัพท์</label>
              <input
                id="edit-phone"
                name="phone"
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                value={form.phone}
                onChange={handleChange}
                placeholder="0812345678"
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>

            {/* Expertise (Author only) */}
            {profile?.role === 'author' && (
              <div className="mb-4">
                <label htmlFor="edit-expertise" className="form-label">ความเชี่ยวชาญ</label>
                <input
                  id="edit-expertise"
                  name="expertise"
                  type="text"
                  className={`form-input ${errors.expertise ? 'error' : ''}`}
                  value={form.expertise}
                  onChange={handleChange}
                  placeholder="เช่น Machine Learning, Web Development"
                />
                {errors.expertise && <p className="error-text">{errors.expertise}</p>}
              </div>
            )}

            {/* Role (read-only) */}
            <div className="mb-6">
              <label className="form-label">บทบาท</label>
              <input
                type="text"
                className="form-input opacity-50 cursor-not-allowed"
                value={profile?.role === 'author' ? 'Author' : profile?.role === 'admin' ? 'Admin' : 'User'}
                disabled
                id="edit-role-readonly"
              />
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" disabled={saving} id="edit-profile-submit-btn">
              {saving ? (
                <span className="flex items-center justify-center gap-2"><span className="spinner" />กำลังบันทึก...</span>
              ) : (
                'บันทึกการเปลี่ยนแปลง'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
