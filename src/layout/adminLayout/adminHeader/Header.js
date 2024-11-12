import React from 'react';
import Button from '../../../components/button/button';
import style from './Header.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function Header() {
    const avtlink = localStorage.getItem('avt');
    const fname = localStorage.getItem('fistName');
    const lname = localStorage.getItem('lastName');

    return (
        <header className={cx('header')}>
            <div className={cx('user-info')}>
                <img src={avtlink} alt="User Avatar" className={cx('avatar')} />
                <div className={cx('name')}>
                    {fname} {lname}
                </div>
            </div>
            <Button className={cx('logout-btn')}>Đăng xuất</Button>
        </header>
    );
}

export default Header;
