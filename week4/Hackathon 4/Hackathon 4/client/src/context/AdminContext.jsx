import React, { createContext, useContext, useState } from 'react';
import { adminService } from '../services/auth';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const blockUser = async (userId) => {
    try {
      await adminService.blockUser(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isBlocked: true } : user
      ));
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const unblockUser = async (userId) => {
    try {
      await adminService.unblockUser(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isBlocked: false } : user
      ));
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const createAdmin = async (adminData) => {
    try {
      const response = await adminService.createAdmin(adminData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  const value = {
    users,
    dashboardStats,
    loading,
    fetchUsers,
    fetchDashboardStats,
    blockUser,
    unblockUser,
    deleteUser,
    updateUserRole,
    createAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};