import React from 'react';
import { useMutation } from "@apollo/client";
import { REMOVE_FROM_CART_MUTATION } from "../graphql/queries";

const RemoveFromCartButton = ({ dishId, onRemove }) => {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { dishId },
    onCompleted: onRemove,
  });

  const handleRemove = async () => {
    await removeFromCart();
  };

  return (
    <button
      onClick={handleRemove}
      className="bg-red-500 text-white py-2 px-4 rounded-3xl hover:bg-red-700 transition ease-in-out duration-150 flex items-center space-x-2"
      disabled={loading}
    >
      <span>Remove</span>
    </button>
  );
};

export default RemoveFromCartButton;
