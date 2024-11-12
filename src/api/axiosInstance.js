import axios from 'axios';
import Cookies from 'js-cookie';
const axiosInstance = axios.create({
    baseURL: process.env.HTTP_API_URL || 'http://localhost:5030/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const refreshResponse = await axiosInstance.post('/v1/Auth/refresh-token', refreshToken);
                const accessToken = refreshResponse.data.data.token;
                localStorage.setItem('accessToken', accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token cũng hết hạn, yêu cầu người dùng đăng nhập lại\
                console.log('Lỗi');

                console.error(refreshError);
                window.location.href = '/admin';
            }
        }
        if (error.response?.status === 500 || !error.response) {
            console.error('Server error or network connection issue:', error);
            window.location.href = '/error'; // Redirect to a default error page
        }
        return Promise.reject(error);
    },
);
export default axiosInstance;
