import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstanse";
import { PasswordInput } from "../../components/input/PasswordInput";
import Toast from "../../components/ToastMessage/Toast"; // Assuming you want Navbar here

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Still need email to identify user for password reset
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(null);

  useEffect(() => {
    // Ensure email is passed from the previous step (EnterOTP)
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email is passed, redirect back to forgot password or enter OTP screen
      navigate("/forgot-password"); // Or '/enter-otp-for-reset'
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

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("New Password is required.");
      return;
    }
    if (!confirmPassword) {
      setError("Confirm Password is required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match.");
      return;
    }

    setError("");

    try {
      // Call the backend endpoint to reset password (no OTP needed here now)
      const response = await axiosInstance.post("/reset-password", {
        email: email, // Send email to identify the user
        newPassword: newPassword,
      });

      if (response.data && !response.data.error) {
        showToastMessage(
          response.data.message || "Password reset successfully!",
          "success"
        );
        navigate("/login"); // Redirect to login after successful reset
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

  if (!email) {
    return null; // Or a loading spinner, or redirect
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-96 border rounded bg-white px-7 py-10 shadow-md">
          <form onSubmit={handleResetPassword}>
            <h4 className="text-2xl text-center mb-7">Set New Password</h4>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Reset Password
            </button>

            <p className="text-sm text-center mt-4">
              Back to{" "}
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

export default ResetPassword;
