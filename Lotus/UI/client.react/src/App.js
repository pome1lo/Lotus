import './assets/css/App.css';
import 'aos/dist/aos.css';
import React, { useEffect } from 'react';
import AOS from 'aos';
import Form from "./components/Form"; // Импортируйте CSS из библиотеки AOS
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./components/Main";
export default App;


function App() {
    useEffect(() => AOS.init , []);

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route exact path="/Login" element={<Form/>} />
                    <Route path="/Main" element={<Main/>} />
                    {/*<Route path="*" element={<NotFoundPage />} />*/}
                </Routes>
            </Router>
        </div>
    );
}