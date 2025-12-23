import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import SuperAdminLayout from '../components/SuperAdmin/SuperAdminLayout';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SuperAdminDashboard = () => {
  const { dashboardStats, loading, fetchDashboardStats } = useAdmin();

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <SuperAdminLayout>
      <div className="page-header">
        <h1>Super Admin Dashboard</h1>
        <p>Complete platform control and management</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '1200px' }}>
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{dashboardStats?.totalUsers || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Admins</h3>
          <div className="stat-number">{dashboardStats?.totalAdmins || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Active Subscriptions</h3>
          <div className="stat-number">{dashboardStats?.activeSubscriptions || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Videos</h3>
          <div className="stat-number">{dashboardStats?.totalVideos || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Blocked Users</h3>
          <div className="stat-number">{dashboardStats?.blockedUsers || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="stat-number">$0</div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;