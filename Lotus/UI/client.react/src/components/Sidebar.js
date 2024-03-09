import '../assets/css/Sidebar.css';
import logo from '../assets/images/logo/big_logo.svg';
import home from '../assets/images/icons/icon _home_.svg';
import twitter from '../assets/images/icons/twitter_logo.svg';
import telegram from '../assets/images/icons/telegram_logo.svg';
import facebook from '../assets/images/icons/facebook_logo.svg';
import instagram from '../assets/images/icons/instagram_logo.svg';

function Sidebar() {
    return (
        <div className="col-md-2 order-md-1 one">
            <aside className="bd-aside sticky-xl-top">
                <nav className="small" id="toc">
                    <div className="d-flex flex-column flex-shrink-0 p-3  leftBlock">
                        <hr/>
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <a href="#" className="nav-link active link-body-emphasis" aria-current="page">
                                    <img src={home} className="bi pe-none me-2 negative" width="16" height="16"/>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link link-body-emphasis">
                                    <img src={home} className="bi pe-none me-2 negative" width="16" height="16"/>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link link-body-emphasis">
                                    <img src={home} className="bi pe-none me-2 negative" width="16" height="16"/>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link link-body-emphasis">
                                    <img src={home} className="bi pe-none me-2 negative" width="16" height="16"/>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link link-body-emphasis">
                                    <img src={home} className="bi pe-none me-2 negative" width="16" height="16"/>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link link-body-emphasis">
                                    <img src={home} className="bi pe-none me-2 negative" width="16" height="16"/>
                                    Dashboard
                                </a>
                            </li>
                        </ul>
                        <hr/>
                        <div>
                            <a href="#" className="nav-link otherLink">All about the Lotus</a>
                            <a href="#" className="nav-link otherLink">Come join us: </a>
                            <div className="d-flex otherLink">
                                <a href="" className="nav-link link-body-emphasis imageHover"><img
                                    src={twitter}
                                    className="imageHover bi pe-none me-2"></img></a>
                                <a href="" className="nav-link link-body-emphasis imageHover"><img
                                    src={instagram}
                                    className="imageHover bi pe-none me-2"/></a>
                                <a href="" className="nav-link link-body-emphasis imageHover"><img
                                    src={facebook}
                                    className="imageHover bi pe-none me-2 "/></a>
                                <a href="" className="nav-link link-body-emphasis imageHover"><img
                                    src={telegram}
                                    className="imageHover bi pe-none me-2"/></a>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </div>
    );
}

export default Sidebar;