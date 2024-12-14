import React, { useState } from 'react';
import style from './Header.module.scss';
import classNames from 'classnames/bind';
import { authService } from '../../../services/authService';
import { FaEllipsisV } from 'react-icons/fa'; // Icon ba chấm

const cx = classNames.bind(style);

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Để mở/đóng dropdown

    let user = localStorage.getItem('user');
    let avtlink = '';
    let fname = '';
    let lname = '';
    if (user != '' && user != null && user != 'undefined') {
        user = JSON.parse(user);
        avtlink = user.image;
        fname = user.firstName;
        lname = user.lastName;
    }

    const handleLogout = async () => {
        await authService.logout();
        setIsDropdownOpen(false); // Đóng dropdown khi đăng xuất
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState); // Thay đổi trạng thái dropdown
    };

    return (
        <header className={cx('header')}>
            <div className={cx('user-info')} onClick={toggleDropdown}>
                <img src={avtlink} alt="User Avatar" className={cx('avatar')} />
                <div className={cx('name')}>
                    {fname} {lname}
                </div>
                <FaEllipsisV size={20} /> {/* Nút ba chấm */}
            </div>

            {/* Dropdown menu */}
            <div className={cx('dropdown', { active: isDropdownOpen })}>
                <div
                    className={cx('dropdown-item', '')}
                    onClick={() => {
                        /* Điều hướng đến trang tài khoản */
                    }}
                >
                    Tài khoản
                </div>
                <div className={cx('dropdown-item', 'logout-btn')} onClick={handleLogout}>
                    Đăng xuất
                </div>
            </div>
        </header>
    );
}

export default Header;
