import PropTypes from "prop-types";
import { useState } from "react";
import { TagInput } from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";

export const AddEditNotes = ({ noteData, type, onClose, onSave }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Function to handle note submission
  const handleSubmit = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    const newNote = {
      id: noteData?.id || Date.now(),
      title,
      content,
      tags,
      isPinned: false,
    };
    onSave(newNote); // Call the save function from parent
    onClose(); // Close the modal
  };

  return (
    <div className="relative">
      {/* Close button */}
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
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

      {/* Content input */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
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
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Add button */}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleSubmit}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

// Define PropTypes
AddEditNotes.propTypes = {
  noteData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  type: PropTypes.oneOf(["add", "edit"]).isRequired, // Must be either "add" or "edit"
  onClose: PropTypes.func.isRequired, // Function to close the modal
  onSave: PropTypes.func.isRequired, // Function to save the note
};

// Default props (if noteData is not provided)
AddEditNotes.defaultProps = {
  noteData: {
    title: "",
    content: "",
    tags: [],
  },
};

export default AddEditNotes;
