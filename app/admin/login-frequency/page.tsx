'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockLoginFrequency } from '@/app/lib/mockData';
import type { UserRole } from '@/app/types/user';

type SortOrder = 'desc' | 'asc';

export default function LoginFrequencyPage() {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const sortedData = useMemo(() => {
    let data = [...mockLoginFrequency];

    if (roleFilter !== 'all') {
      data = data.filter((item) => item.role === roleFilter);
    }

    data.sort((a, b) =>
      sortOrder === 'desc' ? b.login_count - a.login_count : a.login_count - b.login_count
    );

    return data;
  }, [sortOrder, roleFilter]);

  const maxCount = Math.max(...mockLoginFrequency.map((d) => d.login_count));

  const getRankBadge = (index: number) => {
    if (sortOrder === 'asc') {
      // Don't show rank when sorted ascending
      return <span className="rank-badge normal">{index + 1}</span>;
    }
    switch (index) {
      case 0: return <span className="rank-badge gold">1</span>;
      case 1: return <span className="rank-badge silver">2</span>;
      case 2: return <span className="rank-badge bronze">3</span>;
      default: return <span className="rank-badge normal">{index + 1}</span>;
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'badge badge-admin';
      case 'author': return 'badge badge-author';
      default: return 'badge badge-user';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Title */}
      <div className="page-title-section">
        <h1 className="page-title" id="login-frequency-title">Login Frequency</h1>
        <p className="page-description">
          สถิติความถี่ในการเข้าสู่ระบบของผู้ใช้ — เรียงตามจำนวนล็อกอิน
        </p>
      </div>

      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            id="frequency-role-filter"
          >
            <option value="all">ทุก Role</option>
            <option value="user">User</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>

          <button
            className={`chart-tab ${sortOrder === 'desc' ? 'active' : ''}`}
            onClick={() => setSortOrder('desc')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--card-border)' }}
            id="sort-desc-btn"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.914-.493a8.63 8.63 0 01-.188.685l-.004.015a7.593 7.593 0 01-.054.2c-.054.191-.12.38-.198.566a7.543 7.543 0 01-2.637 3.32A7.46 7.46 0 018 19.5" />
              </svg>
              มาก → น้อย
            </span>
          </button>

          <button
            className={`chart-tab ${sortOrder === 'asc' ? 'active' : ''}`}
            onClick={() => setSortOrder('asc')}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--card-border)' }}
            id="sort-asc-btn"
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.914-.493a8.63 8.63 0 00.188.685l.004.015c.017.06.036.12.054.2.054.191.12.38.198.566A7.543 7.543 0 0017.25 18a7.46 7.46 0 003.086-1.673" />
              </svg>
              น้อย → มาก
            </span>
          </button>
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
          {sortedData.length} ผู้ใช้
        </div>
      </div>

      {/* Frequency Table */}
      <div className="data-table-wrapper">
        <table className="data-table" id="frequency-data-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
              <th>ผู้ใช้</th>
              <th>Role</th>
              <th>จำนวนล็อกอิน</th>
              <th>Progress</th>
              <th>ล็อกอินล่าสุด</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <p>ไม่พบข้อมูล</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr key={item.user_id}>
                  <td style={{ textAlign: 'center' }}>
                    {getRankBadge(index)}
                  </td>
                  <td>
                    <Link
                      href={`/admin/users/${item.user_id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="user-cell">
                        <div
                          className="user-cell-avatar"
                          style={{
                            background:
                              index === 0 && sortOrder === 'desc'
                                ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                                : index === 1 && sortOrder === 'desc'
                                ? 'linear-gradient(135deg, #9ca3af, #d1d5db)'
                                : index === 2 && sortOrder === 'desc'
                                ? 'linear-gradient(135deg, #b45309, #d97706)'
                                : undefined,
                          }}
                        >
                          {item.username.charAt(0)}
                        </div>
                        <div className="user-cell-info">
                          <span className="user-cell-name">{item.username}</span>
                          <span className="user-cell-email">{item.email}</span>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(item.role)}>{item.role}</span>
                  </td>
                  <td>
                    <span className="frequency-count">{item.login_count}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '0.25rem' }}>ครั้ง</span>
                  </td>
                  <td>
                    <div className="frequency-bar-container">
                      <div className="frequency-bar-bg">
                        <div
                          className="frequency-bar-fill"
                          style={{
                            width: `${(item.login_count / maxCount) * 100}%`,
                            background:
                              index === 0 && sortOrder === 'desc'
                                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                : index === 1 && sortOrder === 'desc'
                                ? 'linear-gradient(90deg, #9ca3af, #d1d5db)'
                                : index === 2 && sortOrder === 'desc'
                                ? 'linear-gradient(90deg, #b45309, #d97706)'
                                : undefined,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.8125rem' }}>
                    {formatDate(item.last_login)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
