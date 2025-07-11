import PropTypes from "prop-types";
import { getInitials } from "../../utils/helper";

// ProfileInfo component displays user initials, name, and logout option
export const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {/* User initials inside a rounded avatar */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo.fullname)}
      </div>

      {/* User name and logout button */}
      <div>
        <p className="text-sm text-slate-950 font-medium">
          {userInfo.fullname}
        </p>
        <button className="text-sm text-slate-950 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

// ✅ Correct PropTypes
ProfileInfo.propTypes = {
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};
