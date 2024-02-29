import React from 'react';
import { useMutation } from "@apollo/client";
import { CLEAR_CART_MUTATION } from "../graphql/queries";

const ClearCartButton = ({ onClear }) => {
  const [clearCart, { loading }] = useMutation(CLEAR_CART_MUTATION, {
    onCompleted: onClear,
  });

  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <button
      onClick={handleClearCart}
      className="bg-red-500 text-white py-2 px-4 rounded-3xl hover:bg-red-600 transition ease-in-out duration-150"
      disabled={loading}
    >
      Clear Cart
    </button>
  );
};

export default ClearCartButton;
