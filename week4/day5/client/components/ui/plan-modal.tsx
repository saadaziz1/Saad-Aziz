"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string;
  planName?: string;
  period?: "month" | "year";
  price?: number;
  isFreeTrial?: boolean;
}

export const PlanModal = ({ 
  isOpen, 
  onClose, 
  planId = '', 
  planName = 'Free Trial', 
  period = 'month', 
  price = 0,
  isFreeTrial = false 
}: PlanModalProps) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { activatePlan, activateFreeTrial, isActivatingPlan, isActivatingTrial } = useSubscription();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNum || cardNum.length < 13 || cardNum.length > 19 || !/^\d+$/.test(cardNum)) {
      newErrors.cardNumber = 'Valid card number required (13-19 digits)';
    }
    
    if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = 'Valid expiry date required (MM/YY)';
    } else {
      const [month, year] = cardDetails.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiry < new Date()) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4 || !/^\d+$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Valid CVV required (3-4 digits)';
    }
    
    if (!cardDetails.cardholderName.trim() || cardDetails.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Cardholder name required (min 2 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const cleanCardDetails = {
      cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
      expiryDate: cardDetails.expiryDate,
      cvv: cardDetails.cvv,
      cardholderName: cardDetails.cardholderName.trim()
    };

    // Validate card number is numeric and proper length
    if (!/^\d{13,19}$/.test(cleanCardDetails.cardNumber)) {
      setErrors({ cardNumber: 'Invalid card number format' });
      return;
    }

    if (isFreeTrial) {
      activateFreeTrial(cleanCardDetails, {
        onSuccess: () => {
          onClose();
          alert('Free trial activated successfully!');
          window.location.reload();
        },
        onError: (err: any) => {
          setErrors({ submit: err?.response?.data?.message || "Failed to activate free trial" });
        }
      });
    } else {
      const requestData = { planId, period, cardDetails: cleanCardDetails };
      console.log('Sending plan activation data:', requestData);
      
      activatePlan(requestData, {
        onSuccess: () => {
          onClose();
          alert('Plan activated successfully!');
          window.location.reload();
        },
        onError: (err: any) => {
          console.error('Plan activation error:', err);
          console.error('Error response:', err?.response?.data);
          setErrors({ submit: err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || "Failed to activate plan" });
        }
      });
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardDetails({...cardDetails, cardNumber: formatted});
      if (errors.cardNumber) setErrors({...errors, cardNumber: ''});
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setCardDetails({...cardDetails, expiryDate: formatted});
      if (errors.expiryDate) setErrors({...errors, expiryDate: ''});
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardDetails({...cardDetails, cvv: value});
      if (errors.cvv) setErrors({...errors, cvv: ''});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm sm:max-w-md 3xl:max-w-lg bg-[#1A1A1A] border-[#262626] p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-white text-lg sm:text-xl 3xl:text-2xl font-bold">
            {isFreeTrial ? 'Start Free Trial' : `Activate ${planName}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="mb-4 sm:mb-6">
          {isFreeTrial ? (
            <>
              <p className="text-gray-300 text-xs sm:text-sm 3xl:text-base mb-2">
                Start your 7-day free trial. No charges until trial ends.
              </p>
              <p className="text-white font-semibold text-sm sm:text-base 3xl:text-lg">Credit card required</p>
            </>
          ) : (
            <>
              <p className="text-gray-300 text-sm sm:text-base 3xl:text-lg">Plan: {planName} ({period}ly)</p>
              <p className="text-white text-base sm:text-lg 3xl:text-xl font-semibold">${price}/{period}</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm 3xl:text-base font-medium text-gray-300 mb-2">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={handleCardNumberChange}
              className={`w-full px-3 py-2 bg-[#141414] border rounded-md text-white text-sm sm:text-base 3xl:text-lg focus:outline-none ${
                errors.cardNumber ? 'border-red-500' : 'border-[#262626] focus:border-red-500'
              }`}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm 3xl:text-base font-medium text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiryDate}
                onChange={handleExpiryChange}
                className={`w-full px-3 py-2 bg-[#141414] border rounded-md text-white text-sm sm:text-base 3xl:text-lg focus:outline-none ${
                  errors.expiryDate ? 'border-red-500' : 'border-[#262626] focus:border-red-500'
                }`}
                placeholder="MM/YY"
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="block text-xs sm:text-sm 3xl:text-base font-medium text-gray-300 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={handleCvvChange}
                className={`w-full px-3 py-2 bg-[#141414] border rounded-md text-white text-sm sm:text-base 3xl:text-lg focus:outline-none ${
                  errors.cvv ? 'border-red-500' : 'border-[#262626] focus:border-red-500'
                }`}
                placeholder="123"
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm 3xl:text-base font-medium text-gray-300 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.cardholderName}
              onChange={(e) => {
                setCardDetails({...cardDetails, cardholderName: e.target.value});
                if (errors.cardholderName) setErrors({...errors, cardholderName: ''});
              }}
              className={`w-full px-3 py-2 bg-[#141414] border rounded-md text-white text-sm sm:text-base 3xl:text-lg focus:outline-none ${
                errors.cardholderName ? 'border-red-500' : 'border-[#262626] focus:border-red-500'
              }`}
              placeholder="John Doe"
            />
            {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-xs sm:text-sm 3xl:text-base text-center bg-red-500/10 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <Button
            type="submit"
            disabled={isActivatingPlan || isActivatingTrial}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-sm sm:text-base 3xl:text-lg disabled:opacity-50"
          >
            {(isActivatingPlan || isActivatingTrial) ? 
              (isFreeTrial ? "Starting Trial..." : "Activating...") : 
              (isFreeTrial ? "Start Free Trial" : `Activate Plan - $${price}`)
            }
          </Button>
        </form>
      </Card>
    </div>
  );
};