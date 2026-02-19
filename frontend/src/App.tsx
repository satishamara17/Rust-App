import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getNotesFn } from "./api/noteApi";
import NoteModal from "./components/note.modal";
import CreateNote from "./components/notes/create.note";
import NoteItem from "./components/notes/note.component";
import NProgress from "nprogress";

function AppContent() {
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const {
    data: notes,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["getNotes"],
    queryFn: () => getNotesFn(),
    staleTime: 5 * 1000,
    select: (data) => data.notes,
    onSuccess() {
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
      NProgress.done();
    },
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    }
  }, [isLoading, isFetching]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-glass-border"
        style={{
          background: 'rgba(15, 15, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <i className="bx bx-notepad text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                NoteVault
              </h1>
              <p className="text-xs text-[#6b6b85] -mt-0.5">Personal Notes</p>
            </div>
          </div>
          <button
            onClick={() => setOpenNoteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.25)'
            }}
          >
            <i className="bx bx-plus text-lg"></i>
            New Note
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="2xl:max-w-[90rem] max-w-[68rem] mx-auto px-8 py-8">
        {/* Stats Bar */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-glass-border"
            style={{ background: 'rgba(30, 30, 50, 0.5)' }}
          >
            <i className="bx bx-collection text-ct-blue-600"></i>
            <span className="text-sm text-[#a0a0b8]">
              {notes?.length || 0} {notes?.length === 1 ? 'note' : 'notes'}
            </span>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-5">
          {/* Add Note Card */}
          <div
            onClick={() => setOpenNoteModal(true)}
            className="group min-h-[14rem] rounded-2xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-ct-blue-600"
            style={{ background: 'rgba(30, 30, 50, 0.3)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '2px dashed rgba(168, 85, 247, 0.3)',
              }}
            >
              <i className="bx bx-plus text-3xl text-ct-blue-600"></i>
            </div>
            <h4 className="text-sm font-semibold text-[#6b6b85] group-hover:text-ct-blue-600 transition-colors duration-300">
              Create new note
            </h4>
            <p className="text-xs text-[#4a4a60] mt-1">Click to get started</p>
          </div>

          {/* Note Items with staggered animation */}
          {notes?.map((note, index) => (
            <div
              key={note.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
            >
              <NoteItem note={note} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(168, 85, 247, 0.1)' }}
            >
              <i className="bx bx-notepad text-4xl text-ct-blue-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notes yet</h3>
            <p className="text-[#6b6b85] text-sm mb-6">Create your first note to get started</p>
            <button
              onClick={() => setOpenNoteModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.25)'
              }}
            >
              <i className="bx bx-plus text-lg"></i>
              Create Note
            </button>
          </div>
        )}
      </main>

      {/* Create Note Modal */}
      <NoteModal
        openNoteModal={openNoteModal}
        setOpenNoteModal={setOpenNoteModal}
      >
        <CreateNote setOpenNoteModal={setOpenNoteModal} />
      </NoteModal>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
