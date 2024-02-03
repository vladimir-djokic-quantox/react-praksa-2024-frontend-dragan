import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SIGNUP_MUTATION } from "../graphql/queries";
import { useRouter } from 'next/router'; 

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);
  const router = useRouter(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({ variables: formData });
      router.push('/login'); 
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-semibold text-gray-600">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="text-gray-800 w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="text-gray-800 w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="text-gray-800 w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1"
        />
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 leading-6 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Sign Up
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-red-500">{error.message}</p>}
    </form>
  );
};

export default SignupForm;
