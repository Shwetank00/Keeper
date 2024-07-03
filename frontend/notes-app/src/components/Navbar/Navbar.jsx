import React, { useState } from "react";
import { ProfileInfo } from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";

// This is the Navbar component. It is a functional component.
export const Navbar = () => {
  // useState hook is used to create a state variable called searchQuery and a function to update it.
  // The initial value of searchQuery is an empty string.
  const [searchQuery, setSearchQuery] = useState("");
  // useNavigate hook is used to get the navigate function which is used to navigate to different routes.
  const navigate = useNavigate;

  // This function is called when the user logs out. It navigates the user to the login page.
  const onLogout = () => {
    navigate("/Login");
  };
  // This is an empty function which is intended to be used for search functionality.
  const handleSearch = () => {};
  // This function clears the search query by setting it to an empty string.
  const onClearSearch = () => {
    setSearchQuery("");
  };

  // The JSX code that gets rendered by this component is wrapped inside a div with a class name of "bg-yellow-500".
  return (
    <div className="bg-yellow-500 flex items-center justify-between px-6 py-2 drop-shadow">
      {/* This is a heading element with a class name of "text-xl font-medium py-2". It displays the text "Notes". */}
      <h2 className="text-xl font-medium py-2">Notes</h2>
      {/* This is an instance of the SearchBar component. It receives the searchQuery state variable, the setSearchQuery function to update it and the handleSearch and onClearSearch functions as props. */}
      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      ></SearchBar>
      {/* This is an instance of the ProfileInfo component. It receives the onLogout function as a prop. */}
      <ProfileInfo onLogout={onLogout}></ProfileInfo>
    </div>
  );
};
