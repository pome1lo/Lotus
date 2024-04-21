import Logo from "../../assets/images/logo/logo.png";
import {Link, NavLink, useNavigate} from "react-router-dom";
import React, {useState} from "react";

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const [inputUsername, setUsername] = useState('');
    const [inputPassword, setPassword] = useState('');

    async function fetchData() {
        const response = await fetch('https://localhost:31901/api/auth/account/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: inputUsername,
                password: inputPassword
            })
        });
        if (!response.ok) {
            console.error('Ошибка входа:', response.statusText);
            return;
        }

        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username);
            navigate('/');
        } else {
            console.error('Ошибка входа:', data.message);
        }
    }

    return (
        <>
            <main
                className="d-flex flex-column align-items-center justify-content-center py-4 form-signin w-100 vh-100">
                <img className="mb-3" src={`${Logo}`} alt="" width="72"/>

                <form className="text-center form-signin">
                    <h2 className="h4 mb-3 fw-medium">Please sign in</h2>
                    <div className="form-floating username">
                        <input type="text" className="form-control" id="floatingInput" required placeholder="User name"
                               value={inputUsername} onChange={(e) => setUsername(e.target.value)}/>
                        <label htmlFor="floatingInput">User name</label>
                    </div>
                    <div className="form-floating password ">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                               required
                               value={inputPassword} onChange={(e) => setPassword(e.target.value)}/>
                        <label htmlFor="floatingPassword">Password</label>
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
                            <Link to="/register" className="w-auto rememberMe my-3">Join</Link>
                        </div>
                    </div>
                    <button className="btn btn-danger w-100 py-2" type="button" onClick={fetchData}>Sign in</button>


                    <p className="mt-3 mb-3 text-body-secondary">© 2024 Lotus</p>
                </form>
            </main>

            <div className="d-flex flex-column social-networks-block">
                <NavLink to="http://localhost:31002/api/auth/google" className="imageHover">
                    <i className="bi bi-google"></i>
                </NavLink>
                <NavLink to="http://localhost:31002/api/auth/github" className="imageHover">
                    <i className="bi bi-github"></i>
                </NavLink>
            </div>
        </>
    );
}

export {AuthenticationPage}