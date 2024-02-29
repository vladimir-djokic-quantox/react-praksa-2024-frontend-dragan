import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USER_CART_QUERY,
  CREATE_ORDER_MUTATION,
  GET_CURRENT_USER_QUERY,
  CLEAR_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from "../graphql/queries";
import PaymentModal from "./PaymentModal";
import ClearCartButton from "./ClearCartButton"; 
import RemoveFromCartButton from "./RemoveFromCartButton";

const CheckoutForm = () => {
  const { data: cartData, loading: cartLoading, error: cartError, refetch: refetchCart } = useQuery(GET_USER_CART_QUERY);
  const { data: userData, refetch: refetchUser } = useQuery(GET_CURRENT_USER_QUERY);

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const [clearCart] = useMutation(CLEAR_CART_MUTATION, {
    onCompleted: () => {
      refetchCart();
      refetchUser();
    },
  });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART_MUTATION, {
    onCompleted: () => {
      refetchCart();
      refetchUser();
    },
  });

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (cartLoading) return <p>Loading...</p>;
  if (cartError) return <p>Error loading cart: {cartError.message}</p>;

  const handleOrderSubmit = async () => {
    const fullAddress = `${streetAddress}, ${city}, ${zipCode}`;
    const dishesJson = cartData.me.cart.data.attributes.dishes.data.map(dish => ({ id: dish.id }));

    try {
      await createOrder({
        variables: {
          address: fullAddress,
          amount: parseFloat(cartData.me.cart.data.attributes.dishes.data.reduce((acc, dish) => acc + dish.attributes.price, 0).toFixed(2)),
          dishes: dishesJson,
          user: userData.me.id,
        },
      });
      setOrderSubmitted(true);
      refetchCart();
      refetchUser();
    } catch (err) {
      console.error("Error creating order:", err.message);
    }
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleRemoveFromCart = async (dishId) => {
    await removeFromCart({
      variables: { dishId },
    });
  };

  const togglePaymentModal = () => setIsPaymentModalOpen(!isPaymentModalOpen);

  const onPaymentSuccess = () => {
    setPaymentSuccess(true);
    refetchCart();
    refetchUser();
  };
  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-800"><strong>Shipping Address:</strong> {streetAddress}, {city}, {zipCode}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Review Your Orders</h2>
      {orderSubmitted ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Order created successfully!</h3>
          <p className="text-gray-800"><strong>Shipping Address:</strong> {streetAddress}, {city}, {zipCode}</p>
          <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" onClick={togglePaymentModal}>Proceed to Payment</button>
        </div>
      ) : (
        <>
      <ClearCartButton onClear={handleClearCart} /> 
          <ul className="mt-4">
            {cartData.me.cart.data.attributes.dishes.data.map((dish, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2 last:border-0">
                <span className="text-gray-600">{dish.attributes.name}</span>
                <div className="flex items-center">
                  <span className="font-semibold mr-3">{`${dish.attributes.price.toFixed(2)} RSD`}</span>
                  <RemoveFromCartButton dishId={dish.id} onRemove={() => handleRemoveFromCart(dish.id)} /> 

                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h3>
            <input type="text" placeholder="Street Address" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} className="mt-2 px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="mt-4 px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="mt-4 px-4 py-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" onClick={handleOrderSubmit}>Place Order</button>
          </div>
        </>
      )}

      <PaymentModal isOpen={isPaymentModalOpen} onClose={togglePaymentModal} onPaymentSuccess={onPaymentSuccess} />
    </div>
  );
};

export default CheckoutForm;
