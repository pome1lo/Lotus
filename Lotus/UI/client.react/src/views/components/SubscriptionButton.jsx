import React, { useState } from 'react';
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";

const SubscriptionButton = ({ styles, to_id, initiallySubscribed }) => {
    const [isSubscribed, setIsSubscribed] = useState(initiallySubscribed);
    const [buttonStyles, setButtonStyles] = useState(styles == null
        ? isSubscribed
            ? 'btn btn-outline-secondary d-inline-flex align-items-center'
            : 'btn btn-primary d-inline-flex align-items-center'
        : styles);

    const handleSubscriptionToggle = async () => {
        const endpoint = isSubscribed
            ? 'https://localhost:4000/api/user/unsubscribe'
            : 'https://localhost:4000/api/user/subscribe';

        setButtonStyles(
            styles == null
                ? isSubscribed
                    ? 'btn btn-outline-secondary d-inline-flex align-items-center'
                    : 'btn btn-primary d-inline-flex align-items-center'
                : styles
        )
        try {
            const response = await fetchWithAuth(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to_id: to_id
                })
            });

            if (response.ok) {
                setIsSubscribed(!isSubscribed);
                window.location.reload();
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
