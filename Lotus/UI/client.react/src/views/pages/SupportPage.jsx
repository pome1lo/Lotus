import {useParams} from "react-router-dom";
import {ProfileNavBar} from "../components/ProfileNavBar";
import React, {useState} from "react";
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";
import {ErrorMessage} from "../components/ErrorMessage";
import {SuccessMessage} from "../components/SuccessMessage";

const SupportPage = () => {
    const {username} = useParams();
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [inputContent, setContent] = useState('');

    const hideSuccessMessage = () => {
        setShowSuccess(false);
    };
    async function fetchData(event) {
        event.preventDefault();

        try {
            const response = await fetchWithAuth('https://localhost:31903/api/user/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    problem_message: inputContent,
                })
            });

            const data = await response.json();

            if (response.ok) {
                setContent('');
            } else {
                console.error('Ошибка входа:', data.message);
                setErrorMessage(data.message);
                setShowError(true);
            }
        }
        catch (error) {
            console.error('Ошибка запроса:', error);
            setErrorMessage(error.toString());
            setShowError(true);
        }
    }

    return (
        <>
            <div className="col-md-5 order-md-2">
                <form onSubmit={fetchData}>
                    <h1 className="fw-bold">How we can help?</h1>
                    <label>Your problem:</label>
                    <div className="input-group" >
                        <textarea id="problem" className="form-control" aria-label="With textarea" placeholder="Input ypur problem" required
                            value={inputContent} onChange={(e) => setContent(e.target.value)}/>
                    </div>
                    <button className="btn btn-danger mt-3" type="submit">Send</button>
                </form>
            </div>
            <ErrorMessage message={errorMessage} isVisible={showError} />
            <SuccessMessage message="Message succesfully sended"
                isVisible={showSuccess}
                hideMessage={hideSuccessMessage}
            />
        </>
    )
}

export {SupportPage}