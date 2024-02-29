import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51OjkWNACd5fqpvnALwyW8ISAN3xyQ5mFsnbADqZN9C4GQuk482bjGVo8xjggpNrSczb2TVtlNK3nRi3ya9mSqSvj00zzTcMYZU"
);

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md p-8 mx-4 my-auto bg-white rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Payment</h3>
          <p className="mt-2 text-sm text-gray-600">
            Your payment details go here.
          </p>
        </div>
        <div className="mt-6">
          <Elements stripe={stripePromise}>
            <PaymentForm
              onSuccessfulPayment={() => {
                console.log("Payment successful!");
                onPaymentSuccess();
                onClose();
              }}
            />
          </Elements>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
