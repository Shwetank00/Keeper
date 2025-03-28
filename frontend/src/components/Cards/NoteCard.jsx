import PropTypes from "prop-types";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

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
  console.log("NoteCard rendered:", title, date, content, tags); // Debugging log

  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      {/* Title & Date */}
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-slate-500">{date}</span>
        </div>
        {/* Pin Button */}
        <MdOutlinePushPin
          className={`icon-btn cursor-pointer ${
            isPinned ? "text-primary" : "text-slate-300"
          }`}
          onClick={onPinNote}
          aria-label={isPinned ? "Unpin note" : "Pin note"}
        />
      </div>

      {/* Note Content */}
      <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 60)}...</p>

      {/* Tags & Actions */}
      <div className="flex items-center justify-between mt-2">
        {/* Render tags properly */}
        <div className="flex gap-1 text-xs text-slate-500">
          {tags.map((tag, index) => (
            <span key={index} className="bg-slate-100 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Button */}
          <MdCreate
            className="icon-btn cursor-pointer hover:text-green-600"
            onClick={onEdit}
            aria-label="Edit note"
          />
          {/* Delete Button */}
          <MdDelete
            className="icon-btn cursor-pointer hover:text-red-500"
            onClick={onDelete}
            aria-label="Delete note"
          />
        </div>
      </div>
    </div>
  );
};

NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  isPinned: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPinNote: PropTypes.func.isRequired,
};

NoteCard.defaultProps = {
  tags: [],
};

export default NoteCard;
