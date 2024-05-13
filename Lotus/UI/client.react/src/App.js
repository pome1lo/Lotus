import './assets/css/App.css';
import 'aos/dist/aos.css';
import React, {useEffect, useState} from 'react';
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
import {ChangePasswordPage} from "./views/pages/ChangePasswordPage";
import {SupportPage} from "./views/pages/SupportPage";
import {CommentsPage} from "./views/pages/CommentsPage";
import {AboutPage} from "./views/pages/AboutPage";
import {PeoplePage} from "./views/pages/PeoplePage";
import {SubscriptionsPage} from "./views/pages/SubscriptionsPage";
import {NotificationsPage} from "./views/pages/NotificationsPage";

import io from 'socket.io-client';
import {ErrorMessage} from "./views/components/ErrorMessage";

// const socket = io('https://localhost:31903', { withCredentials: true });
// socket.on('connect', () => { console.log('Подключено к серверу'); });
// socket.emit('message', 'Привет, сервер!');
// socket.on('message', (data) => { console.log(data); });

function App() {
  useEffect(() => AOS.init , []);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  // useEffect(() => {
  //
  //   socket.on('new-comment', (data) => {
  //     setErrorMessage((prevMessages) => [...prevMessages, data]);
  //     setShowError(true);
  //   });
  //
  //   return () => {
  //     socket.off('new-comment');
  //   };
  // }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<HomePage/>} />
          <Route path="home" element={<HomePage/>} />
          <Route path="news" element={<NewsPage/>} />
          <Route path="news/:topic" element={<NewsPage/>} />
          <Route path="news/:id" element={<SelectedNews/>} />
          <Route path="support" element={<SupportPage/>} />
          <Route path="profile/:username" element={<ProfilePage/>} />
          <Route path="profile/:username/edit" element={<ProfileEditPage/>} />
          <Route path="profile/:username/change-password" element={<ChangePasswordPage/>} />
          <Route path="/:username/:post_id/comments" element={<CommentsPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/people" element={<PeoplePage/>} />
          <Route path="/subscriptions" element={<SubscriptionsPage/>} />
          <Route path="/notifications" element={<NotificationsPage/>} />
        </Route>
        <Route path="login" element={<AuthenticationPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ErrorMessage message={errorMessage} isVisible={showError}/>
    </>
  );
}


export default App;