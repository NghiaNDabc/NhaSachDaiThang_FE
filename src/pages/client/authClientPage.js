import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classNames from 'classnames/bind';
import styles from './AuthPage.module.scss';
import { authService } from '../../services/authService';
import { mailHelper } from '../../utils/MailHelper';
import { useAuth } from '../../contexts/AuthContext';

const cx = classNames.bind(styles);

function AuthPage({ initialTab = 'login' }) {
    const { login } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab); // 'login', 'register', 'forgotPassword'
    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     const result = await authService.clientLogin(username, password);
    //     if (result.success) {
    //         window.location.href = '/';
    //     }
    // };
    const handleSendMailRegis = async (email) => {
        if (mailHelper.isValid(email)) {
            await authService.sendOtpRegister(email);
        }
    };
    const handleSendMailForgot = async (email) => {
        if (mailHelper.isValid(email)) {
            await authService.sendOtpForgotPass(email);
        }
    };
    // Formik validation schemas
    const validationSchemas = {
        login: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
            password: Yup.string().required('Mật khẩu không được để trống'),
        }),
        register: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
            otp: Yup.string().required('OTP không được để trống'),
            firstName: Yup.string().required('Tên không được để trống'),
            lastName: Yup.string().required('Họ đệm không được để trống'),
            password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
                .required('Bắt buộc xác nhận mật khẩu'),
        }),
        forgotPassword: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
            otp: Yup.string().required('OTP'),
            password: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
                .required('Bắt buộc xác nhận mật khẩu'),
        }),
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            otp: '',
            firstName: '',
            lastName: '',
            confirmPassword: '',
        },
        validationSchema: validationSchemas[activeTab],
        onSubmit: async (values) => {
            try {
                switch (activeTab) {
                    case 'login':
                        const { success, user, token, refreshToken } = await authService.clientLogin(
                            values.email,
                            values.password,
                        );
                        if (success) {
                            debugger
                            login(user, token, refreshToken);
                            window.location.href = '/';
                        }
                        break;
                    case 'register':
                        const formData = new FormData();
                        let registerData = {
                            email: values.email,
                            otp: values.otp,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            password: values.password,
                        };
                        Object.keys(registerData).forEach((key) => {
                            if (registerData[key] !== null && registerData[key] !== '') {
                                formData.append(key, registerData[key]);
                            }
                        });
                        await authService.register(formData);
                        break;
                    case 'forgotPassword':
                        if (mailHelper.isValid(values.email)) {
                            await authService.changePass(values.email, values.otp, values.password);
                        }
                        break;
                    default:
                        return;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi kết nối với server!');
            }
        },
    });

    const renderFormContent = () => {
        switch (activeTab) {
            case 'login':
                return (
                    <>
                        <div className={cx('form-group')}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập email"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <span className={cx('error')}>{formik.errors.email}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập mật khẩu"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <span className={cx('error')}>{formik.errors.password}</span>
                            )}
                        </div>
                        <p
                            style={{
                                cursor: 'pointer',
                                color: 'blue',
                                textDecoration: 'underline',
                                textAlign: 'right',
                            }}
                            className={cx({ active: activeTab === 'forgotPassword' })}
                            onClick={() => setActiveTab('forgotPassword')}
                        >
                            Quên mật khẩu?
                        </p>
                        <br />
                        <button type="submit" className={cx('btn')}>
                            Đăng nhập
                        </button>
                    </>
                );
            case 'register':
                return (
                    <>
                        <div className={cx('form-group', 'otp-row')}>
                            <label>Email</label>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Nhập email"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSendMailRegis(formik.values.email)}
                                    className={cx('otp-btn')}
                                >
                                    Gửi OTP
                                </button>
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <span className={cx('error')}>{formik.errors.email}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>OTP</label>
                            <input
                                type="text"
                                name="otp"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập OTP"
                            />
                            {formik.touched.otp && formik.errors.otp && (
                                <span className={cx('error')}>{formik.errors.otp}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Họ đệm</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập họ đệm"
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <span className={cx('error')}>{formik.errors.lastName}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Tên</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập tên"
                            />
                            {formik.touched.firstName && formik.errors.firstName && (
                                <span className={cx('error')}>{formik.errors.firstName}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập mật khẩu"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <span className={cx('error')}>{formik.errors.password}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Xác nhận mật khẩu"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <span className={cx('error')}>{formik.errors.confirmPassword}</span>
                            )}
                        </div>
                        <button type="submit" className={cx('btn')}>
                            Đăng ký
                        </button>
                    </>
                );
            case 'forgotPassword':
                return (
                    <>
                        <div className={cx('form-group', 'otp-row')}>
                            <label>Email</label>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Nhập email"
                                />
                                <button
                                    onClick={() => handleSendMailForgot(formik.values.email)}
                                    type="button"
                                    className={cx('otp-btn')}
                                >
                                    Gửi OTP
                                </button>
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <span className={cx('error')}>{formik.errors.email}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>OTP</label>
                            <input
                                type="text"
                                name="otp"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập OTP"
                            />
                            {formik.touched.otp && formik.errors.otp && (
                                <span className={cx('error')}>{formik.errors.otp}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Nhập mật khẩu mới"
                            />
                            {formik.touched.password && formik.errors.password && (
                                <span className={cx('error')}>{formik.errors.password}</span>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Xác nhận mật khẩu mới"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <span className={cx('error')}>{formik.errors.confirmPassword}</span>
                            )}
                        </div>
                        <button type="submit" className={cx('btn')}>
                            Lấy lại mật khẩu
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cx('auth-form')}>
            <div className={cx('tabs')}>
                <button className={cx({ active: activeTab === 'login' })} onClick={() => setActiveTab('login')}>
                    Đăng nhập
                </button>
                <button className={cx({ active: activeTab === 'register' })} onClick={() => setActiveTab('register')}>
                    Đăng ký
                </button>
            </div>
            <form onSubmit={formik.handleSubmit}>{renderFormContent()}</form>
        </div>
    );
}

export default AuthPage;