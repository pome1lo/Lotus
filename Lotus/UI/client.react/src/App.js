import './assets/css/App.css';
import 'aos/dist/aos.css';
import React, {useEffect} from 'react';
import AOS from 'aos';
import {FormPage} from "./views/pages/FormPage";
import { Route, Routes } from 'react-router-dom';
import {NewsPage} from "./views/pages/NewsPage";
import {NotFoundPage} from "./views/pages/NotFoundPage";
import {Profile} from "./views/components/Profile";
import {Layout} from "./views/Layout";
import {HomePage} from "./views/pages/HomePage";
export default App;

function App() {
    useEffect(() => AOS.init , []);

    return (
        <div className="App">
            <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index path="/home" element={<HomePage/>} />
                    <Route path="/login" element={<FormPage/>} />
                    <Route path="/news" element={<NewsPage/>} />
                    <Route path="/profile/:userName" element={<Profile/>} />
                    {/*<Route path="*" element={<NotFoundPage />} />*/}
                </Route>
                <Route path="/not-found" element={<NotFoundPage />} />
            </Routes>
            </>
        </div>
    );
}