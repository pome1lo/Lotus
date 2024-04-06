import './assets/css/App.css';
import 'aos/dist/aos.css';
import React, {useEffect} from 'react';
import AOS from 'aos';
import { Route, Routes } from 'react-router-dom';
import {NewsPage} from "./views/pages/NewsPage";
import {NotFoundPage} from "./views/pages/NotFoundPage";
import {ProfilePage} from "./views/pages/ProfilePage";
import {ProfileEditPage} from "./views/pages/ProfileEditPage";
import {HomePage} from "./views/pages/HomePage";
import {SelectedNews} from "./views/pages/SelectedNews";
import 'bootstrap';

import {Layout} from "./views/Layout";
import {AuthenticationPage} from "./views/pages/AuthenticationPage";
import {RegistrationPage} from "./views/pages/RegistrationPage";

function App() {
  useEffect(() => AOS.init , []);

  return (
      // <div className="App">
        <>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index path="home" element={<HomePage/>} />
              <Route path="news" element={<NewsPage/>} />
              <Route path="news/:id" element={<SelectedNews/>} />
              <Route path="profile/:username" element={<ProfilePage/>} />
              <Route path="profile/:username/edit" element={<ProfileEditPage/>} />
            </Route>
            {/*<Route path="login" element={<FormPage/>} />*/}
            {/*<Route path="*" element={<AuthorizationPage />} />*/}
            <Route path="login" element={<AuthenticationPage />} />
            <Route path="register" element={<RegistrationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </>
      // </div>
  );
}


export default App;