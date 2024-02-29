import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { GET_USER_CART_QUERY, CLEAR_CART_MUTATION, REMOVE_FROM_CART_MUTATION } from "../graphql/queries";
import { useRouter } from "next/router";

const Cart = ({ onClose: closeCart }) => {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_USER_CART_QUERY);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    if (data && data.me && data.me.cart && data.me.cart.data.attributes.dishes.data) {
      setDishes(data.me.cart.data.attributes.dishes.data);
    }
  }, [data]);

  const [removeFromCart, { loading: loadingRemove }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [clearCart, { loading: loadingClear }] = useMutation(CLEAR_CART_MUTATION, {
    onCompleted: () => refetch(),
  });

  const handleRemoveFromCart = async (dishId) => {
    await removeFromCart({ variables: { dishId } });
    setDishes(currentDishes => currentDishes.filter(dish => dish.id !== dishId));
  };

  const handleClearCart = async () => {
    await clearCart();
    setDishes([]);
  };

  const isEmpty = dishes.length === 0;
  const isLoggedIn = !!localStorage.getItem("token");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onClose = () => {
    setIsVisible(false);
    setTimeout(() => closeCart(), 300);
  };

  const handleGoToCheckout = () => {
    router.push("/checkout");
  };

  let totalPrice = dishes.reduce((acc, dish) => acc + dish.attributes.price, 0);
  let totalQuantity = dishes.length;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={`w-full md:w-1/3 bg-white shadow-2xl z-50 flex flex-col rounded-l-xl ${
          isVisible ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center bg-gray-100 rounded-tl-lg border-b">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ease-in-out duration-150"
            >
            Close
          </button>
          {isLoggedIn && !isEmpty && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ease-in-out duration-150"
              disabled={loadingClear}
            >
              Clear Cart
            </button>
          )}
        </div>
        <div className="flex-grow p-4 overflow-auto">
          {isEmpty ? (
            <p className="text-gray-600 text-center mt-10 font-semibold">
              Your cart is empty.
            </p>
          ) : (
            dishes.map((dish, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-4 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`${
                      dish.attributes.image.data[0].attributes.url.startsWith(
                        "http"
                      )
                        ? ""
                        : "http://localhost:3030"
                    }${dish.attributes.image.data[0].attributes.url}`}
                    alt={dish.attributes.name}
                    className="w-16 h-16 object-cover "
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {dish.attributes.name}
                    </span>
                    <span className="text-sm text-gray-600">{`${dish.attributes.price.toFixed(
                      2
                    )} RSD`}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(dish.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition ease-in-out duration-150 flex items-center space-x-2"
                  disabled={loadingRemove}
                >
                  <span>Remove</span>
                </button>
              </div>
            ))
          )}
        </div>
        {!isEmpty && (
          <>
            <div className="mx-auto w-[80%] p-4 bg-gray-100 rounded-lg mb-3 font-semibold">
              <p className="text-gray-600">Total Quantity: {totalQuantity}</p>
              <p className="text-gray-600">
                Total Price: {totalPrice.toFixed(2)} RSD
              </p>
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
