import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

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

const CLEAR_CART_MUTATION = gql`
  mutation ClearCart {
    clearCart {
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
`;

const Cart = ({ onClose }) => {
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

  const isEmpty =
    !data || data.me.cart.data.attributes.dishes.data.length === 0;

  const handleClearCart = () => {
    clearCart().catch((error) => console.error("Error clearing cart:", error));
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}>
      </div>
      <div className="w-full md:w-1/3 h-1/2 bg-white shadow-2xl z-50 flex flex-col rounded-l-lg">
        <div className="p-4 border-b flex justify-between items-center bg-gray-100 rounded-tl-lg">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition ease-in-out duration-150 font-semibold"
          >
            Close
          </button>
          {isLoggedIn && !isEmpty && (
            <button
              onClick={handleClearCart}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ease-in-out duration-150"
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
            data.me.cart.data.attributes.dishes.data.map((dish, index) => (
              <div
                key={index}
                className="text-gray-600 flex justify-between items-center border-b py-4 last:border-b-0"
              >
                <span className="font-semibold">{dish.attributes.name}</span>
                <span className="font-semibold text-gray-800">{`${dish.attributes.price.toFixed(
                  2
                )} RSD`}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
