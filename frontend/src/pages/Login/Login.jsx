import React from "react";
import { useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import { PasswordInput } from "../../components/input/PasswordInput";
import { validateEmail } from "../../utils/helper";

export const Login = () => {
  // UseState hook to create a state variable called email, and a function to update it.
  // The initial value of email is an empty string.
  const [email, setEmail] = useState("");

  // UseState hook to create a state variable called password, and a function to update it.
  // The initial value of password is an empty string.
  const [password, setPassword] = useState("");

  // UseState hook to create a state variable called error, and a function to update it.
  // The initial value of error is the string "null".
  const [error, setError] = useState("");

  // Function to handle the login form submission.
  // It takes an event object as a parameter.
  // The function prevents the default form submission behavior.
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

    setError("");

    //Login API call
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        {/* This div contains the login form */}
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            {/* This input field is for the user's email */}
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* This component is for the user's password */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></PasswordInput>

            {/* This error message is displayed if the user enters an invalid email address */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* This button submits the form */}
            <button type="submit" className="btn-primary">
              Login
            </button>
            {/* This link takes the user to the sign up page */}
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signUp" className="font-medium text-primary underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
