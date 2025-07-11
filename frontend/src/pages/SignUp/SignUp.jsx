import { useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { PasswordInput } from "../../components/input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstanse";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Input validations
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullname: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (response.data?.error) {
        setError(
          response.data.error.message || "An error occurred during signup."
        );
        return;
      }

      if (response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while signing up. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp} noValidate>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
