import ReactDom from "react-dom";
import React, { FC } from "react";

type INoteModal = {
  openNoteModal: boolean;
  setOpenNoteModal: (open: boolean) => void;
  children: React.ReactNode;
};

const NoteModal: FC<INoteModal> = ({
  openNoteModal,
  setOpenNoteModal,
  children,
}) => {
  if (!openNoteModal) return null;
  return ReactDom.createPortal(
    <>
      {/* Overlay with blur */}
      <div
        className="fixed inset-0 z-[1000] animate-fade-in"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={() => setOpenNoteModal(false)}
      ></div>
      {/* Modal */}
      <div
        className="max-w-lg w-[calc(100%-2rem)] rounded-2xl fixed top-[10%] left-1/2 z-[1001] p-7 border border-glass-border"
        style={{
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.1)',
          animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}
      >
        {children}
      </div>
    </>,
    document.getElementById("note-modal") as HTMLElement
  );
};

export default NoteModal;
