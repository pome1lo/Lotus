import Logo from "../../assets/images/logo/logo.png";
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {ErrorMessage} from "../components/ErrorMessage";
import {customFetch} from "../../services/fetchWithAuth/customFetch";

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const [inputUsername, setUsername] = useState('');
    const [inputPassword, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    async function fetchData(event) {
        event.preventDefault();
        try {
            const response = await customFetch('/api/auth/account/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: inputUsername,
                    password: inputPassword
                })
            });
            const data = await response.json();
            console.log(data)

            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', data.username);
                navigate('/');
            } else {
                setErrorMessage(data.message);
                setShowError(true);
            }
        } catch (error) {
            setErrorMessage(error.message);
            setShowError(true);
        }
    }

    async function test(event) {
        event.preventDefault();

        const response = await customFetch('/debug', {
            method: 'GET',
        });
        const debug = await customFetch('/api/profile/profiles', {
            method: 'GET',
        });
        const response2 = await customFetch('/api/news/world', {
            method: 'GET',
        });
        const response3 = await customFetch('/api/auth/account/fuck', {
            method: 'GET',
        });
        const data = await response.json();
        const data2 = await response2.json();
        const data3 = await response3.json();
        const debug1 = await debug.json();
        console.log(data)
        console.log(data2)
        console.log(data3)
        console.log(debug1)
    }


    return (
        <>
            <main
                className="d-flex flex-column align-items-center justify-content-center py-4 form-signin w-100 vh-100">
                <Link to="/">
                    <img className="mb-3" src={`${Logo}`} alt="" width="72"/>
                </Link>



                <form className="text-center form-signin" onSubmit={test}>
                    <button type="submit">asdas</button>
                </form>

                <form className="text-center form-signin" onSubmit={fetchData}>
                    <h2 className="h4 mb-3 fw-medium">Please sign in</h2>
                    <div className="form-floating username">
                        <input type="text" className="form-control" id="floatingInput" required placeholder="Username"
                               value={inputUsername} onChange={(e) => setUsername(e.target.value)}/>
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating password ">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required
                               value={inputPassword} onChange={(e) => setPassword(e.target.value)}/>
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="d-flex justify-content-between align-items-center m-1">
                        <p className="form-check-label rememberMe">
                            Otherwise you can
                        </p>
                        <div className="form-check text-start my-3">
                            <Link to="/register" className="w-auto rememberMe my-3">Join</Link>
                        </div>
                    </div>
                    <button className="btn btn-danger w-100 py-2"  type="submit">Sign in</button>
                    <p className="mt-3 mb-3 text-body-secondary">© 2024 Lotus</p>
                </form>
            </main>

            <ErrorMessage message={errorMessage} isVisible={showError} />
        </>
    );
}

export {AuthenticationPage}