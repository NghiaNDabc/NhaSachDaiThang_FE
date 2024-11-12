import React from 'react';
import Sidebar from './adminSlidebar/slidebar';
import Header from './adminHeader/Header';
import style from './AdminLayout.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(style)
function AdminLayout({ children }) {
    return (
        <div className={cx('admin-layout')}>
            <Sidebar />
            <div className={cx('content')}>
                <Header />
                <main className={cx('main-content')}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
