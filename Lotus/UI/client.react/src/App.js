import './resources/css/App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Post from "./components/Post";
import Recommendations from "./components/Recommendations";
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Импортируйте CSS из библиотеки AOS

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
                      <div className="col-md-6">
                          <Post/>
                          <Post/>
                          <Post/>
                          <Post/>
                      </div>
                      <Recommendations/>
                  </div>
              </main>
              <Footer/>
          </div>
      </div>
  );
}

export default App;
