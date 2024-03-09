import '../assets/css/Header.css';
import Logo from "../assets/images/logo/big_logo.svg";
import React, { useState, useEffect } from 'react';


function Header() {
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
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <img className="bi pe-none me-2" width="130" src={Logo}/>
                        </a>
                        <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse" id="navbarCollapse">
                            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Link</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled">Disabled</a>
                                </li>
                                <h6 className="h6 pt-4 pb-3 mb-4 border-bottom show-display"></h6>
                                <li className="nav-item show-display">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item show-display">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item show-display">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item show-display">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>

                            </ul>
                            <form className="d-flex" role="search">
                                <div>
                                    <label className="theme-switch">
                                    <input type="checkbox" onChange={toggleTheme}/>
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <input className="form-control me-2" type="search" placeholder="Search"
                                       aria-label="Search"/>
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Header;