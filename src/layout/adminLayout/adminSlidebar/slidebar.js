import React from 'react';
import style from './slidebar.module.scss';
import classNames from 'classnames/bind';
import logo from '../../../assets/nhasachdaithang.png';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaBook,
    FaTag,
    FaLanguage,
    FaBookOpen,
    FaTruck,
    FaUser,
    FaSupple,
    FaIntercom,
    FaCar,
    FaCartArrowDown,
} from 'react-icons/fa'; // Import các icon từ Font Awesome
import Header from '../adminHeader/Header';

const cx = classNames.bind(style);

function Sidebar() {
    const location = useLocation();
    return (
        <aside className={cx('sidebar')}>
            <div className={cx('logo')}>
                <div className={cx('img')}>
                    <img src={logo} alt="Logo" />
                </div>
                <h3 className={cx('text-logo')}>
                    Nhà sách <br /> Đại Thắng
                </h3>
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink
                            to="/admin/dashboard"
                            className={cx('link', { active: location.pathname === '/admin/dashboard' })}
                        >
                            <FaTachometerAlt /> <span>Thống kê</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/product"
                            className={cx('link', { active: location.pathname === '/admin/product' })}
                        >
                            <FaBook /> <span>Quản lý sách</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/category"
                            className={cx('link', { active: location.pathname === '/admin/category' })}
                        >
                            <FaTag /> <span>Quản lý danh mục</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/language"
                            className={cx('link', { active: location.pathname === '/admin/language' })}
                        >
                            <FaLanguage /> <span>Quản lý ngôn ngữ</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/bookcovertype"
                            className={cx('link', { active: location.pathname === '/admin/bookcovertype' })}
                        >
                            <FaBookOpen /> <span>Quản lý bìa sách</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/supplier"
                            className={cx('link', { active: location.pathname === '/admin/supplier' })}
                        >
                            <FaIntercom /> <span>Quản lý nhà cung cấp</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/supplierBook"
                            className={cx('link', { active: location.pathname === '/admin/supplierBook' })}
                        >
                            <FaTruck /> <span>Quản lý nhập hàng</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/user"
                            className={cx('link', { active: location.pathname === '/admin/user' })}
                        >
                            <FaUser /> <span>Quản lý người dùng</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/order"
                            className={cx('link', { active: location.pathname === '/admin/order' })}
                        >
                            <FaCartArrowDown /> <span>Quản lý đơn hàng</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Header />
        </aside>
    );
}

export default Sidebar;
