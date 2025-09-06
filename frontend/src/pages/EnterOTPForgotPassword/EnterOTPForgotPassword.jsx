import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast"; // Assuming Navbar might be needed here
import Navbar from "../../components/Navbar/Navbar"; // Assuming Navbar might be needed here

// Import the now generic EnterOTP component
import { EnterOTP } from "../../components/OTP/EnterOTP";

export const EnterOTPForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(null); // Initialize to null

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      navigate("/forgot-password"); // Redirect if email not passed
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

  const handleVerifyOtpForForgotPassword = async (otp) => {
    // This function receives OTP from generic EnterOTP
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/verify-forgot-password-otp", {
        email: email,
        otp: otp,
      });

      if (response.data && !response.data.error) {
        showToastMessage(
          response.data.message || "OTP verified successfully!",
          "success"
        );
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
    return null; // Or a loading spinner
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-96 border rounded bg-white px-7 py-10 shadow-md">
          <h4 className="text-2xl text-center mb-7">
            Enter OTP for Password Reset
          </h4>
          <p className="text-center text-sm mb-4">
            Please enter the 6-digit OTP sent to:{" "}
            <span className="font-semibold">{email}</span>
          </p>
          {/* Render the generic EnterOTP component here */}
          <EnterOTP
            onSubmit={handleVerifyOtpForForgotPassword}
            loading={loading}
            error={error}
          />
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
