import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

interface StripePaymentFormProps {
    onSuccess: (paymentIntentId: string) => void;
    amount: number;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ onSuccess, amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message || "An unexpected error occurred.");
            setIsProcessing(false);
            return;
        }

        // Confirm Payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: window.location.origin + '/checkout/success', // Fallback URL
            },
        });

        if (error) {
            // Show error to your customer (for example, payment details incomplete)
            setErrorMessage(error.message || "Payment failed");
            toast.error(error.message || "Payment failed");
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment successful!
            // Send the paymentIntent ID to your backend to finalize the order (create PENDING order which webhook updates)
            onSuccess(paymentIntent.id);
            // Don't set processing to false yet as we wait for parent to navigate/finish
        } else {
            // Unexpected status (processing, requires_action etc if redirect didn't happen)
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 mt-6"
            >
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
};
