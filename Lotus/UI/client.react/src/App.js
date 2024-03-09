import './assets/css/App.css';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import AOS from 'aos';
import Form from "./components/Form";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./components/Main";
import NotFoundPage from "./components/NotFoundPage";
export default App;

function App() {
    useEffect(() => AOS.init , []);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/Login" element={<Form/>} />
                    <Route path="/Main" element={<Main/>} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Router>
        </div>
    );
}