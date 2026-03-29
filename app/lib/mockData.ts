// ============================================
// Mock Data for Admin Dashboard
// ============================================
// ข้อมูลจำลองสำหรับ Frontend — ใช้แสดง UI ก่อน
// เมื่อ Backend พร้อม ให้ลบไฟล์นี้แล้วเชื่อม API จริง
// ============================================

import type {
  DashboardStats,
  ChartDataPoint,
  AdminUserItem,
  LoginFrequencyItem,
} from '@/app/types/admin';

export const mockDashboardStats: DashboardStats = {
  total_users: 1247,
  total_authors: 89,
  total_admins: 5,
  new_users_today: 12,
  new_users_this_week: 78,
  new_users_this_month: 324,
  active_users: 892,
};

export const mockChartMonthly: ChartDataPoint[] = [
  { label: 'ม.ค.', users: 120, authors: 8 },
  { label: 'ก.พ.', users: 185, authors: 12 },
  { label: 'มี.ค.', users: 240, authors: 15 },
  { label: 'เม.ย.', users: 198, authors: 11 },
  { label: 'พ.ค.', users: 310, authors: 22 },
  { label: 'มิ.ย.', users: 278, authors: 18 },
  { label: 'ก.ค.', users: 350, authors: 25 },
  { label: 'ส.ค.', users: 420, authors: 30 },
  { label: 'ก.ย.', users: 390, authors: 28 },
  { label: 'ต.ค.', users: 465, authors: 35 },
  { label: 'พ.ย.', users: 510, authors: 40 },
  { label: 'ธ.ค.', users: 548, authors: 42 },
];

export const mockChartWeekly: ChartDataPoint[] = [
  { label: 'จันทร์', users: 45, authors: 5 },
  { label: 'อังคาร', users: 52, authors: 7 },
  { label: 'พุธ', users: 38, authors: 4 },
  { label: 'พฤหัสฯ', users: 61, authors: 8 },
  { label: 'ศุกร์', users: 55, authors: 6 },
  { label: 'เสาร์', users: 30, authors: 3 },
  { label: 'อาทิตย์', users: 25, authors: 2 },
];

// ใช้ค่าคงที่แทน Math.random() เพื่อป้องกัน hydration mismatch
const fixedPhones = [
  '0892742302', '0870694247', '0824661815', '0886601053', '0849713090',
  '0822267133', '0882367827', '0864912447', '0835650127', '0876543210',
  '0813456789', '0845678901', '0856789012', '0867890123', '0878901234',
  '0889012345', '0890123456', '0812345678', '0823456789', '0834567890',
  '0845678901', '0856789012', '0867890123', '0878901234', '0889012345',
];

const fixedDaysAgo = [
  120, 45, 280, 15, 200, 90, 310, 60, 170, 25,
  350, 100, 230, 55, 140, 75, 190, 110, 260, 35,
  300, 80, 150, 210, 330,
];

const fixedLoginDaysAgo = [
  3, 7, 1, 5, 2, 12, 8, 4, 15, 6,
  0, 10, 3, 9, 1, 14, 5, 7, 11, 2,
  4, 8, 6, 13, 3,
];

const fixedLoginCounts = [
  28, 156, 89, 142, 184, 67, 140, 147, 195, 103,
  156, 186, 162, 45, 175, 72, 164, 135, 108, 91,
  120, 53, 130, 78, 199,
];

const fixedIsActive = [
  true, false, true, true, true, true, true, true, true, true,
  true, true, true, false, true, true, true, true, false, true,
  true, true, true, true, true,
];

// วันที่ฐาน (fixed) เพื่อหลีกเลี่ยง Date.now() ที่ต่างกันระหว่าง SSR/Client
const BASE_DATE = new Date('2026-03-29T12:00:00Z').getTime();

const firstNames = [
  'สมชาย', 'สมหญิง', 'วิชัย', 'นภาพร', 'ธนกร',
  'พิชญา', 'กิตติ', 'รัตนา', 'ประสิทธิ์', 'ศิริลักษณ์',
  'อภิชาติ', 'จันทร์เพ็ญ', 'ภูมิพัฒน์', 'ณัฐวดี', 'ชัยวัฒน์',
  'มณีรัตน์', 'ธีรภัทร', 'พรทิพย์', 'อนุสรณ์', 'สุภาวดี',
  'สิทธิชัย', 'ปาริชาติ', 'เกรียงศักดิ์', 'อรุณี', 'ภาสกร',
];

const expertiseList = [
  'เทคโนโลยี', 'การเงิน', 'สุขภาพ', 'การศึกษา', 'สิ่งแวดล้อม',
  'ศิลปะ', 'กีฬา', 'อาหาร', 'ท่องเที่ยว', 'วิทยาศาสตร์',
];

const roles: ('user' | 'author' | 'admin')[] = ['user', 'author', 'admin'];

export const mockUsers: AdminUserItem[] = firstNames.map((name, i) => {
  const role = i < 3 ? 'admin' : roles[i % 3];
  const dateJoined = new Date(BASE_DATE - fixedDaysAgo[i] * 86400000).toISOString();
  const lastLogin = new Date(BASE_DATE - fixedLoginDaysAgo[i] * 86400000).toISOString();

  return {
    id: i + 1,
    username: name,
    email: `${name.toLowerCase().replace(/\s/g, '')}${i}@example.com`,
    phone: fixedPhones[i],
    role,
    expertise: role === 'author' ? expertiseList[i % expertiseList.length] : undefined,
    date_joined: dateJoined,
    last_login: lastLogin,
    is_active: fixedIsActive[i],
    login_count: fixedLoginCounts[i],
  };
});

export const mockLoginFrequency: LoginFrequencyItem[] = mockUsers
  .map((u) => ({
    user_id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    login_count: u.login_count,
    last_login: u.last_login,
  }))
  .sort((a, b) => b.login_count - a.login_count);
