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
import { Toast } from 'bootstrap';
import {ToastComponent} from "./views/components/ToastComponent";


function App() {
    useEffect(() => AOS.init , []);

    const [showToast, setShowToast] = useState(false);
    const [time, setTime] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');

    const CURRENT_USER_NAME = sessionStorage.getItem('username');

    const socket = io('https://localhost:31902', { withCredentials: true });

    useEffect(() => {
        socket.on(`new_comment_${CURRENT_USER_NAME}`, (data) => {
            setShowToast(true);
            setTime(data.time);
            setAuthor(data.author);
            setImage(data.image);
            setMessage(data.message);
        });

        socket.on(`subscribe_${CURRENT_USER_NAME}`, (data) => {
            setShowToast(true);
            setTime(data.time);
            setAuthor(data.author);
            setImage(data.image);
            setMessage(data.message);
        }); 
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="home" element={<HomePage/>}/>
                    <Route path="news" element={<NewsPage/>}/>
                    <Route path="support" element={<SupportPage/>}/>
                    <Route path="profile/:username" element={<ProfilePage/>}/>
                    <Route path="profile/:username/edit" element={<ProfileEditPage/>}/>
                    <Route path="profile/:username/change-password" element={<ChangePasswordPage/>}/>
                    <Route path="/:username/:post_id/comments" element={<CommentsPage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/people" element={<PeoplePage/>}/>
                    <Route path="/subscriptions" element={<SubscriptionsPage/>}/>
                    <Route path="/notifications" element={<NotificationsPage/>}/>
                </Route>
                <Route path="login" element={<AuthenticationPage/>}/>
                <Route path="register" element={<RegistrationPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>

            <ToastComponent
                show={showToast}
                time={time}
                author={author}
                image={image}
                message={message}>
            </ToastComponent>
        </>
    );
}


export default App;