import '../resources/css/Header.css';
import Logo from "../resources/images/logo/big_logo.svg";

function Header() {
    return (
        <div>
            <div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
                <button className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center" id="bd-theme"
                        type="button" aria-expanded="false" data-bs-toggle="dropdown" aria-label="Toggle theme (light)">
                    <svg className="bi my-1 theme-icon-active" width="1em" height="1em">
                        <use href="#sun-fill"></use>
                    </svg>
                    <span className="visually-hidden" id="bd-theme-text">Toggle theme</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
                    <li>
                        <button type="button" className="dropdown-item d-flex align-items-center active"
                                data-bs-theme-value="light" aria-pressed="true">
                            <svg className="bi me-2 opacity-50 theme-icon" width="1em" height="1em">
                                <use href="#sun-fill"></use>
                            </svg>
                            Light
                            <svg className="bi ms-auto d-none" width="1em" height="1em">
                                <use href="#check2"></use>
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item d-flex align-items-center"
                                data-bs-theme-value="dark"
                                aria-pressed="false">
                            <svg className="bi me-2 opacity-50 theme-icon" width="1em" height="1em">
                                <use href="#moon-stars-fill"></use>
                            </svg>
                            Dark
                            <svg className="bi ms-auto d-none" width="1em" height="1em">
                                <use href="#check2"></use>
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button type="button" className="dropdown-item d-flex align-items-center"
                                data-bs-theme-value="auto"
                                aria-pressed="false">
                            <svg className="bi me-2 opacity-50 theme-icon" width="1em" height="1em">
                                <use href="#circle-half"></use>
                            </svg>
                            Auto
                            <svg className="bi ms-auto d-none" width="1em" height="1em">
                                <use href="#check2"></use>
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
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
                            </ul>
                            <form className="d-flex" role="search">
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