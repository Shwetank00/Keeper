import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { NoteCard } from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import { AddEditNotes } from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstanse";

export const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [notes, setNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // ✅ CHANGED: useEffect must be at top-level, outside any function
  useEffect(() => {
    getUserInfo();
    fetchNotes(); // ✅ NEW: fetch notes on component mount
  }, []);

  // ✅ Function to get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear(); // ✅ Clear token if unauthorized
        navigate("/login");
      }
    }
  };

  // ✅ NEW: Function to fetch notes from backend
  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes");
      if (response.data?.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // ✅ Function to add a new note
  const handleAddNote = (newNote) => {
    const noteWithId = { ...newNote, id: Date.now(), isPinned: false };
    setNotes([...notes, noteWithId]);
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  // ✅ Function to edit a note
  const handleEditNote = (updatedNote) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  // ✅ Function to delete a note
  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // ✅ Function to pin/unpin a note
  const handlePinNote = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  return (
    <>
      {userInfo ? (
        <>
          <Navbar userInfo={userInfo} />
          {/* rest of the Home page */}
          <div className="container mx-auto">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No notes available. Click + to add one!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4 mt-8">
                {notes
                  .sort((a, b) => b.isPinned - a.isPinned)
                  .map((note) => (
                    <NoteCard
                      key={note.id}
                      title={note.title}
                      date={note.date}
                      content={note.content}
                      tags={note.tags}
                      isPinned={note.isPinned}
                      onEdit={() =>
                        setOpenAddEditModal({
                          isShown: true,
                          type: "edit",
                          data: note,
                        })
                      }
                      onDelete={() => handleDeleteNote(note.id)}
                      onPinNote={() => handlePinNote(note.id)}
                    />
                  ))}
              </div>
            )}
          </div>

          <button
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
            onClick={() =>
              setOpenAddEditModal({ isShown: true, type: "add", data: null })
            }
          >
            <MdAdd className="text-[32px] text-white" />
          </button>

          <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() =>
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }
            style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
            className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
          >
            <AddEditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={() =>
                setOpenAddEditModal({ isShown: false, type: "add", data: null })
              }
              onSave={
                openAddEditModal.type === "edit"
                  ? handleEditNote
                  : handleAddNote
              }
            />
          </Modal>
        </>
      ) : (
        <p className="text-center mt-10 text-gray-500">Loading...</p>
      )}
    </>
  );
};
