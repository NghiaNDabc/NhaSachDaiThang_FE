import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axiosInstance.post('/v1/Auth/admin/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const { token, refreshToken } = response.data.data;
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                toast.success('Đăng nhập thành công');
                
                return { success: true, token, refreshToken };
            } else if (response.status === 400) {
                toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
                return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi đăng nhập');
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
        }
    }
};
