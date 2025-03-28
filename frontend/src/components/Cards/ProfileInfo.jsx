import PropTypes from "prop-types";
import { getInitials } from "../../utils/helper";

// ProfileInfo component displays user initials, name, and logout option
export const ProfileInfo = ({ username, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {/* User initials inside a rounded avatar */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(username)}
      </div>

      {/* User name and logout button */}
      <div>
        <p className="text-sm text-slate-950 font-medium">{username}</p>
        <button className="text-sm text-slate-950 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Define PropTypes for type checking
ProfileInfo.propTypes = {
  username: PropTypes.string.isRequired, // Username must be a string
  onLogout: PropTypes.func.isRequired, // onLogout must be a function
};

// Default props (optional)
ProfileInfo.defaultProps = {
  username: "User",
};
