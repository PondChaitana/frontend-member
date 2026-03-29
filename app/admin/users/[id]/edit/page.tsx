'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/app/lib/mockData';
import type { UserRole } from '@/app/types/user';

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const user = mockUsers.find((u) => String(u.id) === id);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: (user?.role || 'user') as UserRole,
    expertise: user?.expertise || '',
    is_active: user?.is_active ?? true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="detail-header">
          <Link href="/admin/users" className="back-btn">
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    // TODO: Replace with actual API call
    // await apiFetch(`/api/admin/users/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(formData),
    // });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSaving(false);
    setToast({ type: 'success', message: 'บันทึกข้อมูลเรียบร้อยแล้ว!' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    // TODO: Replace with actual API call
    // await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    setShowDeleteModal(false);
    setToast({ type: 'success', message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
    setTimeout(() => {
      router.push('/admin/users');
    }, 1000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="detail-header">
        <Link href={`/admin/users/${user.id}`} className="back-btn" id="back-to-detail">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          กลับ
        </Link>
        <div className="page-title-section" style={{ marginBottom: 0, flex: 1 }}>
          <h1 className="page-title" id="edit-user-title" style={{ fontSize: '1.25rem' }}>
            แก้ไขผู้ใช้: {user.username}
          </h1>
          <p className="page-description">แก้ไขข้อมูลผู้ใช้ (ไม่รวม password)</p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="detail-card full" style={{ marginBottom: '1.5rem' }}>
        <h3 className="detail-card-title">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
          ข้อมูลผู้ใช้
        </h3>

        <div className="edit-form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-username">ชื่อผู้ใช้</label>
            <input
              type="text"
              className="form-input"
              id="edit-username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-email">อีเมล</label>
            <input
              type="email"
              className="form-input"
              id="edit-email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-phone">เบอร์โทร</label>
            <input
              type="text"
              className="form-input"
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-role">Role</label>
            <select
              className="filter-select"
              id="edit-role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              style={{ width: '100%', padding: '0.875rem 2rem 0.875rem 1rem' }}
            >
              <option value="user">User</option>
              <option value="author">Author</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === 'author' && (
            <div className="form-group">
              <label className="form-label" htmlFor="edit-expertise">ความเชี่ยวชาญ</label>
              <input
                type="text"
                className="form-input"
                id="edit-expertise"
                value={formData.expertise}
                onChange={(e) => handleChange('expertise', e.target.value)}
                placeholder="เช่น เทคโนโลยี, การเงิน, สุขภาพ"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">สถานะบัญชี</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0' }}>
              <button
                type="button"
                onClick={() => handleChange('is_active', !formData.is_active)}
                style={{
                  width: '3rem',
                  height: '1.5rem',
                  borderRadius: '999px',
                  background: formData.is_active ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s ease',
                }}
                id="toggle-active"
              >
                <span
                  style={{
                    width: '1.125rem',
                    height: '1.125rem',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: formData.is_active ? 'calc(100% - 1.125rem - 0.1875rem)' : '0.1875rem',
                    transform: 'translateY(-50%)',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </button>
              <span style={{ fontSize: '0.875rem', color: formData.is_active ? 'var(--success)' : 'var(--muted)' }}>
                {formData.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Link href={`/admin/users/${user.id}`} className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
            ยกเลิก
          </Link>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
            id="save-user-btn"
          >
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="spinner" />
                กำลังบันทึก...
              </span>
            ) : (
              'บันทึกการเปลี่ยนแปลง'
            )}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="detail-card full" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <h3 className="detail-card-title" style={{ color: '#f87171' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Danger Zone
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          การลบบัญชีผู้ใช้เป็นการดำเนินการที่ไม่สามารถย้อนกลับได้ กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
        </p>
        <button
          className="btn-danger"
          onClick={() => setShowDeleteModal(true)}
          id="delete-user-btn"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            ลบบัญชีผู้ใช้นี้
          </span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <h3 className="modal-title">ยืนยันการลบผู้ใช้</h3>
            <p className="modal-message">
              คุณต้องการลบบัญชีของ <strong style={{ color: 'white' }}>{user.username}</strong> หรือไม่?
              <br />การลบจะไม่สามารถย้อนกลับได้
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                id="cancel-delete-btn"
              >
                ยกเลิก
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
                id="confirm-delete-btn"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
