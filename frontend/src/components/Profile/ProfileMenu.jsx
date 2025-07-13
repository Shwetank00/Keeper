// ProfileMenu.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../utils/axiosInstanse";
import { EnterOTP } from "../OTP/EnterOTP";

/**
 * ProfileMenu allows editing user profile and handles email OTP verification.
 */
export const ProfileMenu = ({
  userInfo,
  onClose,
  onLogout,
  onProfileUpdated,
  onShowToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userInfo.fullname || "");
  const [editedEmail, setEditedEmail] = useState(userInfo.email || "");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const handleSave = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      onShowToast("Name and email are required!", "delete");
      return;
    }

    try {
      const { data } = await axiosInstance.put("/update-profile", {
        fullname: editedName.trim(),
        email: editedEmail.trim(),
      });

      if (data.otpSent) {
        setShowOtpModal(true);
      } else {
        setIsEditing(false);
        onProfileUpdated({
          fullname: editedName.trim(),
          email: editedEmail.trim(),
        });
        onShowToast("Profile updated successfully!", "success");
        onClose();
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      onShowToast("Failed to update profile", "delete");
    }
  };

  const handleVerifyOtp = async (otp) => {
    setLoading(true);
    setOtpError("");
    try {
      const { data } = await axiosInstance.post("/verify-email-otp", { otp });
      if (!data.error) {
        setShowOtpModal(false);
        setIsEditing(false);
        onProfileUpdated({
          fullname: editedName.trim(),
          email: editedEmail.trim(),
        });
        onShowToast("Email verified successfully!", "success");
        onClose();
      } else {
        setOtpError(data.message || "Invalid OTP");
        onShowToast("Invalid OTP", "delete");
      }
    } catch (err) {
      console.error("Verify OTP failed:", err);
      setOtpError("Failed to verify OTP. Try again.");
      onShowToast("Failed to verify OTP", "delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg p-4 z-20"
      aria-label="Profile menu"
    >
      {isEditing ? (
        <>
          <input
            className="input-box mb-2"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Full name"
          />
          <input
            className="input-box mb-2"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            placeholder="Email"
          />
          <div className="flex justify-between">
            <button
              className="btn-secondary text-xs px-2 py-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary text-xs px-2 py-1"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-medium mb-1">{userInfo.fullname}</p>
          {userInfo.email && (
            <p className="text-xs text-gray-500 mb-3 break-all">
              {userInfo.email}
            </p>
          )}
          <div className="flex justify-between">
            <button
              className="text-primary text-xs underline"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button
              className="text-red-500 text-xs underline"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}

      {showOtpModal && (
        <EnterOTP
          onSubmit={handleVerifyOtp}
          loading={loading}
          error={otpError}
        />
      )}
    </div>
  );
};

ProfileMenu.propTypes = {
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onProfileUpdated: PropTypes.func.isRequired,
  onShowToast: PropTypes.func.isRequired,
};
