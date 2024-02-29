import React from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useMutation } from '@apollo/client';
import { CLEAR_CART_MUTATION } from "../graphql/queries";

const PaymentForm = ({ onSuccessfulPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    const cardNumberElement = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
    });
  
    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      onSuccessfulPayment(paymentMethod.id);
      
      try {
        await clearCart();
      } catch (error) {
        console.error('Error clearing cart:', error.message);
      }
    }
  };

  const [clearCart] = useMutation(CLEAR_CART_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-md bg-gray-50">
        <CardNumberElement className="p-2 rounded-md w-full" options={cardStyle} />
      </div>
      <div className="flex space-x-4">
        <div className="p-4 rounded-md bg-gray-50 flex-1">
          <CardExpiryElement className="p-2 rounded-md w-full" options={cardStyle} />
        </div>
        <div className="p-4 rounded-md bg-gray-50 flex-1">
          <CardCvcElement className="p-2 rounded-md w-full" options={cardStyle} />
        </div>
      </div>
      <button type="submit" disabled={!stripe} className="w-full px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
        Pay
      </button>
    </form>
  );
};

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export default PaymentForm;