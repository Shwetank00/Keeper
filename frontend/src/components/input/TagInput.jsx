import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

// This is a functional component that renders a tag input field.
// It takes two props: tags and setTags.
// Tags is an array of strings that represent the current list of tags.
// setTags is a function that is used to update the list of tags.
export const TagInput = ({ tags, setTags }) => {
  // State variable to store the input value.
  const [inputValue, setInputValue] = useState("");

  // Function to handle input value changes.
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to add a new tag when the enter key is pressed.
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  // Function to handle key down events.
  const handelKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  // Function to handle tag removal.
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {/* Render the list of tags */}
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
            >
              #{tag}
              <button
                onClick={() => {
                  handleRemoveTag(tag);
                }}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Render the tag input field */}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add tags"
          onChange={handleInputChange}
          onKeyDown={handelKeyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700"
          onClick={() => {
            addNewTag();
          }}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white"></MdAdd>
        </button>
      </div>
    </div>
  );
};

