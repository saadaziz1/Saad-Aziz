import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import SuperAdminLayout from '../components/SuperAdmin/SuperAdminLayout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const SuperAdminAdmins = () => {
  const { users, loading, fetchUsers, createAdmin } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(adminData);
      setShowCreateModal(false);
      setAdminData({ name: '', email: '', password: '' });
      fetchUsers();
      alert('Admin created successfully!');
    } catch (error) {
      alert('Failed to create admin');
    }
  };

  const admins = users.filter(user => user.role === 'admin' || user.role === 'superadmin');

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Admin Management</h1>
          <p>Create and manage admin users</p>
        </div>
        <button 
          className="btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Admin
        </button>
      </div>

      {admins.length === 0 ? (
        <div className="no-data">
          <p>No admin users found.</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={`badge ${admin.role === 'superadmin' ? 'premium' : 'active'}`}>
                      {admin.role}
                    </span>
                  </td>
                  <td>
                    {admin.isBlocked ? (
                      <span className="badge blocked">Blocked</span>
                    ) : (
                      <span className="badge active">Active</span>
                    )}
                  </td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Admin"
      >
        <form onSubmit={handleCreateAdmin}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={adminData.name}
              onChange={(e) => setAdminData({...adminData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={adminData.email}
              onChange={(e) => setAdminData({...adminData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={adminData.password}
              onChange={(e) => setAdminData({...adminData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn">
            Create Admin
          </button>
        </form>
      </Modal>
    </SuperAdminLayout>
  );
};

export default SuperAdminAdmins;