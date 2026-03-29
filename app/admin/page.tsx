'use client';

import { useState } from 'react';
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
import {
  mockDashboardStats,
  mockChartMonthly,
  mockChartWeekly,
} from '@/app/lib/mockData';

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

export default function AdminDashboard() {
  const [chartRange, setChartRange] = useState<'monthly' | 'weekly'>('monthly');
  const stats = mockDashboardStats;
  const chartData = chartRange === 'monthly' ? mockChartMonthly : mockChartWeekly;

  const barChartData = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        label: 'Users',
        data: chartData.map((d) => d.users),
        backgroundColor: 'rgba(124, 58, 237, 0.6)',
        borderColor: '#7c3aed',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Authors',
        data: chartData.map((d) => d.authors),
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
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 3,
          useBorderRadius: true,
          padding: 16,
        },
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
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.04)',
        },
        ticks: {
          color: '#64748b',
          font: { family: 'Inter', size: 11 },
        },
        border: { display: false },
      },
    },
  };

  const doughnutData = {
    labels: ['Users', 'Authors', 'Admins'],
    datasets: [
      {
        data: [stats.total_users, stats.total_authors, stats.total_admins],
        backgroundColor: [
          'rgba(124, 58, 237, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderColor: [
          '#7c3aed',
          '#3b82f6',
          '#f59e0b',
        ],
        borderWidth: 2,
        cutout: '70%',
        spacing: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
  };

  const total = stats.total_users + stats.total_authors + stats.total_admins;

  return (
    <div className="animate-fade-in">
      {/* Page Title */}
      <div className="page-title-section">
        <h1 className="page-title" id="admin-dashboard-title">Dashboard</h1>
        <p className="page-description">ภาพรวมของระบบสมาชิกทั้งหมด</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card purple" id="stat-total-users">
          <div className="stat-card-header">
            <div className="stat-icon purple">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <span className="stat-change up">+{stats.new_users_today} วันนี้</span>
          </div>
          <div className="stat-value">{stats.total_users.toLocaleString()}</div>
          <div className="stat-label">ผู้ใช้ทั้งหมด</div>
        </div>

        <div className="stat-card blue" id="stat-total-authors">
          <div className="stat-card-header">
            <div className="stat-icon blue">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </div>
            <span className="stat-change up">+{stats.new_users_this_week} สัปดาห์นี้</span>
          </div>
          <div className="stat-value">{stats.total_authors}</div>
          <div className="stat-label">Authors</div>
        </div>

        <div className="stat-card amber" id="stat-total-admins">
          <div className="stat-card-header">
            <div className="stat-icon amber">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.total_admins}</div>
          <div className="stat-label">Admins</div>
        </div>

        <div className="stat-card green" id="stat-active-users">
          <div className="stat-card-header">
            <div className="stat-icon green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              </svg>
            </div>
            <span className="stat-change up">Active</span>
          </div>
          <div className="stat-value">{stats.active_users}</div>
          <div className="stat-label">ผู้ใช้ที่ Active</div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-section">
        {/* Bar Chart */}
        <div className="chart-card" id="chart-user-growth">
          <div className="chart-card-header">
            <h2 className="chart-title">การเติบโตของผู้ใช้</h2>
            <div className="chart-tabs">
              <button
                className={`chart-tab ${chartRange === 'weekly' ? 'active' : ''}`}
                onClick={() => setChartRange('weekly')}
                id="chart-tab-weekly"
              >
                รายสัปดาห์
              </button>
              <button
                className={`chart-tab ${chartRange === 'monthly' ? 'active' : ''}`}
                onClick={() => setChartRange('monthly')}
                id="chart-tab-monthly"
              >
                รายเดือน
              </button>
            </div>
          </div>
          <div className="chart-container">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="chart-card" id="chart-role-distribution">
          <div className="chart-card-header">
            <h2 className="chart-title">สัดส่วน Role</h2>
          </div>
          <div style={{ height: 200, position: 'relative' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="doughnut-legend">
            <div className="legend-item">
              <div className="legend-left">
                <span className="legend-dot" style={{ background: '#7c3aed' }} />
                <span className="legend-label">Users</span>
              </div>
              <span className="legend-value">
                {stats.total_users.toLocaleString()} ({((stats.total_users / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="legend-item">
              <div className="legend-left">
                <span className="legend-dot" style={{ background: '#3b82f6' }} />
                <span className="legend-label">Authors</span>
              </div>
              <span className="legend-value">
                {stats.total_authors} ({((stats.total_authors / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="legend-item">
              <div className="legend-left">
                <span className="legend-dot" style={{ background: '#f59e0b' }} />
                <span className="legend-label">Admins</span>
              </div>
              <span className="legend-value">
                {stats.total_admins} ({((stats.total_admins / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="chart-section" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="chart-card" style={{ textAlign: 'center' }}>
          <div className="stat-icon purple" style={{ margin: '0 auto 0.75rem' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.new_users_today}</div>
          <div className="stat-label">สมัครวันนี้</div>
        </div>
        <div className="chart-card" style={{ textAlign: 'center' }}>
          <div className="stat-icon blue" style={{ margin: '0 auto 0.75rem' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.new_users_this_week}</div>
          <div className="stat-label">สมัครสัปดาห์นี้</div>
        </div>
        <div className="chart-card" style={{ textAlign: 'center' }}>
          <div className="stat-icon green" style={{ margin: '0 auto 0.75rem' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stats.new_users_this_month}</div>
          <div className="stat-label">สมัครเดือนนี้</div>
        </div>
      </div>
    </div>
  );
}
