// 'use client';

// import { useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { registerAuthor } from '@/app/lib/api';

// export default function RegisterAuthorPage() {
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirm_password: '',
//     expertise: '',
//   });
//   const [idCardFile, setIdCardFile] = useState<File | null>(null);
//   const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [serverError, setServerError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) {
//       const newErrors = { ...errors };
//       delete newErrors[e.target.name];
//       setErrors(newErrors);
//     }
//     setServerError('');
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       setErrors({ ...errors, id_card: 'กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น' });
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setErrors({ ...errors, id_card: 'ไฟล์ต้องมีขนาดไม่เกิน 5MB' });
//       return;
//     }

//     setIdCardFile(file);
//     setIdCardPreview(URL.createObjectURL(file));
//     const newErrors = { ...errors };
//     delete newErrors.id_card;
//     setErrors(newErrors);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//       setIdCardFile(file);
//       setIdCardPreview(URL.createObjectURL(file));
//     }
//   };

//   const validate = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!form.username.trim()) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
//     else if (form.username.length < 3) newErrors.username = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร';

//     if (!form.email.trim()) newErrors.email = 'กรุณากรอกอีเมล';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';

//     if (!form.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
//     else if (!/^[0-9]{9,10}$/.test(form.phone.replace(/[-\s]/g, ''))) newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';

//     if (!form.expertise.trim()) newErrors.expertise = 'กรุณากรอกความเชี่ยวชาญ';

//     if (!form.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
//     else if (form.password.length < 8) newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';

//     if (!form.confirm_password) newErrors.confirm_password = 'กรุณายืนยันรหัสผ่าน';
//     else if (form.password !== form.confirm_password) newErrors.confirm_password = 'รหัสผ่านไม่ตรงกัน';

//     if (!idCardFile) newErrors.id_card = 'กรุณาอัปโหลดรูปบัตรประชาชน';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setServerError('');

//     if (!validate()) return;

//     setLoading(true);
//     try {
//       // ============================================
//       // TODO [Backend]: POST /api/auth/register-author
//       // Content-Type: multipart/form-data
//       // FormData fields:
//       //   - username: string
//       //   - email: string
//       //   - phone: string
//       //   - password: string
//       //   - expertise: string
//       //   - id_card: File (image/jpeg, image/png)
//       // Response: { success: true, user_id: string }
//       // ============================================
//       const formData = new FormData();
//       formData.append('username', form.username);
//       formData.append('email', form.email);
//       formData.append('phone', form.phone);
//       formData.append('password', form.password);
//       formData.append('expertise', form.expertise);
//       if (idCardFile) {
//         formData.append('id_card', idCardFile);
//       }

//       await registerAuthor(formData);
//       setSuccess(true);
//       setTimeout(() => router.push('/login'), 2000);
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : 'สมัครสมาชิกไม่สำเร็จ';
//       setServerError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="flex flex-1 items-center justify-center px-4 py-12">
//         <div className="w-full max-w-md animate-fade-in text-center">
//           <div className="glass-card p-10">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 mb-4">
//               <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
//               </svg>
//             </div>
//             <h2 className="text-xl font-bold text-white mb-2">สมัคร Author สำเร็จ!</h2>
//             <p className="text-[#94a3b8]">กำลังนำไปหน้าเข้าสู่ระบบ...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-1 items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md animate-fade-in">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] mb-4 shadow-lg shadow-purple-500/20">
//             <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-white">สมัครเป็น Author</h1>
//           <p className="text-[#94a3b8] mt-2 text-sm">สร้างบัญชี Author พร้อมยืนยันตัวตน</p>
//         </div>

//         {/* Form Card */}
//         <div className="glass-card p-8">
//           <form onSubmit={handleSubmit} id="register-author-form">
//             {serverError && (
//               <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
//                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-400 shrink-0">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
//                 </svg>
//                 <span className="error-text" style={{ marginTop: 0 }}>{serverError}</span>
//               </div>
//             )}

//             {/* Username */}
//             <div className="mb-4">
//               <label htmlFor="author-username" className="form-label">ชื่อผู้ใช้</label>
//               <input id="author-username" name="username" type="text" className={`form-input ${errors.username ? 'error' : ''}`} placeholder="username" value={form.username} onChange={handleChange} />
//               {errors.username && <p className="error-text">{errors.username}</p>}
//             </div>

