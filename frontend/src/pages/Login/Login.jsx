import { useState } from "react";
import Navbar  from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "../../components/input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "./../../utils/axiosInstance";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // ✅ Changed from "null" to null
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(null);

    //!LogIn API Call
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while logging in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signUp" className="font-medium text-primary underline">
                Create an account
              </Link>
            </p>
            <p className="text-sm text-center mt-4">
              <Link
                to="/forgot-password"
                className="font-medium text-primary underline"
              >
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
