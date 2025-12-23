import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import SuperAdminLayout from '../components/SuperAdmin/SuperAdminLayout';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SuperAdminUsers = () => {
  const { users, loading, fetchUsers, blockUser, unblockUser, deleteUser, updateUserRole } = useAdmin();
  const [roleUpdates, setRoleUpdates] = useState({});

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </SuperAdminLayout>
    );
  }

  // Filter to show only users, not admins or superadmins
  const regularUsers = users.filter(user => user.role === 'user');

  return (
    <SuperAdminLayout>
      <div className="page-header">
        <h1>User Management</h1>
        <p>Complete control over all platform users</p>
      </div>

      {regularUsers.length === 0 ? (
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
                <th>Current Role</th>
                <th>Subscription</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
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
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {user.isBlocked ? (
                        <button
                          className="btn"
                          onClick={() => unblockUser(user._id)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          onClick={() => blockUser(user._id)}
                        >
                          Block
                        </button>
                      )}
                      <button
                        className="btn"
                        style={{ background: '#dc2626' }}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SuperAdminLayout>
  );
};

export default SuperAdminUsers;