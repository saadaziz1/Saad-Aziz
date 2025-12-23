import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/auth';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await userService.getSubscriptionStatus();
      setSubscription(response.data);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <span>{user?.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span>{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Subscription Status</h2>
            <div className="subscription-info">
              {subscription?.isActive ? (
                <>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className="active">Active</span>
                  </div>
                  {subscription.isTrial && (
                    <div className="info-item">
                      <label>Type:</label>
                      <span>Free Trial</span>
                    </div>
                  )}
                  <div className="info-item">
                    <label>Start Date:</label>
                    <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>End Date:</label>
                    <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
                  </div>
                </>
              ) : (
                <div className="info-item">
                  <label>Status:</label>
                  <span className="inactive">No Active Subscription</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;