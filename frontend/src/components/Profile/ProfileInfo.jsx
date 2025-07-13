import { useState } from "react";
import PropTypes from "prop-types";
import { getInitials } from "../../utils/helper";
import { ProfileMenu } from "./ProfileMenu";

/**
 * ProfileInfo shows user initials and name; subtle hover effect to look clickable.
 */
export const ProfileInfo = ({ userInfo, setUser, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const closeMenu = () => setShowMenu(false);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="
          flex items-center gap-3 focus:outline-none
          cursor-pointer
        "
      >
        {/* Initials circle with subtle hover */}
        <div
          className="
          w-10 h-10 flex items-center justify-center rounded-full font-medium
          bg-slate-100 text-slate-950
          hover:bg-slate-200 transition-smooth
        "
        >
          {getInitials(userInfo.fullname)}
        </div>

        {/* Name with underline always visible + slight color change on hover */}
        <p
          className="
          text-sm font-medium text-slate-950 border-b border-slate-950 
          hover:text-slate-800 hover:border-slate-800 transition-colors duration-150
        "
        >
          {userInfo.fullname}
        </p>
      </button>

      {showMenu && (
        <ProfileMenu
          userInfo={userInfo}
          onClose={closeMenu}
          onLogout={onLogout}
          onProfileUpdated={(updatedUser) => setUser(updatedUser)}
          onShowToast={(msg, type) => console.log(msg, type)} // replace with actual toast
        />
      )}
    </div>
  );
};

ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};
