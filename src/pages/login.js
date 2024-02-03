import React from "react";
import LoginForm from "../components/LoginForm"; 

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
