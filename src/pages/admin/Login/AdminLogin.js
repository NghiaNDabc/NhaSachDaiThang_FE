import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminLogin.module.scss';
import bgImage from '../../../assets/cc.jpg';
import logo from '../../../assets/nhasachdaithang.png';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../components/button/button';
import { authService } from '../../../services/authService';
const cx = classNames.bind(styles);

function AdminLogin() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await authService.login(username, password);

        if (result.success) {
            login(result.token, result.refreshToken);
            window.location.href = '/admin/product'; // Cập nhật trạng thái đăng nhập từ useAuth
        }
    };

    const handleForgotPassword = () => {
        alert('Forgot password feature coming soon!');
    };

    return (
        <div className={cx('overlay')} style={{ backgroundImage: `url(${bgImage})` }}>
            <form onSubmit={handleLogin} className={cx('login-form')}>
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
                            required
                        />
                        <span className={cx('eye-icon')} onClick={() => setShowPassword(!showPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    <Button className={cx('login-button')}>Login</Button>
                </div>

                <div className={cx('footer')}>
                    <Button text href="xxx" className={cx('forgot-password')}>
                        Quên mật khẩu?
                    </Button>
                </div>
            </form>

            {/* ToastContainer cho phép hiển thị thông báo popup */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default AdminLogin;
