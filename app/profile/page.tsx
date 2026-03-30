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
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้';
        setError(message);
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
    router.push('/');
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
            ออกจากระบบ
          </button>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-8">
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

          <div className="space-y-0">
            <div className="info-row">
              <span className="label">ชื่อเต็ม</span>
              <span className="value">{profile?.fullname || '—'}</span>
            </div>
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link href="/profile/edit" className="btn-primary text-center block">
            แก้ไขโปรไฟล์
          </Link>
          <Link href="/profile/change-password" className="btn-secondary text-center block">
            เปลี่ยนรหัสผ่าน
          </Link>
        </div>
      </div>
    </div>
  );
}