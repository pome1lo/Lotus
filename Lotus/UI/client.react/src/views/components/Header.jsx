import '../../assets/css/Header.css';
import Logo from "../../assets/images/logo/logo.png";
import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

const Header = () => {
    const [theme, setTheme] = useState('dark');
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
                                <Link className="nav-link" to="#">Link</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link disabled">Disabled</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to="#" data-bs-toggle="dropdown"
                                   aria-expanded="false">Dropdown</Link>
                                <ul className="dropdown-menu">
                                    <li><Link to="#" className="dropdown-item">Action</Link></li>
                                    <li><Link to="#" className="dropdown-item">Another action</Link></li>
                                    <li><Link to="#" className="dropdown-item">Something else here</Link></li>
                                </ul>
                            </li>
                            <li>
                                <h6 className="pb-2 mb-2 border-bottom show-display"> </h6>
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
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export {Header};