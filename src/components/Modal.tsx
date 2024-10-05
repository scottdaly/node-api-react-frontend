import React, { useRef, useEffect } from "react";
import { XIcon } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-white px-10 py-12 rounded-xl max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 m-2 p-1 hover:bg-gray-100 rounded-lg"
        >
          <XIcon className="w-8 h-8" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
