import axios from 'axios';
import { toast } from 'react-toastify';
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
        if (accessToken != null) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Kiểm tra mã phản hồi và hiển thị thông báo
        // if (response.status === 200 || response.status === 201) {
        //     toast.success(response.data.message || 'Thao tác thành công!');
        // }
        return response;
    },
    async (error) => {
        debugger;
        if (!error.response) {
            // Nếu không có response, chuyển hướng người dùng đến trang đăng nhập
            console.error('No response received from the server:', error);
            window.location.href = '/auth'; // Chuyển hướng đến trang đăng nhập
            return Promise.reject(error);
        }

        // Kiểm tra mã trạng thái lỗi 500
        if (error.response.status === 500) {
            console.error('Server error:', error);
            window.location.href = '/error'; // Chuyển hướng đến trang lỗi
            return Promise.reject(error);
        }
        debugger;
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // Nếu không có refresh token, chuyển người dùng đến trang đăng nhập
                    window.location.href = '/auth';
                    return Promise.reject(error);
                }
                const refreshResponse = await axiosInstance.post('/v1/Auth/refresh-token', refreshToken);
                const { token, user } = refreshResponse.data.data;
                localStorage.setItem('accessToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Nếu refresh token cũng hết hạn, yêu cầu người dùng đăng nhập lại\
                console.log('Lỗi');

                console.error(refreshError);
                window.location.href = '/auth';
            }
        }
        debugger;
        if (!error.response || !error.response.status || error.response.status === 500) {
            console.error('Server error or network connection issue:', error);
            window.location.href = '/error';
        }
        debugger;
        if (error.response.status === 400) {
            toast.error(error.response.data.errMessage);
        }

        return Promise.reject(error);
    },
);
export default axiosInstance;
