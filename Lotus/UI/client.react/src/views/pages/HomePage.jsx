import {ErrorMessage} from "../components/ErrorMessage";
import React, {useState} from "react";

const HomePage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    return (
        <>
            <div className="col-md-8 order-md-1">
                home
            </div>
            <ErrorMessage message={errorMessage} isVisible={showError} />
        </>
    );
}

export {HomePage};
