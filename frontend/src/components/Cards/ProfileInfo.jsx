import { useState } from "react";
import PropTypes from "prop-types";
import { getInitials } from "../../utils/helper";
import { ProfileMenu } from "./ProfileMenu";

export const ProfileInfo = ({ userInfo, onLogout, refetchUserInfo }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  return (
    <div className="relative">
      {/* Avatar + name as dropdown toggle */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-3 focus:outline-none"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getInitials(userInfo.fullname)}
        </div>
        <p className="text-sm text-slate-950 font-medium">
          {userInfo.fullname}
        </p>
        <svg
          className={`w-4 h-4 transform ${showMenu ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Profile dropdown menu */}
      {showMenu && (
        <ProfileMenu
          userInfo={userInfo}
          onClose={closeMenu}
          onLogout={onLogout}
          refetchUserInfo={refetchUserInfo}
        />
      )}
    </div>
  );
};

ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string, // optional
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  refetchUserInfo: PropTypes.func, // optional, useful after verifying OTP
};
