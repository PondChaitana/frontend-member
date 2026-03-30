'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { UserRole } from '@/app/types/user';
import { apiFetch } from '@/app/lib/api';

type SortOrder = 'desc' | 'asc';

interface LoginFrequencyItem {
  user_id: number;
  username?: string | null;
  email: string;
  role: UserRole;
  login_count: number;
  last_login: string | null;
}

export default function LoginFrequencyPage() {
  const [data, setData] = useState<LoginFrequencyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);

      const result = await apiFetch<any[]>(`/api/admin/top-users/?${params.toString()}`);
      console.log('API raw result:', result);

      // Mapping ตามชื่อ field จริงจาก backend
      const mapped: LoginFrequencyItem[] = result.map((user, index) => ({
        user_id: user.user__userid ?? index,
        username: user.user__fullname || user.user__email?.split('@')[0] || 'ไม่ทราบชื่อ',
        email: user.user__email || '-',
        role: (user.user__role as UserRole) || 'user',
        login_count: user.login_count ?? 0,
        last_login: user.last_login ?? null, // backend ยังไม่มี last login ก็ใส่ null
      }));

      setData(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter]);

  const sortedData = useMemo(() => {
    let sorted = [...data];
    sorted.sort((a, b) =>
      sortOrder === 'desc' ? b.login_count - a.login_count : a.login_count - b.login_count
    );
    return sorted;
  }, [data, sortOrder]);

  const maxCount = Math.max(...sortedData.map((d) => d.login_count), 1);

  const getRankBadge = (index: number) => {
    if (sortOrder === 'asc') return <span className="rank-badge normal">{index + 1}</span>;
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

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-title-section">
        <h1 className="page-title">Login Frequency</h1>
        <p className="page-description">
          สถิติความถี่ในการเข้าสู่ระบบของผู้ใช้ — เรียงตามจำนวนล็อกอิน
        </p>
      </div>

      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          >
            <option value="all">ทุก Role</option>
            <option value="user">User</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>

          <button className={`chart-tab ${sortOrder === 'desc' ? 'active' : ''}`} onClick={() => setSortOrder('desc')}>
            มาก → น้อย
          </button>
          <button className={`chart-tab ${sortOrder === 'asc' ? 'active' : ''}`} onClick={() => setSortOrder('asc')}>
            น้อย → มาก
          </button>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>{sortedData.length} ผู้ใช้</div>
      </div>

      <div className="data-table-wrapper">
        {loading ? (
          <div>กำลังโหลด...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                <th>ผู้ใช้</th>
                <th>Role</th>
                <th>จำนวนล็อกอิน</th>
                <th>Progress</th>
             
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state"><p>ไม่พบข้อมูล</p></div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr key={item.user_id}>
                    <td style={{ textAlign: 'center' }}>{getRankBadge(index)}</td>
                    <td>
                      <Link href={`/admin/users/${item.user_id}`} style={{ textDecoration: 'none' }}>
                        <div className="user-cell">
                          <div className="user-cell-avatar">
                            {item.username?.charAt(0) || item.email?.charAt(0) || '?'}
                          </div>
                          <div className="user-cell-info">
                            <span className="user-cell-name">{item.username || item.email || 'ไม่ทราบชื่อ'}</span>
                            <span className="user-cell-email">{item.email}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td><span className={getRoleBadgeClass(item.role)}>{item.role}</span></td>
                    <td>
                      <span className="frequency-count">{item.login_count}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '0.25rem' }}>ครั้ง</span>
                    </td>
                    <td>
                      <div className="frequency-bar-container">
                        <div className="frequency-bar-bg">
                          <div
                            className="frequency-bar-fill"
                            style={{ width: `${(item.login_count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}