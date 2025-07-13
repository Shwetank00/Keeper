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
  // State: user info & notes
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  // State: modal for add/edit notes
  const [modalState, setModalState] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // State: toast message
  const [toast, setToast] = useState({
    isShown: false,
    message: "",
    type: "success",
  });

  // Loading indicator
  const [loading, setLoading] = useState(true);

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({ isShown: true, message, type });
  };

  // Hide toast
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isShown: false }));
  };

  // Fetch user + notes on mount
  useEffect(() => {
    const init = async () => {
      try {
        await fetchUser();
        await fetchNotes();
      } catch (err) {
        console.error("Init failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch logged-in user
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

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get("/get-all-notes");
      setNotes(res.data?.notes || []);
    } catch (err) {
      console.error("Fetch notes failed:", err.response?.data || err);
    }
  };

  // Refetch user info — e.g. after profile OTP verified
  const refetchUserInfo = fetchUser;

  // Add new note
  const addNote = async (newNote) => {
    try {
      const res = await axiosInstance.post("/add-note", newNote);
      if (res.data?.note) {
        setNotes((prev) => [...prev, res.data.note]);
        showToast("Note added successfully", "success");
      }
      closeModal();
    } catch (err) {
      console.error("Add note failed:", err.response?.data || err);
      showToast("Failed to add note", "delete");
    }
  };

  // Edit note
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
      console.error("Edit note failed:", err.response?.data || err);
      showToast("Failed to update note", "delete");
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axiosInstance.delete(`/delete-note/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      showToast("Note deleted", "delete");
    } catch (err) {
      console.error("Delete note failed:", err.response?.data || err);
      showToast("Failed to delete note", "delete");
    }
  };

  // Toggle pin
  const togglePin = async (id) => {
    try {
      const target = notes.find((note) => note._id === id);
      if (!target) return;

      const res = await axiosInstance.put(`/update-note-pinned/${id}`, {
        isPinned: !target.isPinned,
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
      console.error("Toggle pin failed:", err.response?.data || err);
      showToast("Failed to pin/unpin note", "delete");
    }
  };

  // Close modal
  const closeModal = () => {
    setModalState({ isShown: false, type: "add", data: null });
  };

  // Filter + sort notes
  const filteredNotes = notes
    .filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  // Modal styles
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
          <Navbar
            userInfo={user}
            setUser={setUser}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            refetchUserInfo={refetchUserInfo}
          />

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

          {/* Toast */}
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
