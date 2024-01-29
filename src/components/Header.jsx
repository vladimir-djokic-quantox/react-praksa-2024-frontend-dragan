import React, { useState, useEffect } from "react";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-blue-600 text-white p-3 flex justify-between items-center shadow-md w-[80%] mx-auto rounded-full mt-3">
      <h1 className="text-lg font-bold ml-5">Food Ordering App</h1>
      <div className="flex items-center mr-5 ">
        {user ? (
          <>
            <span className="font-medium capitalize bg-white text-blue-600 px-4 py-1 rounded">
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
            <button
              className="bg-white font-semibold text-blue-600 hover:bg-blue-100 px-4 py-1 rounded transition duration-300 ease-in-out"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button
              className="bg-white font-semibold text-blue-600 hover:bg-blue-100 px-4 py-1 rounded ml-4 transition duration-300 ease-in-out"
              onClick={() => setShowSignupModal(true)}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
      {showLoginModal && (
        <LoginModal
          onLoginSuccess={(user) => {
            setUser(user);
            setShowLoginModal(false);
          }}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      {showSignupModal && (
        <SignupModal
          onSignupSuccess={(user) => {
            setUser(user);
            setShowSignupModal(false);
          }}
          onClose={() => setShowSignupModal(false)}
        />
      )}
    </header>
  );
};

export default Header;
