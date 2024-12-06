import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './slideBarUser.module.scss'; // Import CSS module
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function SidebarUser1() {
    const location = useLocation(); // Hook để lấy thông tin đường dẫn hiện tại

    return (
        <div className={cx('sidebar')}>
            <ul>
                <li>
                    <Link
                        to="/myaccount/order"
                        className={cx('link', { active: location.pathname === '/myaccount/order' })}
                    >
                        Đơn hàng của tôi
                    </Link>
                </li>
                <li>
                    <Link
                        to="/myaccount/accountinfo"
                        className={cx('link', { active: location.pathname === '/myaccount/accountinfo' })}
                    >
                        Thông tin tài khoản
                    </Link>
                </li>
                <li>
                    <Link
                        to="/myaccount/changepassword"
                        className={cx('link', { active: location.pathname === '/myaccount/changepassword' })}
                    >
                        Đổi mật khẩu
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default SidebarUser1;
