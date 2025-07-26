import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate// Import PropTypes
import axiosInstance from "../../utils/axiosInstanse"; // Import axiosInstance
import Toast from "../../components/ToastMessage/Toast"; // Import Toast

// Remove onSubmit, loading, error from props as this component will now handle its own logic
export const EnterOTP = () => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // State to hold the email
  const [error, setError] = useState(null); // Local error state
  const [loading, setLoading] = useState(false); // Local loading state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(null);

  useEffect(() => {
    // Extract email from navigation state
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email, redirect back to the forgot password entry
      navigate("/forgot-password");
    }
  }, [location.state, navigate]);

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleChange = (e, idx) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // only 0-9, 1 char
    const newOtp = [...otpDigits];
    newOtp[idx] = value;
    setOtpDigits(newOtp);
    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Call the new backend endpoint for OTP verification
      const response = await axiosInstance.post("/verify-forgot-password-otp", {
        email: email,
        otp: otp,
      });

      if (response.data && !response.data.error) {
        showToastMessage(
          response.data.message || "OTP verified successfully!",
          "success"
        );
        // On successful OTP verification, navigate to the Reset Password screen
        navigate("/reset-password-final", { state: { email: email } });
      } else {
        showToastMessage(
          response.data.message || "Something went wrong.",
          "error"
        );
        setError(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        showToastMessage(error.response.data.message, "error");
        setError(error.response.data.message);
      } else {
        showToastMessage(
          "An unexpected error occurred. Please try again.",
          "error"
        );
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null; // Or a loading spinner, while email is being retrieved from state
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-96 border rounded bg-white px-7 py-10 shadow-md">
          <form onSubmit={handleSubmit} noValidate>
            <h4 className="text-2xl text-center mb-7">Enter OTP</h4>
            <p className="text-center text-sm mb-4">
              Please enter the 6-digit OTP sent to:{" "}
              <span className="font-semibold">{email}</span>
            </p>
            <div className="flex justify-between mb-4">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-10 h-12 border rounded text-center text-xl focus:outline-none focus:border-blue-500"
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-xs pb-2">{error}</p>}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
      <Toast
        isShown={showToast}
        message={toastMessage}
        type={toastType}
        onClose={handleCloseToast}
      />
    </>
  );
};
