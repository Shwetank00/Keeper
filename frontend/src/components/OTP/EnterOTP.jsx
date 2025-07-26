import { useState, useRef } from "react";
import PropTypes from "prop-types"; // Make sure PropTypes is imported

// This component is now generic, so remove internal logic for API calls/navigation
export const EnterOTP = ({ onSubmit, loading, error }) => {
  // Back to receiving props
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    // Only call onSubmit if OTP is complete
    if (otp.length === 6) onSubmit(otp);
  };

  return (
    // Removed Navbar and outer div for centering - this is just the input part
    <form onSubmit={handleSubmit} noValidate>
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
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};

// Re-add PropTypes now that it's a generic component
EnterOTP.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

// Ensure it's exported as a named export if SignUp.jsx uses { EnterOTP }
// Or as default if SignUp.jsx uses import EnterOTP from ...
// Your App.jsx uses import { EnterOTP } from..., so keep it named
// export const EnterOTP = ... (as it was originally) or:
// export default EnterOTP; // if you prefer default, then App.jsx import needs to be adjusted
