import '../../assets/css/Header.css';
import Logo from "../../assets/images/logo/logo.png";
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";

const Header = () => {
    const [theme, setTheme] = useState('dark');
    const [showButton, setShowButton] = useState(false);
    const navigate = useNavigate();


    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        setIsAuthenticated(!!username);
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            setTheme('light');
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
    };

    const handleClick = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id');
        navigate(`/`);
        window.location.reload();
    };

    useEffect(() => {
        const icons = document.querySelectorAll('.negative');
        icons.forEach(icon => {
            if (theme === 'dark') {
                icon.style.filter = 'invert(1)';
            } else {
                icon.style.filter = 'invert(0)';
            }
        });
        const token = sessionStorage.getItem('token');
        if (token) {
            setShowButton(true);
        }
    }, [theme]);

    return (
        <>
            <nav className="header bg-body-tertiary navbar navbar-expand-lg rounded mb-4" aria-label="Thirteenth navbar example">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link to="/" className="navbar-brand">
                        <img className="bi pe-none me-2" width="40" src={`${Logo}`} alt={"logo"}/>
                    </Link>
                    <div className="collapse navbar-collapse d-lg-flex justify-content-lg-end" id="navbarsExample11">

                        <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="#">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/about">All about Lotus</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link disabled">Disabled</Link>
                            </li>
                            <li>
                                <h6 className="pb-2 mb-2 border-bottom show-display"> </h6>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="/home" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="/news" className="nav-link active" aria-current="page">News</Link>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="#" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="#" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                        </ul>
                        <div>

                        </div>
                        <div className="bottomBlock d-lg-flex col-lg-3 justify-content-lg-end align-items-center">
                            {isAuthenticated ? (
                                <button className="border-0 bg-transparent mr-2" type="button"  onClick={handleClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                                         className="bi bi-box-arrow-right hover-size" viewBox="0 0 16 16">
                                        <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                        <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                    </svg>
                                </button>
                            ) : (
                                <></>
                            ) }
                            <label className="theme-switch">
                                <input type="checkbox" onChange={toggleTheme}/>
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export {Header};