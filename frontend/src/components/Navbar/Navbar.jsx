import { useState } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { ProfileInfo } from "../Cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";

export const Navbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Current Path:", location.pathname);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // TODO: Implement search functionality
  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(location.pathname.toLowerCase());

  return (
    <div className="bg-yell flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl text-white font-medium py-2">Notes</h2>

      {!isAuthPage && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </>
      )}
    </div>
  );
};

// ✅ Add prop-types validation at the end to fix ESLint warning
Navbar.propTypes = {
  userInfo: PropTypes.object,
};
