import '../../assets/css/Header.css';
import Logo from "../../assets/images/logo/logo.png";
import React, { useState, useEffect } from 'react';
import {Link, NavLink} from "react-router-dom";

const Header = () => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.documentElement.setAttribute('data-bs-theme', 'dark');
        } else {
            setTheme('light');
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
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
    }, [theme]);
    return (
        <>
            <nav className="header bg-body-tertiary navbar navbar-expand-lg rounded" aria-label="Thirteenth navbar example">
                <div className="container-fluid container-xxl">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link to="/" className="navbar-brand">
                        <img className="bi pe-none me-2" width="40" src={Logo} alt={"logo"}/>
                    </Link>
                    <div className="collapse navbar-collapse d-lg-flex justify-content-lg-end" id="navbarsExample11">

                        <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Disabled</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
                                   aria-expanded="false">Dropdown</a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                            <li>
                                <h6 className="pb-2 mb-2 border-bottom show-display"></h6>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="#" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="#" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="#" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                            <li className="nav-item show-display">
                                <Link to="#" className="nav-link active" aria-current="page">Home</Link>
                            </li>
                        </ul>
                        <div className="bottomBlock d-lg-flex col-lg-3 justify-content-lg-end align-items-center">
                            <label className="theme-switch">
                                <input type="checkbox" onChange={toggleTheme}/>
                                <span className="slider"></span>
                            </label>

                            <div className="flex-shrink-0 dropdown">
                                <a href="#"
                                   className="d-block link-body-emphasis text-decoration-none dropdown-toggle show"
                                   data-bs-toggle="dropdown" aria-expanded="true">
                                    <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32"
                                         className="rounded-circle"/>
                                </a>
                                <ul className="dropdown-menu text-small shadow person"
                                    data-popper-placement="bottom-end">
                                <li><a className="dropdown-item" href="#">New project...</a></li>
                                    <li><a className="dropdown-item" href="#">Settings</a></li>
                                    <li><a className="dropdown-item" href="#">Profile</a></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><a className="dropdown-item" href="#">Sign out</a></li>

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

        </>
    )
}

export {Header};