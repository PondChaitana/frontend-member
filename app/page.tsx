import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in text-center">
        {/* Logo / Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] mb-6 shadow-xl shadow-purple-500/25">
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Member System
        </h1>
        <p className="text-[#94a3b8] text-lg mb-10 max-w-md mx-auto leading-relaxed">
          ระบบจัดการสมาชิกสำหรับ User & Author — ลงทะเบียน เข้าสู่ระบบ และจัดการโปรไฟล์
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
          <Link
            href="/login"
            className="btn-primary text-center block flex-1"
            id="home-login-btn"
          >
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              เข้าสู่ระบบ
            </span>
          </Link>
          <Link
            href="/register"
            className="btn-secondary text-center block flex-1"
            id="home-register-btn"
          >
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              สมัครสมาชิก
            </span>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 mb-3">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">User</h3>
            <p className="text-xs text-[#94a3b8]">สมัครใช้งานฟรี</p>
          </div>

          <div className="glass-card p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/15 mb-3">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-purple-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Author</h3>
            <p className="text-xs text-[#94a3b8]">สร้างเนื้อหาได้</p>
          </div>

          <div className="glass-card p-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/15 mb-3">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">JWT Auth</h3>
            <p className="text-xs text-[#94a3b8]">ปลอดภัยสูง</p>
          </div>
        </div>
      </div>
    </div>
  );
}
