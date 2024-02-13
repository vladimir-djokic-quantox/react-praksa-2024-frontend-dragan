import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { GET_USER_CART_QUERY, CLEAR_CART_MUTATION } from "../graphql/queries";
import { useRouter } from 'next/router';

const Cart = ({ onClose: closeCart }) => {
  const router = useRouter();
  const { data } = useQuery(GET_USER_CART_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const [clearCart] = useMutation(CLEAR_CART_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    refetchQueries: [GET_USER_CART_QUERY],
  });

  const isEmpty = !data || data.me.cart.data.attributes.dishes.data.length === 0;
  const isLoggedIn = !!localStorage.getItem("token");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClearCart = () => {
    clearCart().catch((error) => console.error("Error clearing cart:", error));
  };

  const onClose = () => {
    setIsVisible(false);
    setTimeout(() => closeCart(), 300);
  };

  const handleGoToCheckout = () => {
    router.push('/checkout');
  };

  let totalPrice = 0;
  let totalQuantity = 0;
  if (data && data.me.cart.data.attributes.dishes.data.length > 0) {
    data.me.cart.data.attributes.dishes.data.forEach((dish) => {
      totalPrice += dish.attributes.price;
      totalQuantity += 1; 
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div
        className={`w-full md:w-1/3  bg-white shadow-2xl z-50 flex flex-col rounded-l-xl ${
          isVisible ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-gray-100 rounded-tl-lg">
          <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition ease-in-out duration-150">
            Close
          </button>
          {isLoggedIn && !isEmpty && (
            <button onClick={handleClearCart} className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition ease-in-out duration-150">
              Clear Cart
            </button>
          )}
        </div>
        <div className="flex-grow p-4 overflow-auto">
          {isEmpty ? (
            <p className="text-gray-600 text-center mt-10 font-semibold">Your cart is empty.</p>
          ) : (
            data.me.cart.data.attributes.dishes.data.map((dish, index) => (
              <div key={index} className="text-gray-600 flex justify-between items-center border-b py-4 last:border-b-0">
                <span className="font-semibold">{dish.attributes.name}</span>
                <span className="font-semibold text-gray-800">{`${dish.attributes.price.toFixed(2)} RSD`}</span>
              </div>
            ))
          )}
        </div>
        {!isEmpty && (
          <>
            <div className="mx-auto w-[80%] p-4 bg-gray-100 rounded-lg mb-3 font-semibold">
              <p className="text-gray-600">Total Quantity: {totalQuantity}</p>
              <p className="text-gray-600">Total Price: {totalPrice.toFixed(2)} RSD</p>
            </div>
            <button
              onClick={handleGoToCheckout}
              className="bg-green-500 text-white py-2 px-4 rounded-xl w-[80%] mb-3 mx-auto hover:bg-green-600 transition ease-in-out duration-150"
            >
              Go to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
