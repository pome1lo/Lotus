import Logo from "../../assets/images/logo/logo.png";
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "../../assets/css/Authentication.css";

const RegistrationPage = () => {
    const navigate = useNavigate();
    const [inputUsername, setUsername] = useState('');
    const [inputEmail, setEmail] = useState('');
    const [inputPassword, setPassword] = useState('');
    const [inputConfirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const isFormValid = () => {
        return inputUsername.trim() !== '' &&
            inputEmail.trim() !== '' &&
            inputPassword.trim() !== '' &&
            inputPassword === inputConfirm;
    };

    async function fetchData() {
        if (!isFormValid()) {
            setError('Пожалуйста, заполните все поля и убедитесь, что пароли совпадают.');
            return;
        }

        const response = await fetch('https://localhost:31002/api/auth/account/register', {
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
        if (!response.ok) {
            //console.error('Ошибка входа:', response.statusText);
            const data = await response.json();
            console.log(data.message);
            setError(data.message);
            return;
        }

        const data = await response.json();
        if (response.ok) {
            console.log("TOKEN", data.token);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username);
            navigate('/');
        } else {
            console.error('Ошибка входа:', data.message);
        }
    }
    return (
        <>
            <main className="d-flex flex-column align-items-center justify-content-center py-4 form-signin w-100 vh-100">
                <img className="mb-3" src={`${Logo}`} alt="" width="72"/>

                <form className="text-center form-signin">
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
                    <div className="form-floating password changePasswordBorder">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required
                               value={inputPassword} onChange={(e) => setPassword(e.target.value)}/>
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="form-floating password">
                        <input type="password" className="form-control" id="floatingConfirm" placeholder="Confirm" required
                               value={inputConfirm} onChange={(e) => setConfirm(e.target.value)}/>
                        <label htmlFor="floatingConfirm">Confirm</label>
                    </div>
                    <div className="d-flex justify-content-between m-1">
                        <div className="form-check text-start my-3">
                            <input className="form-check-input" type="checkbox" value="remember-me"
                                   id="flexCheckDefault"/>
                            <label className="form-check-label rememberMe" htmlFor="flexCheckDefault">
                                Remember me
                            </label>
                        </div>
                        <div className="form-check text-start my-3">
                            <Link className="w-auto rememberMe" to="/login">Sign in</Link>
                        </div>
                    </div>
                    <button className="btn  btn-danger w-100 py-2" type="button" onClick={fetchData}
                            disabled={!isFormValid()}>Join
                    </button>
                    <p className="mt-5 mb-3 text-body-secondary">© 2024 Lotus</p>
                </form>
                <p>{error}</p>
            </main>
        </>
    );
}

export {RegistrationPage}