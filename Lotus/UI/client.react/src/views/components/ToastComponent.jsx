import React from 'react';
import Logo from "../../assets/images/logo/logo.png";
const ToastComponent = ({ show, author, message, time, image }) => {
    const AUTHOR = author || "Lotus";
    const TIME = time || "Now";
    const IMAGE = image || Logo;
    return (
        <div className={`bg-body-tertiary toast ${show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true"
            style={{position: "fixed", right: 0, bottom: 0, margin: 20}}>
            <div className="toast-header bg-transparent d-flex align-items-center">
                <div className="me-auto d-flex align-items-center">
                    <img style={{marginRight: 5}} className="border-radius" src={`${IMAGE}`} alt="" width="25"/>
                    <strong>{AUTHOR}</strong>
                </div>
                <small>{TIME}</small>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export { ToastComponent };