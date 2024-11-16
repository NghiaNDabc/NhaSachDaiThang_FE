import React from 'react';
import Button from '../../../components/button/button';
import style from './Header.module.scss';
import classNames from 'classnames/bind';
import { authService } from '../../../services/authService';

const cx = classNames.bind(style);

function Header() {
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
    };
    return (
        <header className={cx('header')}>
            <div className={cx('user-info')}>
                <img src={avtlink} alt="User Avatar" className={cx('avatar')} />
                <div className={cx('name')}>
                    {fname} {lname}
                </div>
            </div>
            <Button onClick={async () => await handleLogout()} className={cx('logout-btn')}>
                Đăng xuất
            </Button>
        </header>
    );
}

export default Header;
