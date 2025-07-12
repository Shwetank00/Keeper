import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { MdAdd } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstanse";
import { Navbar } from "../../components/Navbar/Navbar";
import { NoteCard } from "../../components/Cards/NoteCard";
import { AddEditNotes } from "./AddEditNotes";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

export const Home = () => {
  // State: modal open/close and mode (add/edit)
  const [modalState, setModalState] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // State: toast notification
  const [toast, setToast] = useState({
    isShown: false,
    message: "",
    type: "success",
  });

  // State: user data and notes list
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  // State: loading indicator
  const [loading, setLoading] = useState(true);

  // State: search query text
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ isShown: true, message, type });
  };

  // Close toast message
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isShown: false }));
  };

  // Fetch user and notes on initial mount
  useEffect(() => {
    const init = async () => {
      try {
        await fetchUser();
        await fetchNotes();
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/get-user");
      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        navigate("/login");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Fetch all notes for the user
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/get-all-notes");
      setNotes(res.data?.notes || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err.response?.data || err);
    }
  };

  // Add a new note
  const addNote = async (newNote) => {
    try {
      const res = await axiosInstance.post("/add-note", newNote);
      if (res.data?.note) {
        setNotes((prev) => [...prev, res.data.note]);
        showToast("Note added successfully", "success");
      }
      closeModal();
    } catch (err) {
      console.error("Failed to add note:", err.response?.data || err);
      showToast("Failed to add note", "delete");
    }
  };

  // Edit an existing note
  const editNote = async (updatedNote) => {
    try {
      const res = await axiosInstance.put(
        `/edit-note/${updatedNote._id}`,
        updatedNote
      );
      if (res.data?.note) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === updatedNote._id ? res.data.note : note
          )
        );
        showToast("Note updated successfully", "success");
      }
      closeModal();
    } catch (err) {
      console.error("Failed to edit note:", err.response?.data || err);
      showToast("Failed to update note", "delete");
    }
  };

  // Delete a note by ID
  const deleteNote = async (id) => {
    try {
      await axiosInstance.delete(`/delete-note/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      showToast("Note deleted successfully", "delete");
    } catch (err) {
      console.error("Failed to delete note:", err.response?.data || err);
      showToast("Failed to delete note", "delete");
    }
  };

  // Toggle pin/unpin for a note
  const togglePin = async (id) => {
    try {
      const targetNote = notes.find((note) => note._id === id);
      if (!targetNote) return;

      const res = await axiosInstance.put(`/update-note-pinned/${id}`, {
        isPinned: !targetNote.isPinned,
      });

      if (res.data?.note) {
        setNotes((prev) =>
          prev.map((note) => (note._id === id ? res.data.note : note))
        );
        showToast(
          res.data.note.isPinned ? "Note pinned" : "Note unpinned",
          "success"
        );
      }
    } catch (err) {
      console.error("Failed to pin/unpin note:", err.response?.data || err);
      showToast("Failed to pin/unpin note", "delete");
    }
  };

  // Close modal and reset modal state
  const closeModal = () => {
    setModalState({ isShown: false, type: "add", data: null });
  };

  // Filter and sort notes based on search query & pinned status
  const filteredNotes = notes
    .filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  // Custom styles for modal
  const modalStyles = {
    overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
    content: {
      maxWidth: "40%",
      maxHeight: "75%",
      margin: "3.5rem auto",
      padding: "1.25rem",
      overflow: "auto",
      borderRadius: "0.375rem",
    },
  };

  return (
    <>
      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      ) : user ? (
        <>
          {/* Navbar at top */}
          <Navbar
            userInfo={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* List of notes or empty card */}
          <div className="container mx-auto">
            {filteredNotes.length === 0 ? (
              <EmptyCard
                onAdd={() =>
                  setModalState({ isShown: true, type: "add", data: null })
                }
              />
            ) : (
              <div className="grid grid-cols-3 gap-4 mt-8">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    title={note.title}
                    content={note.content}
                    date={note.createdOn}
                    tags={note.tags}
                    isPinned={note.isPinned}
                    onEdit={() =>
                      setModalState({ isShown: true, type: "edit", data: note })
                    }
                    onDelete={() => deleteNote(note._id)}
                    onPinNote={() => togglePin(note._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Floating add button */}
          <button
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
            onClick={() =>
              setModalState({ isShown: true, type: "add", data: null })
            }
          >
            <MdAdd className="text-[32px] text-white" />
          </button>

          {/* Add/Edit modal */}
          <Modal
            isOpen={modalState.isShown}
            onRequestClose={closeModal}
            style={modalStyles}
          >
            <AddEditNotes
              type={modalState.type}
              noteData={modalState.data}
              onClose={closeModal}
              onSave={modalState.type === "edit" ? editNote : addNote}
              showToast={showToast}
            />
          </Modal>

          {/* Toast message */}
          <Toast
            isShown={toast.isShown}
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        </>
      ) : (
        <p className="text-center mt-10 text-gray-500">
          Unauthorized. Redirecting...
        </p>
      )}
    </>
  );
};
