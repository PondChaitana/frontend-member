'use client';

import { useState, useEffect } from 'react';
import { adminGetUsers, AdminUser } from '@/app/lib/api';
import type { UserRole } from '@/app/types/user';
import Link from 'next/link';

const ITEMS_PER_PAGE = 8;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const query: Record<string, string> = { page: String(currentPage) };
      if (search) query.fullname = search;
      if (roleFilter !== 'all') query.role = roleFilter;

      const data = await adminGetUsers(query);

      const usersArray: AdminUser[] = Array.isArray(data)
        ? data.map(u => ({
            ...u,
            id: Number(u.userid),
            is_active: u.is_active === true || u.is_active === 'True' || u.is_active === 'true',
          }))
        : [];

      const filtered =
        statusFilter === 'all'
          ? usersArray
          : usersArray.filter(u => (statusFilter === 'active' ? u.is_active : !u.is_active));

      setUsers(filtered);
      setTotalCount(filtered.length);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'เกิดข้อผิดพลาด');
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter, currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
      : '-';

  return (
    <div className="animate-fade-in max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-white mb-6">ผู้ใช้ทั้งหมด</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="ค้นหา..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
        />
        <select
          value={roleFilter}
          onChange={e => {
            setRoleFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
        >
          <option value="all">ทั้งหมด</option>
          <option value="user">User</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
        >
          <option value="all">ทั้งหมด</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400 py-10 text-center">กำลังโหลด...</div>
      ) : error ? (
        <div className="text-red-500 py-4 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-900">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-800 text-gray-400">
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">วันที่สมัคร</th>
                <th className="px-4 py-2">เข้าสู่ระบบล่าสุด</th>
                <th className="px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-gray-400">
                    ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                  >
                    <td className="px-4 py-2 text-white">{user.username}</td>
                    <td className="px-4 py-2 text-gray-300">{user.email}</td>
                    <td className="px-4 py-2 text-gray-300">{user.phone || '-'}</td>
                    <td className={`px-4 py-2 font-medium ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </td>
                    <td className="px-4 py-2 text-gray-300">{formatDate(user.date_joined)}</td>
                    <td className="px-4 py-2 text-gray-300">{formatDate(user.last_login)}</td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-block px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition duration-200"
                      >
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              disabled={page === currentPage}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg font-medium ${
                page === currentPage ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-indigo-600'
              } transition duration-200`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}