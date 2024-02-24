import './resources/css/App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import logo from "./resources/images/logo/big_logo.svg";
import home from "./resources/images/icons/icon _home_.svg";
import twitter from "./resources/images/icons/twitter_logo.svg";
import instagram from "./resources/images/icons/instagram_logo.svg";
import facebook from "./resources/images/icons/facebook_logo.svg";
import telegram from "./resources/images/icons/telegram_logo.svg";
import Footer from "./components/Footer";
import Post from "./components/Post";

function App() {
  return (
      <div className="App">
          <div className="container">
              <Header/>
              <main className="container">
                  <div className="row g-5">
                      <Sidebar/>

                      {/* TEST */}
                      <Post/>
                      {/* TEST */}

                  </div>
              </main>
              <Footer/>
          </div>
      </div>
  );
}

export default App;
