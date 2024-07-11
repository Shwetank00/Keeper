import React, { useState } from "react";
import { TagInput } from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";


export const AddEditNotes = ({ noteData, type, onClose }) => {
  // State for title
  const [title, setTitle] = useState("");
  // State for content
  const [content, setContent] = useState("");
  // State for tags
  const [tags, setTags] = useState([]);
  // State for error message
  const [error, setError] = useState(null);

  /**
   * Function to add a new note.
   */
  const addNewNote = async () => {};

  /**
   * Function to edit a note.
   */
  const editNote = async () => {};

  /**
   * Function to handle the addition of a note.
   */
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      {/* Button to close the modal */}
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400"></MdClose>
      </button>

      {/* Title input */}
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to gym at 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      {/* Content textarea */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      {/* Tags input */}
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags}></TagInput>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      {/* Add button */}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        ADD
      </button>
    </div>
  );
};

