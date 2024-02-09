import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { LOGIN_MUTATION } from "../graphql/queries";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { email, password } });
      localStorage.setItem("token", response.data.login.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.login.user));
      console.log("Logged in user:", response.data.login.user);
      router.push('/');
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-gray-800 w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-1"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Sign In
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-red-500">{error.message}</p>}
    </form>
  );
};

export default LoginForm;
