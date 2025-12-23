"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ban, CheckCircle, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

const AdminUsers = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  console.log('Current user:', currentUser);
  console.log('Users:', users);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserBlock = async (userId: string) => {
    try {
      const response = await api.patch(`/users/toggle-block/${userId}`);
      setUsers(users.map(u => u._id === userId ? response.data.data : u));
    } catch (error) {
      console.error('Failed to toggle user block:', error);
    }
  };

  const toggleUserRole = async (userId: string) => {
    try {
      const response = await api.patch(`/users/toggle-role/${userId}`);
      setUsers(users.map(u => u._id === userId ? response.data.data : u));
    } catch (error) {
      console.error('Failed to toggle user role:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-white text-2xl sm:text-3xl 3xl:text-6xl font-bold">User Management</h1>
              <p className="text-gray-500 3xl:text-xl">Manage platform users</p>
            </div>
          </div>

        {loading ? (
          <div className="text-white text-center py-12">Loading users...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <Card className="bg-[#0A0A0A] border-[#1A1A1A] overflow-hidden 3xl:p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1A1A1A]">
                        <th className="text-left text-gray-500 py-4 px-6 font-medium text-sm 3xl:text-xl">User</th>
                        <th className="text-left text-gray-500 py-4 px-6 font-medium text-sm 3xl:text-xl">Role</th>
                        <th className="text-left text-gray-500 py-4 px-6 font-medium text-sm 3xl:text-xl">Subscription</th>
                        <th className="text-left text-gray-500 py-4 px-6 font-medium text-sm 3xl:text-xl">Status</th>
                        <th className="text-left text-gray-500 py-4 px-6 font-medium text-sm 3xl:text-xl">Joined</th>
                        <th className="text-left text-gray-500 py-4 px-6 font-medium text-sm 3xl:text-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-[#1A1A1A] hover:bg-[#0F0F0F] transition-colors 3xl:text-xl">
                          <td className="py-4 px-6">
                            <div>
                              <div className="text-white font-medium">{user.name}</div>
                              <div className="text-gray-500 text-sm 3xl:text-xl">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs 3xl:text-lg font-medium ${
                              user.role === 'SUPER_ADMIN' 
                                ? 'bg-white/10 text-white' 
                                : 'bg-gray-800 text-gray-300'
                            }`}>
                              {user.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {user.subscription ? (
                              <span className={`px-3 py-1 rounded-full text-xs 3xl:text-lg font-medium ${
                                user.subscription.status === 'ACTIVE' 
                                  ? 'bg-white/10 text-white' 
                                  : 'bg-gray-800 text-gray-400'
                              }`}>
                                {user.subscription.plan}
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm 3xl:text-xl">No Plan</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs 3xl:text-lg font-medium ${
                              user.isBlocked 
                                ? 'bg-gray-800 text-gray-400' 
                                : 'bg-white/10 text-white'
                            }`}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-sm 3xl:text-lg">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-4 px-6">
                            {(() => {
                              if (user._id === currentUser?.id) {
                                return <span className="text-gray-500 text-sm 3xl:text-xl">Cannot modify self</span>;
                              }
                              
                              if (user.role !== 'SUPER_ADMIN') {
                                return (
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => toggleUserBlock(user._id)}
                                      size="sm"
                                      className={`text-xs 3xl:text-lg h-8 ${
                                        user.isBlocked
                                          ? 'bg-white text-black hover:bg-gray-200'
                                          : 'bg-gray-800 text-white hover:bg-gray-700'
                                      }`}
                                    >
                                      {user.isBlocked ? (
                                        <><CheckCircle className="w-3 h-3 3xl:w-5 3xl:h-5 mr-1" /> Unblock</>
                                      ) : (
                                        <><Ban className="w-3 h-3 3xl:w-5 3xl:h-5 mr-1" /> Block</>
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() => toggleUserRole(user._id)}
                                      size="sm"
                                      className="text-xs h-8 bg-white text-black hover:bg-gray-200"
                                    >
                                      <UserCheck className="w-3 h-3 3xl:w-5 3xl:h-5 mr-1" /> Promote
                                    </Button>
                                  </div>
                                );
                              }
                              
                              if (user.role === 'SUPER_ADMIN') {
                                return (
                                  <Button
                                    onClick={() => toggleUserRole(user._id)}
                                    size="sm"
                                    className="text-xs 3xl:text-lg h-8 bg-gray-800 text-white hover:bg-gray-700"
                                  >
                                    <UserX className="w-3 h-3 mr-1" /> Demote
                                  </Button>
                                );
                              }
                              
                              return null;
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {users.map((user) => (
                <Card key={user._id} className="bg-[#0A0A0A] border-[#1A1A1A] p-4 3xl:p-12">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{user.name}</h3>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN' 
                          ? 'bg-white/10 text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isBlocked 
                            ? 'bg-gray-800 text-gray-400' 
                            : 'bg-white/10 text-white'
                        }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      
                      {user.subscription && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">Plan:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscription.status === 'ACTIVE' 
                              ? 'bg-white/10 text-white' 
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {user.subscription.plan}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
                      <span className="text-gray-500 text-sm">
                        Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      
                      <div className="flex gap-2">
                        {(() => {
                          if (user._id === currentUser?.id) {
                            return <span className="text-gray-500 text-sm">Cannot modify self</span>;
                          }
                          
                          if (user.role !== 'SUPER_ADMIN') {
                            return (
                              <>
                                <Button
                                  onClick={() => toggleUserBlock(user._id)}
                                  size="sm"
                                  className={`text-xs h-8 ${
                                    user.isBlocked
                                      ? 'bg-white text-black hover:bg-gray-200'
                                      : 'bg-gray-800 text-white hover:bg-gray-700'
                                  }`}
                                >
                                  {user.isBlocked ? (
                                    <><CheckCircle className="w-3 h-3 mr-1" /> Unblock</>
                                  ) : (
                                    <><Ban className="w-3 h-3 mr-1" /> Block</>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => toggleUserRole(user._id)}
                                  size="sm"
                                  className="text-xs h-8 bg-white text-black hover:bg-gray-200"
                                >
                                  <UserCheck className="w-3 h-3 mr-1" /> Promote
                                </Button>
                              </>
                            );
                          }
                          
                          if (user.role === 'SUPER_ADMIN') {
                            return (
                              <Button
                                onClick={() => toggleUserRole(user._id)}
                                size="sm"
                                className="text-xs h-8 bg-gray-800 text-white hover:bg-gray-700"
                              >
                                <UserX className="w-3 h-3 mr-1" /> Demote
                              </Button>
                            );
                          }
                          
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;