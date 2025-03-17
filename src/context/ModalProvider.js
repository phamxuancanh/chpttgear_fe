import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({ isOpen: false, text: "" });

  const openModal = (text) => {
    setModalData({ isOpen: true, text });
    setTimeout(() => closeModal(), 1000); // Tự động tắt sau 3s
  };

  const closeModal = () => setModalData({ isOpen: false, text: "" });

  return (
    <ModalContext.Provider value={{ modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook để gọi modal dễ dàng trong component
export const useModal = () => useContext(ModalContext);
