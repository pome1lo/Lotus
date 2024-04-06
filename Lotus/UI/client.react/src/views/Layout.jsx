import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import React from "react";
import {Outlet} from "react-router-dom";
import {Sidebar} from "./components/Sidebar";
import 'bootstrap';
const Layout = () => {
    return (
        <>
            <Header/>
            <main className="container-fluid">
                <div className="row g-4">
                    <Sidebar/>
                    <Outlet/>
                </div>
            </main>
            <Footer/>
        </>
    );
}

export { Layout }