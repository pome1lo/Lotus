import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '100vh' }}>
            <h1 className="display-1">404</h1>
            <p className="lead" style={{ fontSize: '2rem', fontWeight: 'bold' }}>The page was not found 😕</p>
            <p style={{ fontSize: '1.2rem' }}>Unfortunately, the page you are looking for does not exist or has been moved.</p>
            <Link to="/" className="btn btn-danger btn-lg">Go back to the main page</Link>
        </div>
    );
}

export { NotFoundPage };
