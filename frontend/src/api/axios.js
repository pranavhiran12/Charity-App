import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Attach token to each request
API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: auto-refresh on 401
API.interceptors.response.use(
    res => res,
    async(err) => {
        const originalRequest = err.config;

        // If token expired AND not already retried
        if (err.response && err.response.status === 401 && !originalRequest._retry) {

            originalRequest._retry = true;

            try {
                const refreshRes = await axios.post('http://localhost:5000/api/auth/refresh', {
                    refreshToken: localStorage.getItem('refreshToken'),
                });

                const newToken = refreshRes.data.token;

                // Save new token and retry original request
                localStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return axios(originalRequest); // Retry
            } catch (refreshErr) {
                // Refresh token failed → force logout
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(err);
    }
);

export default API;