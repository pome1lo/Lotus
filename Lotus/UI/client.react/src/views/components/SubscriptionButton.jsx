import React, { useState } from 'react';
import {customFetch} from "../../services/fetchWithAuth/customFetch";
import io from "socket.io-client";

const socket = io('https://localhost:31902', { withCredentials: true });

const SubscriptionButton = ({ styles, to_id, initiallySubscribed, to_username }) => {
    const [isSubscribed, setIsSubscribed] = useState(initiallySubscribed);
    const [buttonStyles, setButtonStyles] = useState(styles == null
        ? isSubscribed
            ? 'btn btn-outline-secondary d-inline-flex align-items-center'
            : 'btn btn-primary d-inline-flex align-items-center'
        : styles);

    const handleSubscriptionToggle = async () => {
        const endpoint = isSubscribed
            ? '/api/profile/user/unsubscribe'
            : '/api/profile/user/subscribe';

        setButtonStyles(
            styles == null
                ? isSubscribed
                    ? 'btn btn-outline-secondary d-inline-flex align-items-center'
                    : 'btn btn-primary d-inline-flex align-items-center'
                : styles
        )
        try {
            const response = await customFetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to_id: to_id
                })
            });

            if (response.ok) {
                setIsSubscribed(!isSubscribed);
                window.location.reload();

                if (!isSubscribed) {
                    socket.emit('subscribe', {
                        user_id: to_id,
                        username: to_username
                    });
                }
            } else {
                console.error('Ошибка при переключении подписки:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при переключении подписки:', error);
        }
    };

    return (
        <button onClick={handleSubscriptionToggle} className={buttonStyles}>
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
    );
};

export { SubscriptionButton };