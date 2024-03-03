import './resources/css/App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Post from "./components/Post";
import Recommendations from "./components/Recommendations";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Profile from "./components/Profile"; // Импортируйте CSS из библиотеки AOS
export default App;


function App() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className="App">
            <div className="container-xxl">
                <Header/>
                <main className="container-xxl">
                    <div className="row g-4">
                        <Sidebar/>
                        <div className="col-md-6 order-md-1 two">
                            <Post/>
                            <Post/>
                            <Post/>
                            <Post/>
                        </div>
                        <Recommendations />
                    {/*<Profile/>*/}
                    </div>
                </main>
                <Footer/>
            </div>
        </div>
    );
}
