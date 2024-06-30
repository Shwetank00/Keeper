import React from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

// PasswordInput component takes in value, onChange, and placeholder props as input. 
// It uses useState to handle the state of the password visibility
export const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false); // State to handle visibility of password

  // Function to toggle visibility of password
  const toggleShowPassword = () => setIsShowPassword(!isShowPassword); 

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        value={value} // Value of input
        onChange={onChange} // Function to handle input change
        type={isShowPassword ? "text" : "password"} // Type of input is changed based on visibility state
        placeholder={placeholder || "Password"} // Placeholder for input
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none" // Styling for input
      />
      {isShowPassword ? ( // Render eye icon to show password when visible
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={toggleShowPassword}
        />
      ) : ( // Render eye-slash icon to hide password when not visible
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

