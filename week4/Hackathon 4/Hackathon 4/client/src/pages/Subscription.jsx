import React, { useState, useEffect } from 'react';
import { planService, userService } from '../services/auth';
import PlanCard from '../components/Cards/PlanCard';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await planService.getAllPlans();
      setPlans(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleFreeTrial = async () => {
    try {
      await userService.activateFreeTrial();
      alert('Free trial activated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to activate free trial');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.subscribeToPlan({
        planId: selectedPlan._id,
        ...paymentData
      });
      alert('Subscription activated successfully!');
      setShowPaymentModal(false);
      setSelectedPlan(null);
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolderName: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="subscription-page">
      <div className="container">
        <div className="subscription-header">
          <h1>Choose Your Plan</h1>
          <p>Select a plan that works best for you</p>
          <button 
            className="btn btn-secondary"
            onClick={handleFreeTrial}
          >
            Start Free Trial (7 Days)
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="plans-grid">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onSelect={handlePlanSelect}
              isSelected={selectedPlan?._id === plan._id}
            />
          ))}
        </div>

        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Payment Details"
        >
          <form onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                required
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                value={paymentData.expiryDate}
                onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={paymentData.cvv}
                onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Card Holder Name</label>
              <input
                type="text"
                value={paymentData.cardHolderName}
                onChange={(e) => setPaymentData({...paymentData, cardHolderName: e.target.value})}
                placeholder="John Doe"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Subscribe Now
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Subscription;