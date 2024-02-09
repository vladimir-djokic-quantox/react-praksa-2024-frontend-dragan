import React from "react";
import SignupForm from "../components/SignupForm";
import Layout from "@/components/Layout";

const SignupPage = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-md px-8 py-6 mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Sign Up
          </h2>
          <SignupForm />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
