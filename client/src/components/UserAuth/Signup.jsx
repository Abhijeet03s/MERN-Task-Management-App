import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function Signup() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    pass: "",
  });

  const handleSubmitForm = () => {
    if (!userData.name || !userData.email || !userData.pass) {
      setErrorMessage("Fill all the fields");
      return;
    }
    setErrorMessage("");
    console.log(userData);
    createUserWithEmailAndPassword(auth, userData.email, userData.pass)
      .then(async (res) => {
        const user = res.user;
        await updateProfile(user, {
          displayName: userData.name,
        });
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <section className="container flex flex-col max-w-full min-h-screen mt-8">
        <div className="w-full lg:mx-auto p-4 relative">
          <div className="shadow-2xl max-w-full lg:max-w-[30%] mx-auto rounded-md p-5 lg:p-14 z-100 bg-white">
            <h2 className="text-2xl lg:text-3xl text-center font-bold text-gray-600">
              Sign Up
            </h2>
            <div className="mb-8">
              <p className="text-md text-gray-500 mb-2">Full Name</p>
              <input
                className="border w-full rounded-md border-gray-300 p-2"
                type="text"
                name="name"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="mb-8">
              <p className="text-md text-gray-500 mb-2">Email</p>
              <input
                className="border w-full rounded-md border-gray-300 p-2"
                type="email"
                name="email"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="mb-8">
              <p className="text-md text-gray-500 mb-2">Password</p>
              <input
                className="border w-full rounded-md border-gray-300 p-2"
                type="password"
                name="password"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, pass: e.target.value }))
                }
              />
            </div>
            <p className="text-red-400">{errorMessage}</p>
            <button
              onClick={handleSubmitForm}
              className="w-full bg-blue-500 active:bg-blue-600 py-2 rounded-md text-gray-50"
            >
              Sign Up
            </button>
            <div className="max-w-xl mx-auto">
              <p className="text-sm mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
