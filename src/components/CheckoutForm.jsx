import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { GET_USER_CART_QUERY } from '../graphql/queries';

const CheckoutForm = () => {
  const { data, loading, error } = useQuery(GET_USER_CART_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading cart: {error.message}</p>;
  if (!data || data.me.cart.data.attributes.dishes.data.length === 0) return <p>Your cart is empty.</p>;

  const totalPrice = data.me.cart.data.attributes.dishes.data.reduce(
    (acc, dish) => acc + dish.attributes.price,
    0
  ).toFixed(2);

  return (
    <div>
      <h2 className="font-semibold text-lg">Review Your Orders</h2>
      <ul>
        {data.me.cart.data.attributes.dishes.data.map((dish, index) => (
          <li key={index} className="flex justify-between items-center border-b py-2 text-gray-600 font-semibold">
            <span>{dish.attributes.name}</span>
            <span>{`${dish.attributes.price.toFixed(2)} RSD`}</span>
          </li>
        ))}
      </ul>
      <p className="text-right mt-2 font-semibold">Total: {totalPrice} RSD</p>

      <div>
        <h2 className="font-semibold text-lg mb-2">Shipping Information</h2>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => console.log('Proceeding to payment...')}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckoutForm;
