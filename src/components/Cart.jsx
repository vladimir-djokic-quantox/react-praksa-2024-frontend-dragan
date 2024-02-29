import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_CART_QUERY } from "../graphql/queries";
import { useRouter } from "next/router";
import ClearCartButton from "./ClearCartButton";
import RemoveFromCartButton from "./RemoveFromCartButton"; 

const Cart = ({ onClose: closeCart }) => {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_USER_CART_QUERY);
  const [dishes, setDishes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data?.me?.cart?.data?.attributes?.dishes?.data) {
      setDishes(data.me.cart.data.attributes.dishes.data);
    }
  }, [data]);

  const handleRemoveFromCart = (dishId) => {
    setDishes(currentDishes => currentDishes.filter(dish => dish.id !== dishId));
    refetch();
  };

  const handleClearCart = () => {
    setDishes([]);
    refetch();
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onCloseHandler = () => {
    setIsVisible(false);
    setTimeout(() => closeCart(), 300);
  };

  const handleGoToCheckout = () => {
    router.push("/checkout");
  };

  const isEmpty = dishes.length === 0;
  const isLoggedIn = !!localStorage.getItem("token");
  const totalPrice = dishes.reduce((acc, dish) => acc + dish.attributes.price, 0);
  const totalQuantity = dishes.length;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onCloseHandler}></div>
      <div className={`w-full md:w-1/3 bg-white shadow-2xl z-50 flex flex-col rounded-l-xl ${isVisible ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <div className="p-4 flex justify-between items-center bg-gray-100 rounded-tl-lg border-b">
          <button onClick={onCloseHandler} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ease-in-out duration-150">
            Close
          </button>
          {isLoggedIn && !isEmpty && <ClearCartButton onClear={handleClearCart} />}
        </div>
        <div className="flex-grow p-4 overflow-auto">
          {isEmpty ? (
            <p className="text-gray-600 text-center mt-10 font-semibold">Your cart is empty.</p>
          ) : (
            dishes.map((dish) => (
              <div key={dish.id} className="flex justify-between items-center border-b py-4 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <img src={`${dish.attributes.image.data[0].attributes.url.startsWith("http") ? "" : "http://localhost:3030"}${dish.attributes.image.data[0].attributes.url}`} alt={dish.attributes.name} className="w-16 h-16 object-cover" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{dish.attributes.name}</span>
                    <span className="text-sm text-gray-600">{`${dish.attributes.price.toFixed(2)} RSD`}</span>
                  </div>
                </div>
                <RemoveFromCartButton dishId={dish.id} onRemove={() => handleRemoveFromCart(dish.id)} />
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
            <button onClick={handleGoToCheckout} className="bg-green-500 text-white py-2 px-4 rounded-xl w-[80%] mb-3 mx-auto hover:bg-green-600 transition ease-in-out duration-150">
              Go to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
