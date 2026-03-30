'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { apiFetch } from '@/app/lib/api'; // ใช้ helper ของคุณ

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  total_users: number;
  total_authors: number;
  total_admins: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
}

interface ChartDataItem {
  label: string;
  users: number;
  authors: number;
}

export default function AdminDashboard() {
  const [chartRange, setChartRange] = useState<'monthly' | 'weekly'>('monthly');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
 

        // ดึงข้อมูลสถิติ
        const statsData: DashboardStats = await apiFetch('/api/dashboard-stats/');

        setStats(statsData);

        // ดึงข้อมูล chart
        const chartEndpoint = chartRange === 'monthly' ? 'chart-monthly' : 'chart-weekly';
        const chartJson: ChartDataItem[] = await apiFetch(`/api/${chartEndpoint}/`);

        setChartData(Array.isArray(chartJson) ? chartJson : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setChartData([]);
        setStats({
          total_users: 0,
          total_authors: 0,
          total_admins: 0,
          active_users: 0,
          new_users_today: 0,
          new_users_this_week: 0,
          new_users_this_month: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [chartRange]);

  if (loading || !stats) return <div>Loading...</div>;

  const barChartData = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        label: 'Users',
        data: chartData.map((d) => d.users ?? 0),
        backgroundColor: 'rgba(124, 58, 237, 0.6)',
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Authors',
        data: chartData.map((d) => d.authors ?? 0),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(22, 22, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: '600' as const },
        bodyFont: { family: 'Inter' },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, border: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }, border: { display: false } },
    },
  };

  const doughnutData = {
    labels: ['Users', 'Authors', 'Admins'],
    datasets: [
      {
        data: [stats.total_users ?? 0, stats.total_authors ?? 0, stats.total_admins ?? 0],
        backgroundColor: ['rgba(124, 58, 237, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(245, 158, 11, 0.7)'],
        borderColor: ['#7c3aed', '#3b82f6', '#f59e0b'],
        borderWidth: 2,
        cutout: '70%',
        spacing: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const total = (stats.total_users ?? 0) + (stats.total_authors ?? 0) + (stats.total_admins ?? 0);

  return (
    <div className="animate-fade-in">
      <div className="page-title-section">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">ภาพรวมของระบบสมาชิกทั้งหมด</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-card-header">
            <span className="stat-change up">+{stats.new_users_today ?? 0} วันนี้</span>
          </div>
          <div className="stat-value">{(stats.total_users ?? 0).toLocaleString()}</div>
          <div className="stat-label">ผู้ใช้ทั้งหมด</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-card-header">
            <span className="stat-change up">+{stats.new_users_this_week ?? 0} สัปดาห์นี้</span>
          </div>
          <div className="stat-value">{(stats.total_authors ?? 0).toLocaleString()}</div>
          <div className="stat-label">Authors</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-value">{(stats.total_admins ?? 0).toLocaleString()}</div>
          <div className="stat-label">Admins</div>
        </div>
        <div className="stat-card green">
          <div className="stat-change up">Active</div>
          <div className="stat-value">{(stats.active_users ?? 0).toLocaleString()}</div>
          <div className="stat-label">ผู้ใช้ที่ Active</div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <h2 className="chart-title">การเติบโตของผู้ใช้</h2>
            <div className="chart-tabs">
              <button className={`chart-tab ${chartRange === 'weekly' ? 'active' : ''}`} onClick={() => setChartRange('weekly')}>รายสัปดาห์</button>
              <button className={`chart-tab ${chartRange === 'monthly' ? 'active' : ''}`} onClick={() => setChartRange('monthly')}>รายเดือน</button>
            </div>
          </div>
          <div className="chart-container"><Bar data={barChartData} options={barOptions} /></div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h2 className="chart-title">สัดส่วน Role</h2>
          </div>
          <div style={{ height: 200, position: 'relative' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="doughnut-legend">
            <div>Users: {stats.total_users ?? 0} ({total > 0 ? ((stats.total_users ?? 0) / total * 100).toFixed(1) : 0}%)</div>
            <div>Authors: {stats.total_authors ?? 0} ({total > 0 ? ((stats.total_authors ?? 0) / total * 100).toFixed(1) : 0}%)</div>
            <div>Admins: {stats.total_admins ?? 0} ({total > 0 ? ((stats.total_admins ?? 0) / total * 100).toFixed(1) : 0}%)</div>
          </div>
        </div>
      </div>

      <div className="chart-section" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="chart-card" style={{ textAlign: 'center' }}>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.new_users_today ?? 0}</div>
          <div className="stat-label">สมัครวันนี้</div>
        </div>
        <div className="chart-card" style={{ textAlign: 'center' }}>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.new_users_this_week ?? 0}</div>
          <div className="stat-label">สมัครสัปดาห์นี้</div>
        </div>
        <div className="chart-card" style={{ textAlign: 'center' }}>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.new_users_this_month ?? 0}</div>
          <div className="stat-label">สมัครเดือนนี้</div>
        </div>
      </div>
    </div>
  );
}