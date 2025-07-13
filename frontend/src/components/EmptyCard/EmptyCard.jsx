import PropTypes from "prop-types";
import addNoteImage from "../../assets/add-note.png"; // adjust path as needed

export const EmptyCard = ({ onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-16">
      <button onClick={onAdd} className="hover:scale-105 transition-transform">
        <img src={addNoteImage} alt="Add Note" className="w-48 h-48 mb-4" />
      </button>
      <p className="text-gray-500 text-sm">
        Click the button above to add your first note!
      </p>
    </div>
  );
};

EmptyCard.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default EmptyCard;
