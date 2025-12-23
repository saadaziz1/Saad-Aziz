"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, Save, X, Crown, CreditCard } from "lucide-react";
import { api } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    expiresAt?: string;
  };
}

const ProfilePage = () => {
  const { user: currentUser, setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const profileData = response.data.data || response.data;
      setProfile(profileData);
      setEditForm({
        name: profileData.name,
        email: profileData.email,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/users/profile', editForm);
      const updatedProfile = response.data.data || response.data;
      setProfile(updatedProfile);
      setUser({ ...currentUser!, name: editForm.name, email: editForm.email });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profile?.name || "",
      email: profile?.email || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-white text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-white text-center">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-350 3xl:max-w-400 mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-white text-3xl 3xl:text-6xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400 3xl:text-xl">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2">
            <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl 3xl:text-3xl font-semibold">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-black hover:bg-gray-200"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-white text-black hover:bg-gray-200"
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm 3xl:text-lg font-medium text-gray-400 mb-2">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 3xl:px-5 3xl:py-4 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                    />
                  ) : (
                    <p className="text-white 3xl:text-lg">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm 3xl:text-lg font-medium text-gray-400 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 3xl:px-5 3xl:py-4 3xl:text-lg bg-[#1A1A1A] border border-[#2A2A2A] rounded-md text-white focus:outline-none focus:border-white"
                    />
                  ) : (
                    <p className="text-white 3xl:text-lg">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm 3xl:text-lg font-medium text-gray-400 mb-2">Member Since</label>
                  <p className="text-white 3xl:text-lg">
                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Status Cards */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 3xl:w-7 3xl:h-7 text-white" />
                <h3 className="text-white font-semibold 3xl:text-xl">Account Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm 3xl:text-base">Role</span>
                  <div className="flex items-center gap-2">
                    {profile.role === 'SUPER_ADMIN' && <Crown className="w-4 h-4 3xl:w-5 3xl:h-5 text-yellow-400" />}
                    <span className={`px-2 py-1 3xl:px-4 3xl:py-2 rounded-full text-xs 3xl:text-sm font-medium ${
                      profile.role === 'SUPER_ADMIN' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      {profile.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm 3xl:text-base">Status</span>
                  <span className={`px-2 py-1 3xl:px-4 3xl:py-2 rounded-full text-xs 3xl:text-sm font-medium ${
                    profile.isBlocked 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {profile.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Subscription Status */}
            <Card className="bg-[#0A0A0A] border-[#1A1A1A] p-6 3xl:p-16">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 3xl:w-7 3xl:h-7 text-white" />
                <h3 className="text-white font-semibold 3xl:text-xl">Subscription</h3>
              </div>
              {profile.subscription ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm 3xl:text-base">Plan</span>
                    <span className="px-2 py-1 3xl:px-4 3xl:py-2 bg-white/10 text-white text-xs 3xl:text-sm rounded-full font-medium">
                      {profile.subscription.plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm 3xl:text-base">Status</span>
                    <span className={`px-2 py-1 3xl:px-4 3xl:py-2 rounded-full text-xs 3xl:text-sm font-medium ${
                      profile.subscription.status === 'ACTIVE' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {profile.subscription.status}
                    </span>
                  </div>
                  {profile.subscription.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm 3xl:text-base">Expires</span>
                      <span className="text-white text-sm 3xl:text-base">
                        {new Date(profile.subscription.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm 3xl:text-base mb-3">No active subscription</p>
                  <Button className="bg-white text-black hover:bg-gray-200 text-sm 3xl:text-base 3xl:px-6 3xl:py-3">
                    Choose Plan
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;