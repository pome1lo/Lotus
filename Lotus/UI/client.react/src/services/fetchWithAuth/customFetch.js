const customFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem('token');

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    // else {
    //     window.location.href = '/login';
    //     return;
    // }

    try {
        const response = await fetch(`https://localhost:4000${url}`, options);
        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }
        if (response.status === 404) {
            window.location.href = '/not-found';
            return;
        }
        return response;
    } catch (error) {
        console.error('Ошибка сетевого запроса', error.message);
        throw error;
    }
}


const authFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem('token');

    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    try {
        const response = await fetch(url, options);
        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }
        if (response.status === 404) {
            window.location.href = '/not-found';
            return;
        }
        return response;
    } catch (error) {
        console.error('Ошибка сетевого запроса', error.message);
        throw error;
    }
}

export { customFetch, authFetch }