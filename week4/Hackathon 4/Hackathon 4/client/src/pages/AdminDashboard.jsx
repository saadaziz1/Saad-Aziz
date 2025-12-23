import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/Admin/AdminLayout';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const AdminDashboard = () => {
  const { dashboardStats, loading, fetchDashboardStats } = useAdmin();
  const { isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Content management and user overview</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '1000px' }}>
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{dashboardStats?.totalUsers || 0}</div>
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;