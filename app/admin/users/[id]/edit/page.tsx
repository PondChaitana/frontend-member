'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminGetUser, adminUpdateUser, adminDeleteUser, AdminUser } from '@/app/lib/api';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await adminGetUser(Number(id));
        setUser(data);
        setFormData({ ...data });
      } catch {
        setToast({ type: 'error', message: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้' });
      }
    };
    loadUser();
  }, [id]);

  const handleChange = (field: string, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!user) return;
    if (!formData.username) return setToast({ type: 'error', message: 'กรุณากรอก Username' });
    if (!formData.email) return setToast({ type: 'error', message: 'กรุณากรอก Email' });
    if (formData.role === 'author' && !formData.expertise)
      return setToast({ type: 'error', message: 'กรุณากรอก Expertise สำหรับ Author' });

    setSaving(true);
    try {
      const payload: Partial<AdminUser> = {};
      Object.keys(formData).forEach(key => {
        if ((formData as any)[key] !== (user as any)[key]) {
          (payload as any)[key] = (formData as any)[key];
        }
      });
      if (payload.is_active !== undefined) payload.is_active = !!payload.is_active;

      await adminUpdateUser(Number(id), payload);
      setToast({ type: 'success', message: 'บันทึกข้อมูลเรียบร้อยแล้ว!' });
      setUser(prev => prev ? { ...prev, ...payload } : prev);
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'บันทึกไม่สำเร็จ' });
    }
    setSaving(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await adminDeleteUser(Number(id));
      setToast({ type: 'success', message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
      setTimeout(() => router.push('/admin/users'), 1000);
    } catch {
      setToast({ type: 'error', message: 'ลบไม่สำเร็จ' });
    }
    setDeleting(false);
    setShowDeleteModal(false);
  };

  if (!user) return <div className="text-center py-10 text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-6">
        แก้ไขผู้ใช้: <span className="text-indigo-400">{user.username}</span>
      </h2>

      <div className="grid gap-5">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Username:</label>
          <input
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
            type="text"
            value={formData.username || ''}
            onChange={e => handleChange('username', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Email:</label>
          <input
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
            type="email"
            value={formData.email || ''}
            onChange={e => handleChange('email', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Phone:</label>
          <input
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
            type="text"
            value={formData.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-300 mb-1">Role:</label>
          <select
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
            value={formData.role || 'user'}
            onChange={e => handleChange('role', e.target.value)}
          >
            <option value="user">User</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {formData.role === 'author' && (
          <div className="flex flex-col">
            <label className="text-gray-300 mb-1">Expertise:</label>
            <input
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none"
              type="text"
              value={formData.expertise || ''}
              onChange={e => handleChange('expertise', e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!formData.is_active}
            onChange={e => handleChange('is_active', e.target.checked)}
            className="w-5 h-5 accent-indigo-500"
          />
          <span className="text-gray-300">Active</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-md disabled:opacity-50"
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={deleting}
          className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium shadow-md disabled:opacity-50"
        >
          ลบผู้ใช้
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 text-center">
            <p className="text-white mb-4">
              คุณต้องการลบ <span className="font-semibold text-red-400">{user.username}</span> หรือไม่?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium"
              >
                ยืนยัน
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded-lg font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}