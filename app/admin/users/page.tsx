'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/app/lib/mockData';
import type { UserRole } from '@/app/types/user';

const ITEMS_PER_PAGE = 8;

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & search logic
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        search === '' ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'inactive' && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value: UserRole | 'all') => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: 'all' | 'active' | 'inactive') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      {/* Page Title */}
      <div className="page-title-section">
        <h1 className="page-title" id="admin-users-title">ผู้ใช้ทั้งหมด</h1>
        <p className="page-description">
          จัดการผู้ใช้ทั้งหมดในระบบ — ค้นหา กรอง ดูรายละเอียด แก้ไข หรือลบ
        </p>
      </div>

      {/* Toolbar: Search + Filters */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <div className="search-input-wrapper">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              id="users-search-input"
            />
          </div>

          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value as UserRole | 'all')}
            id="users-role-filter"
          >
            <option value="all">ทุก Role</option>
            <option value="user">User</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as 'all' | 'active' | 'inactive')}
            id="users-status-filter"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
          พบ {filteredUsers.length} ผู้ใช้
        </div>
      </div>

      {/* Users Table */}
      <div className="data-table-wrapper">
        <table className="data-table" id="users-data-table">
          <thead>
            <tr>
              <th>ผู้ใช้</th>
              <th>Role</th>
              <th>เบอร์โทร</th>
              <th>สถานะ</th>
              <th>วันที่สมัคร</th>
              <th>เข้าสู่ระบบล่าสุด</th>
              <th style={{ textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                    </svg>
                    <p>ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-cell-avatar">
                        {user.username.charAt(0)}
                      </div>
                      <div className="user-cell-info">
                        <span className="user-cell-name">{user.username}</span>
                        <span className="user-cell-email">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.phone}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`} />
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(user.date_joined)}</td>
                  <td>{formatDate(user.last_login)}</td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: 'center' }}>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="action-btn"
                        title="ดูรายละเอียด"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="action-btn"
                        title="แก้ไข"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} จาก{' '}
              {filteredUsers.length} รายการ
            </div>
            <div className="pagination-buttons">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                id="pagination-prev"
              >
                ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                id="pagination-next"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
