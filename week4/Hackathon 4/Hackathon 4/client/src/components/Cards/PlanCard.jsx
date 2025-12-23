import React from 'react';
import './PlanCard.css';

const PlanCard = ({ plan, onSelect, isSelected }) => {
  return (
    <div className={`plan-card ${isSelected ? 'selected' : ''}`}>
      <div className="plan-header">
        <h3>{plan.name}</h3>
        <div className="plan-price">
          <span className="currency">$</span>
          <span className="amount">{plan.price}</span>
          <span className="period">/{plan.duration} days</span>
        </div>
      </div>
      <div className="plan-features">
        <ul>
          {plan.features?.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <button 
        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onSelect(plan)}
      >
        {isSelected ? 'Selected' : 'Select Plan'}
      </button>
    </div>
  );
};

export default PlanCard;