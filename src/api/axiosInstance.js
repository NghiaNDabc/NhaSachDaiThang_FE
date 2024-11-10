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
        const accessToken = Cookies.get('accessToken');
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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axiosInstance.post('v1/Auth/refresh-token', {
                    refreshRoken: Cookies.get('refreshToken'),
                });
                const { accessToken } = refreshResponse.data;

                Cookies.set('accessToken', accessToken, { expires: 1 });
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token cũng hết hạn, yêu cầu người dùng đăng nhập lại
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);
export default axiosInstance;
