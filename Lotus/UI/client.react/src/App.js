import './assets/css/App.css';
import 'aos/dist/aos.css';
import React, {Profiler, useEffect} from 'react';
import AOS from 'aos';
import {FormPage} from "./views/pages/FormPage";
import { Route, Routes } from 'react-router-dom';
import {MainPage} from "./views/pages/MainPage";
import {NotFoundPage} from "./views/pages/NotFoundPage";
import {Profile} from "./views/components/Profile";
import {Layout} from "./views/Layout";
export default App;

function App() {
    useEffect(() => AOS.init , []);

    return (
        <div className="App">
            <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<MainPage/>} />
                    <Route path="/login" element={<FormPage/>} />
                    <Route path="/profile/:userName" element={<Profile/>} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
            </>
        </div>
    );
}