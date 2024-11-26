import React from "react";
import '../stylesheets/modal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from '@fortawesome/fontawesome-free-solid';


function Modal({ isOpen, onClose, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>
                        <FontAwesomeIcon icon={faWindowClose} />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;