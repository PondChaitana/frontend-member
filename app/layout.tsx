import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Member System — User & Author Management",
  description: "ระบบสมาชิกสำหรับ User และ Author — ลงทะเบียน เข้าสู่ระบบ จัดการโปรไฟล์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col gradient-bg">{children}</body>
    </html>
  );
}
