'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, registerAuthor } from '@/app/lib/api';

export default function RegisterUserPage() {
  const router = useRouter();
  const [form, setForm] = useState<{
    fullname: string;
    username: string;
    email: string;
    phone: string;
    userpassword: string;
    confirm_password: string;
    role: 'user' | 'author';
    idcard: File | null;
    expertise: string;
  }>({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    userpassword: '',
    confirm_password: '',
    role: 'user',
    idcard: null,
    expertise: '',
  });
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, idcard: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.userpassword !== form.confirm_password) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (form.role === 'author' && (!form.idcard || !form.expertise)) {
      setError('สำหรับนักเขียน ต้องกรอกสำเนาบัตรและความสามารถ');
      return;
    }

    try {
      if (form.role === 'author') {
        const formData = new FormData();
        formData.append('fullname', form.fullname);
        formData.append('username', form.username);
        formData.append('email', form.email);
        formData.append('phone', form.phone || '');
        formData.append('password', form.userpassword);
        formData.append('role', form.role);
        formData.append('expertise', form.expertise);
        formData.append('idcard', form.idcard as File);

        await registerAuthor(formData);
      } else {
        await registerUser({
          fullname: form.fullname,
          username: form.username,
          email: form.email,
          phone: form.phone || '',
          password: form.userpassword,
          role: form.role,
        });
      }

      router.push('/login');
    } catch (err: any) {
      console.error('REGISTER ERROR:', err.data);

      if (err?.data && typeof err.data === 'object') {
        const fieldErrors = Object.entries(err.data)
          .map(([key, msgs]) => `${key}: ${(msgs as string[]).join(', ')}`)
          .join(' | ');
        setError(fieldErrors);
      } else {
        setError(err?.message || 'เกิดข้อผิดพลาดในการสมัคร');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-2xl shadow-xl bg-gray-900 border border-gray-700">
      <h2 className="text-3xl font-semibold text-white mb-6 text-center">สมัครสมาชิก</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullname"
          placeholder="ชื่อ-นามสกุล"
          value={form.fullname}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <input
          type="text"
          name="username"
          placeholder="ชื่อผู้ใช้งาน"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <input
          type="email"
          name="email"
          placeholder="อีเมล"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <input
          type="text"
          name="phone"
          placeholder="เบอร์โทร (ไม่บังคับ)"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <input
          type="password"
          name="userpassword"
          placeholder="รหัสผ่าน"
          value={form.userpassword}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="ยืนยันรหัสผ่าน"
          value={form.confirm_password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
        >
          <option value="user">ผู้ใช้ทั่วไป</option>
          <option value="author">นักเขียน</option>
        </select>

        {form.role === 'author' && (
          <>
            <input
              type="file"
              name="idcard"
              onChange={handleFileChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
            <input
              type="text"
              name="expertise"
              placeholder="ความสามารถ"
              value={form.expertise}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
        >
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
}