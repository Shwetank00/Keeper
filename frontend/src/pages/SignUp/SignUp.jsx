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
  const [otp, setOtp] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [step, setStep] = useState(1); // 1=signup, 2=verify otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) return setError("Please enter your name.");
    if (!trimmedEmail) return setError("Please enter your email.");
    if (!validateEmail(trimmedEmail))
      return setError("Please enter a valid email.");
    if (!password) return setError("Please enter the password.");

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullname: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (response.data?.error) {
        setError(response.data?.message || "An error occurred during signup.");
        return;
      }

      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setStep(2); // move to OTP step
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while signing up. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) return setError("Please enter the OTP.");

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/verify-email-otp",
        { otp },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data?.error) {
        setError(response.data?.message || "OTP verification failed.");
        return;
      }

      // store token & redirect
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
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
          {step === 1 && (
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
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} noValidate>
              <h4 className="text-2xl mb-7">Verify Email</h4>

              <input
                type="text"
                placeholder="Enter OTP"
                className="input-box"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
