import React from "react";
import { getInitials } from "../../utils/helper";

// Define a functional component named ProfileInfo
export const ProfileInfo = ({ onLogout }) => {
  // Render a div with two child elements
  return (
    <div className="flex items-center gap-3">
      {/* Render a div that displays the initials of the user's name */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials("Shwetank jain")}
      </div>
      {/* Render a div that displays the user's name and a logout button */}
      <div>
        <p className="text-sm text-slate-950 font-medium">Shwetank00</p>
        {/* Render a button that calls the onLogout function when clicked */}
        <button className="text-sm text-slate-950 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

