import React from "react";
import SignupForm from "../components/SignupForm"; 

const SignupPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-8 py-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Sign Up</h2>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
