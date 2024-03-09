import "../assets/css/Login.css";
import React, {useState} from "react";
async function fetchData() {
    const response = await fetch('http://localhost:31002/userAccount/auth', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'admin',
            password: 'password'
        })
    });
    if (!response.ok) {
        console.error('Ошибка входа:', response.statusText);
        return;
    }

    const data = await response.json();

    console.log('Bearer ' + data.token);

    if (response.ok) {

        console.log("TOKEN $ ", data.token);
        sessionStorage.setItem('token', data.token);
    } else {
        console.error('Ошибка входа:', data.message);

    }
}

function Login() {
    const [inputUsername, setUsername] = useState('');
    const [inputPassword, setPassword] = useState('');
    const [inputConfirm, setConfirm] = useState('');

    const [textJoin, setJoin] = useState('Join');
    const [textSign, setSign] = useState('Sign in');
    const [showElements, setClassName] = useState('display-none');
    const [changePasswordBorder, setStyle] = useState('');

    const handleClick = () => {
        setJoin(prevText =>
            prevText === 'Join' ? 'Sign in' : 'Join'
        );
        setSign(prevText =>
            prevText === 'Join' ? 'Sign in' : 'Join'
        );
        setClassName(prev =>
            prev === '' ? 'display-none' : ''
        );
        setStyle(prev =>
            prev === 'changePasswordBorder' ? '' : 'changePasswordBorder'
        );
    };
    return(
        <form className="text-center form-signin" onSubmit={fetchData}>
            <h2 className="h4 mb-3 fw-medium">Please {textSign.toLowerCase()}</h2>
            <div className="form-floating username">
                <input type="username" className="form-control" id="floatingInput" placeholder="name@example.com"
                       required
                       value={inputUsername} onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className={"form-floating password " + changePasswordBorder}>
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required
                       value={inputPassword} onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="floatingPassword">Password</label>
            </div>


            <div className={"form-floating password " + showElements}>
                <input type="password" className="form-control" id="floatingPassword" placeholder="Confirm" required
                    value={inputConfirm} onChange={(e) => setConfirm(e.target.value)}/>
                <label htmlFor="floatingPassword">Confirm</label>
            </div>


            <div className="d-flex justify-content-between m-1">
                <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault"/>
                    <label className="form-check-label rememberMe" htmlFor="flexCheckDefault">
                        Remember me
                    </label>
                </div>

                <button className="btn w-auto rememberMe" type="button" onClick={handleClick}>{textJoin}</button>
            </div>

            <button className="btn  btn-danger w-100 py-2" type="submit">{textSign}</button>
            <p className="mt-5 mb-3 text-body-secondary">© 2024 Lotus</p>


        </form>
    );
}

export default Login;