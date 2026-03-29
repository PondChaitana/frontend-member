'use client';

import { use } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/app/lib/mockData';
import type { UserRole } from '@/app/types/user';

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const user = mockUsers.find((u) => String(u.id) === id);

  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="detail-header">
          <Link href="/admin/users" className="back-btn" id="back-to-users">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            กลับ
          </Link>
        </div>
        <div className="empty-state">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
          <p>ไม่พบข้อมูลผู้ใช้</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'badge badge-admin';
      case 'author': return 'badge badge-author';
      default: return 'badge badge-user';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="detail-header">
        <Link href="/admin/users" className="back-btn" id="back-to-users">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          กลับ
        </Link>
        <div style={{ flex: 1 }} />
        <Link
          href={`/admin/users/${user.id}/edit`}
          className="btn-primary"
          style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
          id="edit-user-btn"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
            </svg>
            แก้ไข
          </span>
        </Link>
      </div>

      {/* User Profile Header Card */}
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.375rem', letterSpacing: '-0.025em' }}>
              {user.username}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`} />
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="detail-grid">
        {/* Account Info */}
        <div className="detail-card" id="user-account-info">
          <h3 className="detail-card-title">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            ข้อมูลบัญชี
          </h3>
          <div className="detail-row">
            <span className="detail-row-label">ชื่อผู้ใช้</span>
            <span className="detail-row-value">{user.username}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">อีเมล</span>
            <span className="detail-row-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">เบอร์โทร</span>
            <span className="detail-row-value">{user.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Role</span>
            <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
          </div>
          {user.role === 'author' && user.expertise && (
            <div className="detail-row">
              <span className="detail-row-label">ความเชี่ยวชาญ</span>
              <span className="detail-row-value">{user.expertise}</span>
            </div>
          )}
        </div>

        {/* Activity Info */}
        <div className="detail-card" id="user-activity-info">
          <h3 className="detail-card-title">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            กิจกรรม
          </h3>
          <div className="detail-row">
            <span className="detail-row-label">วันที่สมัคร</span>
            <span className="detail-row-value">{formatDate(user.date_joined)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">เข้าสู่ระบบล่าสุด</span>
            <span className="detail-row-value">{formatDate(user.last_login)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">จำนวนเข้าสู่ระบบ</span>
            <span className="detail-row-value">{user.login_count} ครั้ง</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">สถานะ</span>
            <span className="detail-row-value" style={{ display: 'flex', alignItems: 'center' }}>
              <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`} />
              {user.is_active ? 'ใช้งานอยู่' : 'ปิดใช้งาน'}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">User ID</span>
            <span className="detail-row-value" style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--muted)' }}>
              #{String(user.id).padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
