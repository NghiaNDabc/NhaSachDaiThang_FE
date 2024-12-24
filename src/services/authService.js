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
                const { user, token, refreshToken } = response.data.data;
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Đăng nhập thành công');

                return { success: true, user, token, refreshToken };
            } else {
                toast.error(response.data.errMessage || JSON.stringify(response.errors));
                return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
            }
        } catch (err) {
            // toast.error('Có lỗi xảy ra khi đăng nhập');
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
        }
    },
    clientLogin: async (username, password) => {
        try {
            const response = await axiosInstance.post('/v1/Auth/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const { user, token, refreshToken } = response.data.data;
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Đăng nhập thành công');
                debugger;
                return { success: true, user, token, refreshToken };
            } else {
                toast.error(response.data.errMessage || JSON.stringify(response.errors));
                return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
            }
        } catch (err) {
            // toast.error('Có lỗi xảy ra khi đăng nhập');
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
        }
    },
    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const respone = await axiosInstance.post('/v1/Auth/logout', refreshToken);
            if (respone.data.success) {
                localStorage.clear();
                window.location.href = '/';
            } else {
                toast.error(respone.data.errMessage || JSON.stringify(respone.errors));
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
        }
    },
    sendOtpForgotPass: async (email) => {
        debugger;
        try {
            const respone = await axiosInstance.post('v1/ForgotPassword/otp', email);
            if (respone.data.success) {
                toast.success(respone.data.message);
            } else {
                toast.error(respone.data.errMessage || JSON.stringify(respone.errors));
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
          
        }
    },
    sendOtpRegister: async (email) => {
        debugger;
        try {
            const respone = await axiosInstance.post('v1/Auth/otp', email);
            if (respone.data.success) {
                toast.success(respone.data.message);
            } else {
                toast.error(respone.data.errMessage || JSON.stringify(respone.errors));
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
          
        }
    },
    changePass: async (email, otpCode, newPass) => {
        try {
            const respone = await axiosInstance.post('v1/ForgotPassword/verify', { email, otpCode, newPass });
            if (respone.data.success) {
                toast.success(respone.data.message);
            } else {
                toast.error(respone.data.errMessage || JSON.stringify(respone.errors));
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
         
        }
    },
    register: async (formData) => {
        try {
            const respone = await axiosInstance.post('v1/auth/register', formData);
            if (respone.data.success) {
                toast.success(respone.data.message);
            } else {
                toast.error(respone.data.errMessage || JSON.stringify(respone.errors));
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
       
        }
    },
    getInfor: async () => {
        try {
            const respone = await axiosInstance.get('v1/Auth/infor');
            if (respone.data.success) {
                return respone.data.data;
            } else {
                return null;
                toast.error(respone.data.errMessage || JSON.stringify(respone.errors));
            }
        } catch (err) {
            console.log(err);
            toast.error(err);
         
        }
    },
};
