import { useState } from "react";
import  Navbar  from "../../components/Navbar/Navbar";
import { PasswordInput } from "../../components/input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { EnterOTP } from "../../components/OTP/EnterOTP";

export const SignUp = () => {
  // Step: 'signup' → fill form, 'verify' → enter OTP
  const [step, setStep] = useState("signup");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [tempToken, setTempToken] = useState(""); // store temporary JWT

  const navigate = useNavigate();

  // Handle form submit → create account + send OTP
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Basic validations
    if (!trimmedName) return setError("Please enter your name.");
    if (!trimmedEmail) return setError("Please enter your email.");
    if (!validateEmail(trimmedEmail)) return setError("Enter a valid email.");
    if (!password) return setError("Please enter a password.");

    setLoading(true);

    try {
      const res = await axiosInstance.post("/create-account", {
        fullname: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (res.data?.error) {
        setError(res.data.message || "Signup failed. Try again.");
        return;
      }

      if (res.data?.accessToken) {
        setTempToken(res.data.accessToken);
        setStep("verify"); // go to OTP step
      } else {
        setError("Unexpected error: no token received.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification step
  const handleVerifyOtp = async (otp) => {
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post(
        "/verify-signup-otp", // ✅ use correct endpoint
        { email, otp },
        { headers: { Authorization: `Bearer ${tempToken}` } }
      );

      // Save token (still valid) and redirect
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
