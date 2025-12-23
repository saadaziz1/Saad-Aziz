import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from '../components/Admin/AdminLayout';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ManageUsers = () => {
  const { users, loading, fetchUsers } = useAdmin();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="page-header">
        <h1>View Users</h1>
        <p>Read-only view of registered users (Admin access)</p>
      </div>

      {users.length === 0 ? (
        <div className="no-data">
          <p>No users found.</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Subscription</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => user.role === 'user').map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge inactive">{user.role}</span></td>
                  <td>
                    {user.subscription?.isActive ? (
                      <span className="badge active">Active</span>
                    ) : (
                      <span className="badge inactive">Inactive</span>
                    )}
                  </td>
                  <td>
                    {user.isBlocked ? (
                      <span className="badge blocked">Blocked</span>
                    ) : (
                      <span className="badge active">Active</span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ marginTop: '24px', padding: '16px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <p style={{ color: '#999', margin: 0 }}>
          ℹ️ Admin Note: You have read-only access to user data. Contact Super Admin for user management actions.
        </p>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;