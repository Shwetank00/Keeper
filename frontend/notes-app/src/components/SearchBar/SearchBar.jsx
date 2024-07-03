import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

// This is a functional component that renders a search bar.
// It takes in four props:
// - value: the current value of the search input
// - onChange: a function to handle changes to the search input
// - handleSearch: a function to handle the search button click
// - onClearSearch: a function to clear the search input
export const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    // The search bar is wrapped inside a div with a class for styling.
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-full ">
      {/* The search input is an input element with a class for styling. */}
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-slate-100 rounded-full  py-[11px] outline-none"
        value={value} // The value of the input is set to the value prop
        onChange={onChange} // The onChange function is called when the input changes
      />
      {/* If there is a value in the search input, render a close icon. */}
      {value && (
        <IoMdClose
          className="text-xl text-slate-400 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch} // The onClick function is called when the close icon is clicked
        ></IoMdClose>
      )}
      {/* Render a magnifying glass icon. */}
      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch} // The onClick function is called when the magnifying glass icon is clicked
      ></FaMagnifyingGlass>
    </div>
  );
};

