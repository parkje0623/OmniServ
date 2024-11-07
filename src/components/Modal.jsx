import React from "react";
import '../stylesheets/modal.css';

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>X</button>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;