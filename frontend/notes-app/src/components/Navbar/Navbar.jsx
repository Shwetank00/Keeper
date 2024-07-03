import React, { useState } from "react";
import { ProfileInfo } from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate;

  const onLogout = () => {
    navigate("/Login");
  };
  const handleSearch = () => {};
  const onClearSearch = () => {
    setSearchQuery("");
  };
  return (
    <div className="bg-yellow-500 flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium py-2">Notes</h2>
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      ></SearchBar>
      <ProfileInfo onLogout={onLogout}></ProfileInfo>
    </div>
  );
};
