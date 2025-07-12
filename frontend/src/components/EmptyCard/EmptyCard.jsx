import PropTypes from "prop-types";
import addNoteImage from "../../assets/add-note.png"; // adjust path if needed

export const EmptyCard = ({ onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <button onClick={onAdd} className="hover:scale-105 transition-transform">
        <img
          src={addNoteImage}
          alt="Add Note"
          className="w-48 h-48 mb-4" // bigger icon: 12rem x 12rem
        />
      </button>
      <p className="text-gray-500 text-base">
        Click above to add your first note!
      </p>
    </div>
  );
};

EmptyCard.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default EmptyCard;
