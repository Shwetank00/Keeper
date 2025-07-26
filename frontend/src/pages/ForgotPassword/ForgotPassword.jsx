import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstanse"; // Corrected typo here
import Toast from "../../components/ToastMessage/Toast";
import { validateEmail } from "../../utils/helper"; // Assuming you have email validation here

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/forgot-password", {
        email: email,
      });

      if (response.data && !response.data.error) {
        showToastMessage(
          response.data.message || "OTP sent successfully!",
          "success"
        );
        // Navigate to the Enter OTP screen, passing the email
        navigate("/enter-otp-for-reset", { state: { email: email } });
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
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-96 border rounded bg-white px-7 py-10 shadow-md">
          <form onSubmit={handleForgotPassword}>
            <h4 className="text-2xl text-center mb-7">Forgot Password</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Send OTP
            </button>

            <p className="text-sm text-center mt-4">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
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

export default ForgotPassword;
