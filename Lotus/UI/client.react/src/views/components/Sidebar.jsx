import '../../assets/css/Sidebar.css';
import {Link, NavLink} from "react-router-dom";
import React from "react";

const Sidebar = () => {
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
                                <NavLink to="/1" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-emoji-sunglasses"></i>link 1
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/2" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-emoji-sunglasses"></i>link 2
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/3" className="nav-link link-body-emphasis" aria-current="page">
                                    <i className="bi bi-emoji-sunglasses"></i>link 3
                                </NavLink>
                            </li>
                        </ul>
                        <hr/>
                        <div>
                            <a href="#" className="nav-link otherLink">All about the Lotus</a>
                            <a href="#" className="nav-link otherLink">Come join us: </a>
                            <div className="d-flex otherLink">
                                <Link to="https://t.me/telegram" className="nav-link link-body-emphasis imageHover" >
                                    <i className="bi-telegram bi"></i>
                                </Link>
                                <Link to="https://www.instagram.com/" className="nav-link link-body-emphasis imageHover" >
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