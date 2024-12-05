import React from 'react';
import style from './ClientLayout.module.scss';
import classNames from 'classnames/bind';
import ClientSlideBar from './clientHeader/clientSideBar/clientSlidebar';
import ClientHeader from './clientHeader/clientHeade';
import Banner from '../banner/banner';
import AuthPage from '../../pages/client/authClientPage';
import ClientFooter from './clientFooter/clientFooter';
const cx = classNames.bind(style);
function ClientLayout({ children }) {
    return (
        <>
            <div className={cx('admin-layout')}>
                <div style={{ width: '250px' }}>{/* <ClientSlideBar /> */}</div>
                <div className={cx('content')}>
                    <ClientHeader />

                    <div className={cx('main-content')}>{children}</div>
                </div>
                <div style={{ width: '250px' }}></div>
            </div>
            <ClientFooter />
        </>
    );
}

export default ClientLayout;
