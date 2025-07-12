import { LuCheck } from "react-icons/lu";
import PropTypes from "prop-types";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect } from "react";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose, isShown]);
  return (
    <div
      className={`absolute top-20 right-6 transition-all duration-300 ease-in-out ${
        isShown ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`
          relative min-w-52 bg-white rounded-md shadow-lg
          after:content-[''] after:w-1 after:h-full after:absolute after:top-0 after:left-0 after:rounded-l-md
          ${type === "delete" ? "after:bg-red-500" : "after:bg-green-500"}
        `}
      >
        <div className="flex items-center gap-3 py-2 px-4 rounded-lg bg-white">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              type === "delete"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500 " />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>
          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

Toast.propTypes = {
  isShown: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "delete"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;
