import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Keep useLocation if you want specific page-based logic inside Navbar, or remove if not needed
import { ProfileInfo } from "../Profile/ProfileInfo";
import { SearchBar } from "../SearchBar/SearchBar";

/**
 * Navbar component displayed on all pages.
 * Conditionally displays search bar and profile info based on whether relevant props are provided.
 */
export const Navbar = ({ userInfo, searchQuery, setSearchQuery, setUser }) => {
  const navigate = useNavigate();
  // const location = useLocation(); // Uncomment if you need page-specific logic here, otherwise can remove

  // Remove the authPages and isAuthPage logic, as Navbar will always render its base structure
  // const authPages = ["/login", "/signup"];
  // const isAuthPage = authPages.includes(location.pathname.toLowerCase());

  // Clear local storage and navigate to login
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const onClearSearch = () => {
    // Only execute if setSearchQuery function is provided
    if (setSearchQuery) {
      setSearchQuery("");
    }
  };

  const handleSearch = () => {
    // Only execute if searchQuery is provided
    if (searchQuery) {
      console.log("Searching for:", searchQuery);
    }
    // You can implement your search logic here, or pass it from parent (e.g., Home)
  };

  return (
    // The base Navbar div always renders
    <div className="bg-yell flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl text-white font-medium py-2">Notes</h2>

      {/* Conditionally render SearchBar ONLY if search-related props are provided */}
      {searchQuery !== undefined &&
        setSearchQuery !== undefined && ( // Check if both are present
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClearSearch={onClearSearch}
            handleSearch={handleSearch}
          />
        )}

      {/* Conditionally render ProfileInfo ONLY if user-related props are provided */}
      {userInfo !== undefined &&
        setUser !== undefined && ( // Check if both are present
          <ProfileInfo
            userInfo={userInfo}
            setUser={setUser} // Pass setUser prop
            onLogout={onLogout}
          />
        )}
    </div>
  );
};

Navbar.propTypes = {
  // Make these props OPTIONAL by removing .isRequired
  userInfo: PropTypes.shape({
    fullname: PropTypes.string.isRequired, // fullname is still required if userInfo is provided
    email: PropTypes.string,
  }), // Removed .isRequired
  searchQuery: PropTypes.string, // Removed .isRequired
  setSearchQuery: PropTypes.func, // Removed .isRequired
  setUser: PropTypes.func, // Removed .isRequired
  // If refetchUserInfo is a prop used by Navbar (e.g. from Home), it should also be optional here
};
