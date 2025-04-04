import { useState } from "react";
import PropTypes from "prop-types";
import { Navbar } from "../../components/Navbar/Navbar";
import { PasswordInput } from "../../components/input/PasswordInput";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

export const SignUp = ({ onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    // Call the signup function passed via props
    onSignUp({ name, email, password });
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            {/* Name Input */}
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email Input */}
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password Input */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Display error message if present */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Submit button */}
            <button type="submit" className="btn-primary">
              Create Account
            </button>

            {/* Login Redirect */}
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

// Prop Types
SignUp.propTypes = {
  onSignUp: PropTypes.func.isRequired,
};
