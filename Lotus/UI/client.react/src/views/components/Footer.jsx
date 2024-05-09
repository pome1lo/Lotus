import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="py-3 my-4">
            <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item"><Link to="/home" className="nav-link px-2 text-body-secondary">Home</Link></li>
                <li className="nav-item"><Link to="/about" className="nav-link px-2 text-body-secondary">All about Lotus</Link></li>
                <li className="nav-item"><Link to="/support" className="nav-link px-2 text-body-secondary">Support</Link></li>
            </ul>
            <p className="text-center text-body-secondary">© 2024 Lotus Company, Inc</p>
        </footer>
    )
}

export { Footer };
