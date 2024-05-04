import '../../assets/css/Sidebar.css';
import DefaultProfileImage from '../../assets/images/content/default_profile.png';
import {Link, NavLink} from "react-router-dom";
import React, {useEffect, useState} from "react";

const Sidebar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileName, setProfileName] = useState('');
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setProfileName(username);
        setIsAuthenticated(!!username);
    }, []);
    
    return (
        <div className="col-md-2 order-md-1 one">
            <aside className="bd-aside sticky-xl-top">
                <nav className="small" id="toc">
                    <div className="d-flex flex-column flex-shrink-0 p-3  leftBlock">
                        <hr/>
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <NavLink to="/home" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-house"></i>Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/news" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-columns"></i>News
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/people" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-people"></i>People
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/saved" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-bookmark"></i>Saved
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/3" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-emoji-sunglasses"></i>link 3
                                </NavLink>
                            </li>
                            <li>
                                <hr/>
                                {isAuthenticated ? (
                                        <NavLink to={`/profile/${profileName}`}
                                                 className="nav-link link-body-emphasis profile-nav-link"
                                                 aria-current="page">
                                            <img src={`${DefaultProfileImage}`} height="20" alt=""/>Profile
                                        </NavLink>)
                                    : (
                                        <NavLink to="/login" className="nav-link link-body-emphasis"
                                                 aria-current="page">
                                            <i className="bi bi-door-open"></i>Login
                                        </NavLink>
                                    )
                                }
                            </li>
                        </ul>
                        <hr/>
                        <div>
                            <Link to="#" className="nav-link otherLink">All about the Lotus</Link>
                            <Link to="#" className="nav-link otherLink">Come join us: </Link>
                            <div className="d-flex otherLink">
                                <Link to="https://t.me/telegram" className="nav-link link-body-emphasis imageHover">
                                    <i className="bi-telegram bi"></i>
                                </Link>
                                <Link to="https://www.instagram.com/"
                                      className="nav-link link-body-emphasis imageHover">
                                    <i className="bi-instagram bi"></i>
                                </Link>
                                <Link to="https://twitter.com/" className="nav-link link-body-emphasis imageHover" >
                                    <i className="bi-twitter bi"></i>
                                </Link>
                                <Link to="https://www.facebook.com/" className="nav-link link-body-emphasis imageHover" >
                                    <i className="bi-facebook bi"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </div>
    );
}

export {Sidebar};