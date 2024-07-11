import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

// NoteCard component displays a single note card with the title, date, content, tags, and options to edit and delete the note.
// It receives the following props:
// - title: the title of the note
// - date: the date the note was created
// - content: the content of the note
// - tags: the tags associated with the note
// - isPinned: a boolean indicating if the note is pinned
// - onEdit: a function to call when the edit button is clicked
// - onDelete: a function to call when the delete button is clicked
// - onPinNote: a function to call when the pin button is clicked
export const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      {/* Display the title and date of the note */}
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        {/* Display a pin button and call onPinNote when clicked */}
        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        ></MdOutlinePushPin>
      </div>
      {/* Display the first 60 characters of the content of the note */}
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}</p>

      {/* Display the tags associated with the note and the edit and delete buttons */}
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">{tags}</div>
        <div className="flex items-center gap-2">
          {/* Display an edit button and call onEdit when clicked */}
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          ></MdCreate>
          {/* Display a delete button and call onDelete when clicked */}
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          ></MdDelete>
        </div>
      </div>
    </div>
  );
};

