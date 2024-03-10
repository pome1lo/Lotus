import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import React from "react";
import {Outlet} from "react-router-dom";
import {Sidebar} from "./components/Sidebar";
import {DOM_KEY_LOCATION} from "@testing-library/user-event/dist/keyboard/types";

const Layout = () => {
    return (
        <>
            <Header/>
            <main className="container-xxl">
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