// Navbar.jsx
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileInfo } from "../Profile/ProfileInfo";
import { SearchBar } from "../SearchBar/SearchBar";

/**
 * Navbar component displayed on all pages except auth pages.
 * Contains title, search bar, and profile info.
 */
export const Navbar = ({ userInfo, searchQuery, setSearchQuery, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pages where Navbar should be hidden
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(location.pathname.toLowerCase());

  // Clear local storage and navigate to login
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const onClearSearch = () => setSearchQuery("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Could call an API or filter locally here
  };

  return (
    <div className="bg-yell flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl text-white font-medium py-2">Notes</h2>

      {!isAuthPage && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClearSearch={onClearSearch}
            handleSearch={handleSearch}
          />
          <ProfileInfo
            userInfo={userInfo}
            setUser={setUser}
            onLogout={onLogout}
          />
        </>
      )}
    </div>
  );
};

Navbar.propTypes = {
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};
