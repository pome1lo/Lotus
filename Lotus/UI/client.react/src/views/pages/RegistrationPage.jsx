import Logo from "../../assets/images/logo/logo.png";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../../assets/css/Authentication.css";
import {ErrorMessage} from "../components/ErrorMessage";

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [inputUsername, setUsername] = useState('');
    const [inputEmail, setEmail] = useState('');
    const [inputPassword, setPassword] = useState('');
    const [inputSuccessConfirm, setSuccessCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const [inputCode, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [isButtonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            setButtonDisabled(false);
        }
    }, [timeLeft]);

    async function sendAgain() {
        try {
            const response = await fetch('https://localhost:31901/api/auth/account/login', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessCode(data.code)
            } else {
                console.error('Ошибка входа:', data.message);
                setErrorMessage(data.message);
                setShowError(true);
            }
            setTimeLeft(30);
            setButtonDisabled(true);
        }
        catch (error) {
            console.error('Ошибка запроса:', error);
            setErrorMessage(error.toString());
            setShowError(true);
        }

    }

    async function verifyEmail(event) {
        event.preventDefault();
        if(inputSuccessConfirm !== inputCode) {
            setErrorMessage("Invalid verification code");
            setShowError(true);
        }
        else {
            try {
                const response = await fetch('https://localhost:31901/api/auth/account/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: inputUsername,
                        email: inputEmail,
                        password: inputPassword
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('username', data.username);
                    navigate('/')
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
    }


    async function identifyUser(event) {
        event.preventDefault();

        try {
            const response = await fetch('https://localhost:31901/api/auth/account/identify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: inputUsername,
                    email: inputEmail,
                    password: inputPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsRegistered(true);
                setTimeLeft(30);
                setSuccessCode(data.code);
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
            <main className="d-flex flex-column align-items-center justify-content-center py-4 form-signin w-100 vh-100">
                <Link to="/">
                    <img className="mb-3" src={`${Logo}`} alt="" width="72"/>
                </Link>
                {!isRegistered ? (
                    <form className="text-center form-signin needs-validation" onSubmit={identifyUser}>
                    <h2 className="h4 mb-3 fw-medium">Please join</h2>
                    <div className="form-floating username">
                        <input type="text" className="form-control" id="floatingInput" placeholder="User name" required
                               value={inputUsername} onChange={(e) => setUsername(e.target.value)}/>
                        <label htmlFor="floatingPassword">User name</label>
                    </div>
                    <div className="form-floating password changePasswordBorder">
                        <input type="email" className="form-control" id="floatingInput" placeholder="Email address" required
                               value={inputEmail} onChange={(e) => setEmail(e.target.value)}/>
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating password">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required
                               value={inputPassword} onChange={(e) => setPassword(e.target.value)}/>
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="d-flex justify-content-between m-1">
                        <div className="d-flex justify-content-between align-items-center m-1">
                            <p className="form-check-label rememberMe">
                                Otherwise you can
                            </p>
                        </div>
                        <div className="form-check text-start my-3">
                            <Link className="w-auto rememberMe" to="/login">Sign in</Link>
                        </div>
                    </div>
                    <button className="btn  btn-danger w-100 py-2" type="submit">Join</button>
                    <p className="mt-5 mb-3 text-body-secondary">© 2024 Lotus</p>
                </form>
                ) : (
                    <form className={"text-center form-signin needs-validation"} onSubmit={verifyEmail}>
                        <h2 className="h4 mb-3 fw-medium">Insert the code</h2>
                        <div className={"form-floating"}>
                            <input type="number" className="form-control" id="floatingPassword" placeholder="Code"
                                   required
                                   value={inputCode} onChange={(e) => setCode(e.target.value)}/>
                            <label htmlFor="floatingPassword">Code</label>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-link rounded-pill rememberMe redHover"
                                    disabled={isButtonDisabled}
                                    type="button" onClick={sendAgain}>Send again
                            </button>
                            <p className={"rememberMe"}>{timeLeft > 0 ? `0:${timeLeft} c.` : '0:0 c.'}</p>
                        </div>
                        <button className="btn  btn-danger w-100 py-2" type="submit">Verify</button>
                    </form>
                )}
            </main>
            <ErrorMessage message={errorMessage} isVisible={showError}/>
        </>
    );
}

export {RegistrationPage}