import { useState } from "react";
import { ProfileInfo } from "../Cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import useLocation
import { SearchBar } from "../SearchBar/SearchBar";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  console.log("Current Path:", location.pathname); // ✅ Debugging log

  const onLogout = () => {
    navigate("/Login");
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  // ✅ Ensure pathname check is case-insensitive
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(location.pathname.toLowerCase());

  return (
    <div className="bg-yell flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl text-white font-medium py-2">Notes</h2>

      {!isAuthPage && ( // ✅ Hide SearchBar & ProfileInfo on login/signup pages
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo onLogout={onLogout} />
        </>
      )}
    </div>
  );
};
