import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!userData.name || !userData.email || !userData.password) {
      setErrorMessage("Fill all the fields");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // Sign up with email
      const { error } = await signUpWithEmail(userData.email, userData.password);

      if (error) {
        throw error;
      }

      // If successful, redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.message);
      setErrorMessage(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <section className="container flex flex-col max-w-full min-h-screen mt-8 font-medium">
        <div className="w-full lg:mx-auto p-4 relative">
          <div className="shadow-2xl max-w-full lg:max-w-[30%] mx-auto rounded-md p-5 lg:p-14 z-100 bg-white">
            <h2 className="text-2xl lg:text-3xl text-center font-bold text-gray-600">
              Sign Up
            </h2>
            <form onSubmit={handleSubmitForm}>
              <div className="mb-8">
                <p className="text-md text-gray-500 mb-2">Full Name</p>
                <input
                  className="border w-full rounded-md border-gray-300 p-2"
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
              <div className="mb-8">
                <p className="text-md text-gray-500 mb-2">Email</p>
                <input
                  className="border w-full rounded-md border-gray-300 p-2"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
              <div className="mb-8">
                <p className="text-md text-gray-500 mb-2">Password</p>
                <input
                  className="border w-full rounded-md border-gray-300 p-2"
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
              {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
              <button
                type="submit"
                className="w-full bg-[#eb7ea1] active:bg-[#ff74a0] py-2 rounded-md text-gray-50 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
              <div className="max-w-xl mx-auto">
                <p className="text-sm mt-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
