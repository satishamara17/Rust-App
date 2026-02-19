import React, { FC, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import NoteModal from "../note.modal";
import UpdateNote from "./update.note";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";
import { INote } from "../../api/types";
import { deleteNoteFn } from "../../api/noteApi";

type NoteItemProps = {
  note: INote;
};

const NoteItem: FC<NoteItemProps> = ({ note }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(`settings-dropdown-${note.id}`);

      if (dropdown && !dropdown.contains(target)) {
        setOpenSettings(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [note.id]);

  const queryClient = useQueryClient();
  const { mutate: deleteNote } = useMutation({
    mutationFn: (noteId: string) => deleteNoteFn(noteId),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries(["getNotes"]);
      toast("Note deleted successfully", {
        type: "warning",
        position: "top-right",
      });
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

  const onDeleteHandler = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(noteId);
    }
  };

  return (
    <>
      <div
        className="group relative p-5 rounded-2xl border border-glass-border flex flex-col justify-between min-h-[14rem] transition-all duration-300 hover:border-glass-border-hover hover:scale-[1.01]"
        style={{
          background: 'rgba(30, 30, 50, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(168, 85, 247, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Content */}
        <div className="flex-1 mb-4">
          <h4 className="mb-3 text-lg font-semibold tracking-tight text-white leading-snug">
            {note.title.length > 40
              ? note.title.substring(0, 40) + "..."
              : note.title}
          </h4>
          <p className="text-sm leading-relaxed text-[#a0a0b8]">
            {note.content.length > 180
              ? note.content.substring(0, 180) + "..."
              : note.content}
          </p>
        </div>

        {/* Footer */}
        <div className="relative flex justify-between items-center pt-4 border-t border-glass-border">
          <div className="flex items-center gap-2">
            <i className="bx bx-time-five text-xs text-[#6b6b85]"></i>
            <span className="text-[#6b6b85] text-xs font-medium">
              {format(parseISO(String(note.createdAt)), "PPP")}
            </span>
          </div>

          {/* Actions menu button */}
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-glass-bg text-[#6b6b85] hover:text-white"
          >
            <i className="bx bx-dots-horizontal-rounded text-lg"></i>
          </div>

          {/* Dropdown menu */}
          <div
            id={`settings-dropdown-${note.id}`}
            className={twMerge(
              `absolute right-0 bottom-10 z-10 w-36 rounded-xl border border-glass-border overflow-hidden transition-all duration-200`,
              `${openSettings ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`
            )}
            style={{
              background: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <ul className="py-1">
              <li
                onClick={() => {
                  setOpenSettings(false);
                  setOpenNoteModal(true);
                }}
                className="py-2.5 px-4 text-sm text-[#a0a0b8] hover:text-white hover:bg-[rgba(168,85,247,0.1)] cursor-pointer flex items-center gap-2.5 transition-colors duration-150"
              >
                <i className="bx bx-pencil text-base"></i> Edit
              </li>
              <li
                onClick={() => {
                  setOpenSettings(false);
                  onDeleteHandler(note.id);
                }}
                className="py-2.5 px-4 text-sm text-red-400 hover:text-red-300 hover:bg-[rgba(239,68,68,0.08)] cursor-pointer flex items-center gap-2.5 transition-colors duration-150"
              >
                <i className="bx bx-trash text-base"></i> Delete
              </li>
            </ul>
          </div>
        </div>

        {/* Subtle accent line at top */}
        <div
          className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }}
        ></div>
      </div>

      <NoteModal
        openNoteModal={openNoteModal}
        setOpenNoteModal={setOpenNoteModal}
      >
        <UpdateNote note={note} setOpenNoteModal={setOpenNoteModal} />
      </NoteModal>
    </>
  );
};

export default NoteItem;
