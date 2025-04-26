import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { User, Mail, Lock } from "lucide-react";

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
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const toastId = toast.loading("Creating your account...");

      const { error, data } = await signUpWithEmail(
        userData.email,
        userData.password,
        { full_name: userData.name }
      );

      if (error) {
        throw error;
      }

      toast.success("Account created successfully! Please log in.", { id: toastId });
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Failed to sign up");
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
    <div className="container mx-auto flex items-center justify-center min-h-[85vh] px-4 py-6 sm:py-8">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 px-4 sm:px-6 pt-5 sm:pt-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center gradient-text">Create an Account</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pt-4 sm:pt-6">
          {errorMessage && (
            <div className="mb-4 p-2.5 sm:p-3 bg-accent-red/10 border-l-4 border-accent-red rounded-r-lg text-light-100 text-sm sm:text-base">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10 h-9 sm:h-10 text-sm sm:text-base"
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10 h-9 sm:h-10 text-sm sm:text-base"
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10 h-9 sm:h-10 text-sm sm:text-base"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-9 sm:h-10 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center px-4 sm:px-6 pb-5 sm:pb-6">
          <div className="text-xs sm:text-sm text-light-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 hover:underline font-medium">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
