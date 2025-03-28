import PropTypes from "prop-types"; // Import PropTypes
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-full">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-slate-100 rounded-full py-2 px-3 outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <button onClick={onClearSearch} aria-label="Clear Search">
          <IoMdClose className="text-xl text-slate-400 cursor-pointer hover:text-black mr-3" />
        </button>
      )}
      <button
        onClick={() => value && handleSearch()}
        aria-label="Search Notes"
        disabled={!value}
      >
        <FaMagnifyingGlass
          className={`text-slate-400 cursor-pointer hover:text-black ${
            !value && "opacity-50 cursor-not-allowed"
          }`}
        />
      </button>
    </div>
  );
};
SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default SearchBar;
