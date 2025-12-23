import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../components/SuperAdmin/SuperAdminLayout';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SuperAdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planData, setPlanData] = useState({
    name: '',
    price: '',
    duration: '',
    features: [''],
    description: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // API call to fetch plans
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      // API call to create plan
      setShowCreateModal(false);
      resetForm();
      fetchPlans();
      alert('Plan created successfully!');
    } catch (error) {
      alert('Failed to create plan');
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      description: plan.description
    });
    setShowCreateModal(true);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        // API call to delete plan
        fetchPlans();
        alert('Plan deleted successfully!');
      } catch (error) {
        alert('Failed to delete plan');
      }
    }
  };

  const resetForm = () => {
    setPlanData({
      name: '',
      price: '',
      duration: '',
      features: [''],
      description: ''
    });
    setEditingPlan(null);
  };

  const addFeature = () => {
    setPlanData({
      ...planData,
      features: [...planData.features, '']
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...planData.features];
    newFeatures[index] = value;
    setPlanData({
      ...planData,
      features: newFeatures
    });
  };

  const removeFeature = (index) => {
    const newFeatures = planData.features.filter((_, i) => i !== index);
    setPlanData({
      ...planData,
      features: newFeatures
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <SuperAdminLayout>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Subscription Plans</h1>
          <p>Create and manage subscription plans</p>
        </div>
        <button 
          className="btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="no-data">
          <p>No subscription plans found. Create your first plan!</p>
        </div>
      ) : (
        <div className="stats-grid">
          {plans.map((plan) => (
            <div key={plan._id} className="stat-card">
              <h3>{plan.name}</h3>
              <div className="stat-number">${plan.price}</div>
              <p>{plan.description}</p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEditPlan(plan)}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  style={{ background: '#dc2626' }}
                  onClick={() => handleDeletePlan(plan._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title={editingPlan ? 'Edit Plan' : 'Create New Plan'}
      >
        <form onSubmit={handleCreatePlan}>
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              value={planData.name}
              onChange={(e) => setPlanData({...planData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={planData.price}
              onChange={(e) => setPlanData({...planData, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration (days)</label>
            <input
              type="number"
              value={planData.duration}
              onChange={(e) => setPlanData({...planData, duration: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={planData.description}
              onChange={(e) => setPlanData({...planData, description: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Features</label>
            {planData.features.map((feature, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature description"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="btn btn-secondary"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="btn btn-secondary"
            >
              Add Feature
            </button>
          </div>
          <button type="submit" className="btn">
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </button>
        </form>
      </Modal>
    </SuperAdminLayout>
  );
};

export default SuperAdminPlans;