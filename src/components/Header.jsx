import React, { useState, useEffect, useCallback } from "react";
import Cart from "./Cart";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_USER_CART_QUERY } from "../graphql/queries";
import Link from "next/link";

const Header = ({ hideCartButton }) => {
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const apolloClient = useApolloClient();

  const { data } = useQuery(GET_USER_CART_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowCart(false);
    apolloClient.resetStore();
  }, [apolloClient]);

  const totalItems = data?.me.cart.data.attributes.dishes.data.length || 0;
  const totalPrice =
    data?.me.cart.data.attributes.dishes.data
      .reduce((acc, dish) => acc + dish.attributes.price, 0)
      .toFixed(2) || "0.00";

  return (
    <header className="bg-blue-600 text-white p-3 flex justify-between items-center shadow-md w-[80%] mx-auto rounded-full mt-3">
      <h1 className="text-lg font-bold ml-5">Food Ordering App</h1>
      <div className="flex items-center mr-5">
        {user ? (
          <>
            
            {!hideCartButton && (
              <button
                className="bg-orange-500 font-semibold text-white hover:bg-orange-400 px-4 py-1 rounded ml-4 transition duration-300 ease-in-out"
                onClick={() => setShowCart(true)}
              >
                View order ({totalItems} items - {totalPrice} RSD)
              </button>
            )}
            <span className="font-medium capitalize bg-white text-blue-600 px-4 py-1 rounded ml-4">
              {user.username}
            </span>
            <button
              className="bg-white font-semibold text-blue-600 hover:bg-blue-100 px-4 py-1 rounded transition duration-300 ease-in-out ml-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-white font-semibold text-blue-600 hover:bg-blue-100 px-4 py-1 rounded transition duration-300 ease-in-out"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white font-semibold text-blue-600 hover:bg-blue-100 px-4 py-1 rounded ml-4 transition duration-300 ease-in-out"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {showCart && user && <Cart onClose={() => setShowCart(false)} />}
    </header>
  );
};

export default Header;
