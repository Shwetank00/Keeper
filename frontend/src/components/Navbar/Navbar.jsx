import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileInfo } from "../Cards/ProfileInfo";
import { SearchBar } from "../SearchBar/SearchBar";

export const Navbar = ({ userInfo, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current page is login/signup
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(location.pathname.toLowerCase());

  // Handle logout
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Clear search query
  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-yell flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl text-white font-medium py-2">Notes</h2>

      {!isAuthPage && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

// ✅ PropTypes validation
Navbar.propTypes = {
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
};