//             {/* Email */}
//             <div className="mb-4">
//               <label htmlFor="author-email" className="form-label">อีเมล</label>
//               <input id="author-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} />
//               {errors.email && <p className="error-text">{errors.email}</p>}
//             </div>

//             {/* Phone */}
//             <div className="mb-4">
//               <label htmlFor="author-phone" className="form-label">เบอร์โทรศัพท์</label>
//               <input id="author-phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="0812345678" value={form.phone} onChange={handleChange} />
//               {errors.phone && <p className="error-text">{errors.phone}</p>}
//             </div>

//             {/* Expertise */}
//             <div className="mb-4">
//               <label htmlFor="author-expertise" className="form-label">ความเชี่ยวชาญ</label>
//               <input id="author-expertise" name="expertise" type="text" className={`form-input ${errors.expertise ? 'error' : ''}`} placeholder="เช่น Machine Learning, Web Development" value={form.expertise} onChange={handleChange} />
//               {errors.expertise && <p className="error-text">{errors.expertise}</p>}
//             </div>

//             {/* ID Card Upload */}
//             <div className="mb-4">
//               <label className="form-label">รูปบัตรประชาชน</label>
//               <div
//                 className={`file-upload-zone ${idCardFile ? 'has-file' : ''} ${errors.id_card ? 'border-red-500/50' : ''}`}
//                 onClick={() => fileInputRef.current?.click()}
//                 onDrop={handleDrop}
//                 onDragOver={(e) => e.preventDefault()}
//                 id="id-card-upload-zone"
//               >
//                 {idCardPreview ? (
//                   <div className="space-y-3">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={idCardPreview}
//                       alt="Preview ID Card"
//                       className="max-h-32 mx-auto rounded-lg object-contain"
//                     />
//                     <p className="text-sm text-green-400 font-medium">{idCardFile?.name}</p>
//                     <p className="text-xs text-[#94a3b8]">คลิกเพื่อเปลี่ยนรูป</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-2">
//                     <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-[#94a3b8]">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
//                     </svg>
//                     <p className="text-sm text-[#94a3b8]">คลิก หรือ ลากวางรูปบัตรประชาชน</p>
//                     <p className="text-xs text-[#64748b]">รองรับ JPG, PNG — ไม่เกิน 5MB</p>
//                   </div>
//                 )}
//               </div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 id="id-card-file-input"
//               />
//               {errors.id_card && <p className="error-text">{errors.id_card}</p>}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label htmlFor="author-password" className="form-label">รหัสผ่าน</label>
//               <input id="author-password" name="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="อย่างน้อย 8 ตัวอักษร" value={form.password} onChange={handleChange} />
//               {errors.password && <p className="error-text">{errors.password}</p>}
//             </div>

//             {/* Confirm Password */}
//             <div className="mb-6">
//               <label htmlFor="author-confirm-password" className="form-label">ยืนยันรหัสผ่าน</label>
//               <input id="author-confirm-password" name="confirm_password" type="password" className={`form-input ${errors.confirm_password ? 'error' : ''}`} placeholder="กรอกรหัสผ่านอีกครั้ง" value={form.confirm_password} onChange={handleChange} />
//               {errors.confirm_password && <p className="error-text">{errors.confirm_password}</p>}
//             </div>

//             {/* Submit */}
//             <button type="submit" className="btn-primary" disabled={loading} id="register-author-submit-btn">
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2"><span className="spinner" />กำลังสมัคร...</span>
//               ) : (
//                 'สมัครเป็น Author'
//               )}
//             </button>
//           </form>

//           {/* Links */}
//           <div className="mt-6 space-y-3 text-center text-sm text-[#94a3b8]">
//             <p>
//               ต้องการสมัครแบบ User?{' '}
//               <Link href="/register" className="auth-link">สมัครเป็น User</Link>
//             </p>
//             <p>
//               มีบัญชีอยู่แล้ว?{' '}
//               <Link href="/login" className="auth-link">เข้าสู่ระบบ</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
