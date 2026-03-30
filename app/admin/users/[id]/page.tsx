'use client';

import { use } from 'react';
import Link from 'next/link';
import { adminGetUser } from '@/app/lib/api';
import React from 'react';

export type UserRole = 'user' | 'author' | 'admin';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  expertise?: string;
  is_active: boolean;
  date_joined: string;
  last_login: string;
  login_count?: number;
}

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = use(params); // <-- unwrap Promise
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');

      if (!id) {
        setError('Missing user ID');
        setLoading(false);
        return;
      }

      const userId = Number(id);
      if (isNaN(userId)) {
        setError(`Invalid user ID: ${id}`);
        setLoading(false);
        return;
      }

      try {
        const data = await adminGetUser(userId);
        setUser(data);
      } catch (err: any) {
        console.error(err);
        setError('ไม่พบข้อมูลผู้ใช้');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p className="animate-fade-in">Loading...</p>;
  if (error || !user) {
    return (
      <div className="animate-fade-in">
        <div className="detail-header">
          <Link href="/admin/users" className="back-btn">
            กลับ
          </Link>
        </div>
        <div className="empty-state">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : '-';

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'badge badge-admin';
      case 'author':
        return 'badge badge-author';
      default:
        return 'badge badge-user';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="detail-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link href="/admin/users" className="back-btn">
          กลับ
        </Link>
        <div style={{ flex: 1 }} />
        <Link
          href={`/admin/users/${id}/edit`}
          className="btn-primary"
          style={{
            width: '10%',            
            padding: 'auto',      
            fontSize: '0.7rem',       
            borderRadius: '0.375rem', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', 
            gap: '0.2rem',
          }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          แก้ไข
        </Link>
      </div>

      <div className="detail-card full" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            className="avatar-placeholder"
            style={{
              width: '4.5rem',
              height: '4.5rem',
              fontSize: '1.5rem',
              background:
                user.role === 'admin'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : user.role === 'author'
                    ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            }}
          >
            {user.username.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem' }}>
              {user.username}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`} />
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3 className="detail-card-title">ข้อมูลบัญชี</h3>
          <div className="detail-row"><span className="detail-row-label">ชื่อผู้ใช้</span><span className="detail-row-value">{user.username}</span></div>
          <div className="detail-row"><span className="detail-row-label">อีเมล</span><span className="detail-row-value">{user.email}</span></div>
          <div className="detail-row"><span className="detail-row-label">เบอร์โทร</span><span className="detail-row-value">{user.phone || '-'}</span></div>
          <div className="detail-row"><span className="detail-row-label">Role</span><span className={getRoleBadgeClass(user.role)}>{user.role}</span></div>
          {user.role === 'author' && user.expertise && (
            <div className="detail-row"><span className="detail-row-label">ความเชี่ยวชาญ</span><span className="detail-row-value">{user.expertise}</span></div>
          )}
        </div>

        <div className="detail-card">
          <h3 className="detail-card-title">กิจกรรม</h3>
          <div className="detail-row"><span className="detail-row-label">วันที่สมัคร</span><span className="detail-row-value">{formatDate(user.date_joined)}</span></div>
          <div className="detail-row"><span className="detail-row-label">เข้าสู่ระบบล่าสุด</span><span className="detail-row-value">{formatDate(user.last_login)}</span></div>
          <div className="detail-row"><span className="detail-row-label">จำนวนเข้าสู่ระบบ</span><span className="detail-row-value">{user.login_count ?? 0} ครั้ง</span></div>
          <div className="detail-row"><span className="detail-row-label">สถานะ</span><span className="detail-row-value"><span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`} />{user.is_active ? 'ใช้งานอยู่' : 'ปิดใช้งาน'}</span></div>
      
        </div>
      </div>
    </div>
  );
}