'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProfile, logoutUser, isAuthenticated } from '@/app/lib/api';
import type { UserProfile } from '@/app/types/user';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    async function fetchProfile() {
      try {
        // ============================================
        // TODO [Backend]: GET /api/profile
        // Headers: Authorization: Bearer <access_token>
        // Response: UserProfile object
        // ============================================
        const data = await getProfile();
        setProfile(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้';
        setError(message);
        // If unauthorized, redirect to login
        if (err instanceof Error && 'status' in err && (err as Error & { status: number }).status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'badge badge-admin';
      case 'author': return 'badge badge-author';
      default: return 'badge badge-user';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'author': return 'Author';
      default: return 'User';
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

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="glass-card p-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 mb-4">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-[#94a3b8] mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-secondary">ลองใหม่อีกครั้ง</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Header with logout */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">โปรไฟล์ของฉัน</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-[#94a3b8] hover:text-red-400 transition-colors flex items-center gap-1.5"
            id="logout-btn"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            ออกจากระบบ
          </button>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8">
          {/* Avatar & Name */}
          <div className="flex items-center gap-5 mb-8">
            <div className="avatar-placeholder">
              {profile?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile?.username}</h2>
              <span className={getRoleBadgeClass(profile?.role || 'user')}>
                {getRoleLabel(profile?.role || 'user')}
              </span>
            </div>
          </div>

          {/* Info Rows */}
          <div className="space-y-0">
            <div className="info-row">
              <span className="label">อีเมล</span>
              <span className="value">{profile?.email || '—'}</span>
            </div>
            <div className="info-row">
              <span className="label">เบอร์โทรศัพท์</span>
              <span className="value">{profile?.phone || '—'}</span>
            </div>
            {profile?.role === 'author' && (
              <div className="info-row">
                <span className="label">ความเชี่ยวชาญ</span>
                <span className="value">{profile?.expertise || '—'}</span>
              </div>
            )}
            {profile?.date_joined && (
              <div className="info-row">
                <span className="label">วันที่สมัคร</span>
                <span className="value">
                  {new Date(profile.date_joined).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {profile?.last_login && (
              <div className="info-row">
                <span className="label">เข้าสู่ระบบล่าสุด</span>
                <span className="value">
                  {new Date(profile.last_login).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link href="/profile/edit" className="btn-primary text-center block" id="link-edit-profile">
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              แก้ไขโปรไฟล์
            </span>
          </Link>
          <Link href="/profile/change-password" className="btn-secondary text-center block" id="link-change-password">
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              เปลี่ยนรหัสผ่าน
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
