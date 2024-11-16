import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faKey, faEye, faEyeSlash, faShield } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminLogin.module.scss';
import bgImage from '../../../assets/cc.jpg';
import logo from '../../../assets/nhasachdaithang.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../components/button/button';
import { authService } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mailHelper } from '../../../utils/MailHelper';
const cx = classNames.bind(styles);

function AdminLogin() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [newPass, setNewPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [timer, setTimer] = useState(60);

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await authService.login(username, password);
        if (result.success) {
            window.location.href = '/admin/product';
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();

        if (newPass !== confirmPassword) {
            toast.error('Mật khẩu không khớp');
            return;
        }

        if (mailHelper.isValid(email)) {
            // Start cooldown
            await authService.changePass(email, otpCode, newPass);
            setIsCooldown(true);
            setTimer(30);

            // After 60 seconds, reset the cooldown
            setTimeout(() => {
                setIsCooldown(false);
            }, 30000); // 60 seconds cooldown
        } else {
            toast.error('Địa chỉ email không hợp lệ');
        }
    };

    const handleSendClick = async () => {
        if (mailHelper.isValid(email)) {
            // Start cooldown
            await authService.sendOtpForgotPass(email);
            setIsCooldown(true);
            setTimer(30);

            // After 60 seconds, reset the cooldown
            setTimeout(() => {
                setIsCooldown(false);
            }, 30000); // 60 seconds cooldown
        } else {
            toast.error('Địa chỉ email không hợp lệ');
        }
    };

    useEffect(() => {
        if (isCooldown && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isCooldown, timer]);

    return (
        <div className={cx('overlay')} style={{ backgroundImage: `url(${bgImage})` }}>
            {!isForgotPassword ? (
                <form onSubmit={handleLogin} className={cx('login-form')} autoComplete="on">
                    <header className={cx('head-form')}>
                        <div className={cx('title')}>
                            <img src={logo} className={cx('logo')} width="100" />
                            <h1>Nhà sách Đại Thắng</h1>
                        </div>
                    </header>

                    <div className={cx('field-set')}>
                        <div className={cx('input-group')}>
                            <span className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faUserCircle} />
                            </span>
                            <input
                                className={cx('form-input')}
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className={cx('input-group')}>
                            <span className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                            <input
                                className={cx('form-input')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <span className={cx('eye-icon')} onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <Button className={cx('login-button')}>Login</Button>
                    </div>

                    <div className={cx('footer')}>
                        <Button
                            onClick={() => setIsForgotPassword(true)}
                            // href="javascript:void(0)"
                            className={cx('forgot-password')}
                        >
                            Quên mật khẩu?
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleForgotPasswordSubmit} className={cx('login-form')} autoComplete="on">
                    <header className={cx('head-form')}>
                        <div className={cx('title')}>
                            <img src={logo} className={cx('logo')} width="100" />
                            <h1>Nhà sách Đại Thắng</h1>
                        </div>
                    </header>

                    <div className={cx('field-set')}>
                        <div className={cx('input-group')}>
                            <span className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faUserCircle} />
                            </span>
                            <input
                                className={cx('form-input')}
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={cx('send-button')}
                                onClick={handleSendClick}
                                disabled={isCooldown}
                            >
                                {isCooldown ? ` ${timer}s` : 'Gửi'}
                            </button>
                        </div>
                        <div className={cx('input-group')}>
                            <span className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faShield} />
                            </span>
                            <input
                                className={cx('form-input')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="OTP"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className={cx('input-group')}>
                            <span className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                            <input
                                className={cx('form-input')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New Password"
                                value={newPass}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <span className={cx('eye-icon')} onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        <div className={cx('input-group')}>
                            <span className={cx('input-icon')}>
                                <FontAwesomeIcon icon={faKey} />
                            </span>
                            <input
                                className={cx('form-input')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className={cx('eye-icon')} onClick={() => setShowPassword(!showPassword)}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        <Button className={cx('login-button')}>Đổi mật khẩu</Button>
                    </div>

                    <div className={cx('footer')}>
                        <Button
                            onClick={() => setIsForgotPassword(false)}
                            // href="javascript:void(0)"
                            className={cx('back-login')}
                        >
                            Quay trở lại đăng nhập
                        </Button>
                    </div>
                </form>
            )}

            {/* ToastContainer for displaying popup notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            {/* <ToastContainer
                style={{ zIndex: 100000000 }}
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
            /> */}
        </div>
    );
}

export default AdminLogin;
