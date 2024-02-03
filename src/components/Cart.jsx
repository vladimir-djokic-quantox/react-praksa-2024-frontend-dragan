import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_USER_CART_QUERY = gql`
  query GetUserCart {
    me {
      username
      cart {
        data {
          attributes {
            dishes {
              data {
                attributes {
                  name
                  price
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Cart = ({ onClose }) => {
  const { data } = useQuery(GET_USER_CART_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  const isEmpty = !data || data.me.cart.data.attributes.dishes.data.length === 0;

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-xl z-50 flex flex-col transition-transform transform translate-x-0">
      <div className="p-4 border-b">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition ease-in-out duration-150"
        >
          Close
        </button>
      </div>
      <div className="flex-grow p-4 overflow-auto">
        {isEmpty ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          data.me.cart.data.attributes.dishes.data.map((dish, index) => (
            <div
              key={index}
              className="text-gray-600 flex justify-between items-center border-b py-2"
            >
              <span>{dish.attributes.name}</span>
              <span>{`${dish.attributes.price.toFixed(2)} RSD`}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
