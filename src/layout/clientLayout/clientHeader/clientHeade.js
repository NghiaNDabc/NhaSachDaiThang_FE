import React, { useContext, useEffect, useState } from 'react';
import style from './ClientHeader.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretDown, faCartPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import logo from '../../../assets/nhasachdaithang.png';
import { useClientContext } from '../../../contexts/CientContext';
import ClientSlideBar from './clientSideBar/clientSlidebar';
import { useAuth } from '../../../contexts/AuthContext';
import { CartContext } from '../../../contexts/CartContext';

const cx = classNames.bind(style);

function ClientHeader() {
    const { auth, logout } = useAuth();
    const { categories } = useClientContext();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { cart } = useContext(CartContext);
    const [total, setToTal] = useState(0);
    const handleUserIconHover = () => {
        setShowUserMenu(true);
    };
    useEffect(() => {
        setToTal(cart.length);
    }, [cart]);
    const handleUserIconLeave = () => {
        setShowUserMenu(false);
    };

    const renderSubCategories = (subCategories) => {
        return (
            <ul className={cx('sub-menu')}>
                {subCategories.map((sub) => (
                    <li key={sub.categoryId}>
                        <Link to={`/category/${sub.categoryId}`}>
                            <span>{sub.name}</span>
                        </Link>
                        {sub.subCategories?.length > 0 && renderSubCategories(sub.subCategories)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <header className={cx('header')}>
            <div className={cx('container_header')}>
                <div className={cx('logo')}>
                    <div className={cx('img')}>
                        <img src={logo} alt="Logo" />
                    </div>
                    <h3 className={cx('text-logo')}>
                        Nhà sách <br /> Đại Thắng
                    </h3>
                </div>
                <div className={cx('category')}>
                    <FontAwesomeIcon className={cx('category-icon')} icon={faBars} />
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>Danh Mục</span>
                    <FontAwesomeIcon icon={faCaretDown} />
                    <div className={cx('category-menu')}>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.categoryId}>
                                    <Link to={`/category/${category.categoryId}`}>
                                        <span>{category.name}</span>
                                    </Link>

                                    {category.subCategories?.length > 0 && renderSubCategories(category.subCategories)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={cx('search')}>
                    <input type="text" placeholder="Harry Potter" />
                    <button>
                        <FontAwesomeIcon className={cx('fa-icon')} icon={faMagnifyingGlass} />
                    </button>
                </div>
                <div
                    style={{
                        height: '68px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    className={cx('icon')}
                >
                    <div
                        className={cx('icon_con', 'user-icon')}
                        style={{ textAlign: 'center' }}
                        onMouseEnter={handleUserIconHover}
                        onMouseLeave={handleUserIconLeave}
                    >
                        <FontAwesomeIcon className={cx('fa-icon')} icon={faUser} />
                        <br />
                        {auth && auth.user != null ? (
                            <>
                                <span>{auth.user.firstName}</span>
                            </>
                        ) : (
                            <>Tài khoản</>
                        )}

                        {showUserMenu && (
                            <div style={{ width: '170px' }} className={cx('user-menu')}>
                                {auth && auth.user ? (
                                    <>
                                        <button style={{ width: '100%' }} onClick={logout}>
                                            Đăng xuất
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/auth" className={cx('user-menu-item')}>
                                        Đăng nhập / Đăng ký
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={cx('icon_con')}>
                        <FontAwesomeIcon className={cx('fa-icon')} icon={faCartPlus} />
                    </div>
                    <div
                        onClick={() => {
                            window.location.href = '/cart';
                        }}
                        className={cx('icon_con')}
                    >
                        <strong>GIỎ HÀNG</strong>
                        <p>{total} sản phẩm</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ClientHeader;
