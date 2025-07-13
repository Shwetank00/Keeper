import { useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { PasswordInput } from "../../components/input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstanse";
import { EnterOTP } from "../../components/OTP/EnterOTP";

export const SignUp = () => {
  const [step, setStep] = useState("signup"); // "signup" or "verify"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Save token temporarily until verified
  const [tempToken, setTempToken] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // validations
    if (!trimmedName) return setError("Please enter your name.");
    if (!trimmedEmail) return setError("Please enter your email.");
    if (!validateEmail(trimmedEmail))
      return setError("Please enter a valid email.");
    if (!password) return setError("Please enter the password.");

    setLoading(true);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullname: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (response.data?.error) {
        setError(response.data?.message || "Signup failed. Try again.");
        return;
      }

      if (response.data?.accessToken) {
        setTempToken(response.data.accessToken);
        setStep("verify");
      } else {
        setError("Unexpected error: no access token received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setLoading(true);
    setError("");
    try {
      // use a separate axios call without adding Authorization header from localStorage
      await axiosInstance.post(
        "/verify-email-otp",
        { otp },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );

      // store verified token in localStorage and redirect
      localStorage.setItem("accessToken", tempToken);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          {step === "signup" ? (
            <form onSubmit={handleSignUp} noValidate>
              <h4 className="text-2xl mb-7">Sign Up</h4>

              <input
                type="text"
                placeholder="Name"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
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

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-sm text-center mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary underline"
                >
                  Login
                </Link>
              </p>
            </form>
          ) : (
            <>
              <h4 className="text-2xl mb-5">Verify your email</h4>
              <p className="text-xs mb-4">
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
              <EnterOTP
                onSubmit={handleVerifyOtp}
                loading={loading}
                error={error}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
