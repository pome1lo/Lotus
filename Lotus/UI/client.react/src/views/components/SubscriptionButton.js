import React, { useState } from 'react';

const SubscriptionButton = ({styles}) => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscriptionToggle = async () => {
        try {
            const endpoint = isSubscribed
                ? 'http://localhost:31003/api/user/unsubscribe'
                : 'http://localhost:31003/api/user/subscribe';

            styles =
                styles == null ?
                    ( isSubscribed
                    ? 'btn btn-outline-secondary d-inline-flex align-items-center'
                    : 'btn btn-primary d-inline-flex align-items-center')
                : styles;

            const response = await fetch(endpoint, {
                method: 'POST', // Вы можете настроить метод HTTP по необходимости
                // Добавьте необходимые заголовки или данные тела запроса здесь
            });

            if (response.ok) {
                setIsSubscribed(!isSubscribed);
            } else {
                console.error('Ошибка при переключении подписки:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при переключении подписки:', error);
        }
    };

    return (
        <button onClick={handleSubscriptionToggle} className={styles}>
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
    );
};

export default SubscriptionButton;
