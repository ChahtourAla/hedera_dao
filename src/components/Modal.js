// Modal.js
import React from "react";
import "./Modal.css";

const Modal = ({ title, onClose, children }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-button">
            &times;
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
