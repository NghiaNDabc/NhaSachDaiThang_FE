import React from 'react';
import style from './slidebar.module.scss';
import classNames from 'classnames/bind';
import logo from '../../../assets/nhasachdaithang.png';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const cx = classNames.bind(style);
function Sidebar() {
    return (
        <aside className={cx('sidebar')}>
            <div className={cx('logo')}>
                <div className={cx('img')}>
                    <img src={logo} />
                </div>
                <h3 className={cx('text-logo')}>
                    Nhà sách <br /> Đại Thắng
                </h3>
            </div>
            <nav>
                <ul>
                    <li>
                        <a href="/admin/dashboard">Dashboard</a>
                    </li>
                    <li>
                        <Link to="/admin/product">Bảo trì sách</Link>
                    </li>
                    <li>
                        <Link to="/admin/category">Bảo trì danh mục</Link>
                    </li>
                    <li>
                        <Link to="/admin/language">Ngôn ngữ</Link>
                    </li>
                    <li>
                        <Link to="/admin/bookcovertype">Bìa sách</Link>
                    </li>
                    <li>
                        <Link to="/admin/supplier">Nhà cung cấp</Link>
                    </li>
                    <li>
                        <Link to="/admin/test">Nhập hàng</Link>
                    </li>
                    {/* <li>
                        <a href="/stats">Statistics</a>
                    </li> */}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
