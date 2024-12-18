import React, { useCallback, useContext, useEffect, useState } from 'react';
import style from './ClientHeader.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {  faUser } from '@fortawesome/free-regular-svg-icons';
import logo from '../../../assets/nhasachdaithang.png';
import { useClientContext } from '../../../contexts/CientContext';

import { useAuth } from '../../../contexts/AuthContext';
import { CartContext } from '../../../contexts/CartContext';
import Tippy from '@tippyjs/react';
import { bookService } from '../../../services/bookService/bookService';
import { debounce } from '@mui/material';
import { toast } from 'react-toastify';
import menu from '../../../assets/ico_menu.svg';
import dropdown from '../../../assets/icon_seemore_gray.svg';
const cx = classNames.bind(style);

function ClientHeader() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const { categories } = useClientContext();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { cart } = useContext(CartContext);
    const [total, setToTal] = useState(0);
    const [bookName, setBookName] = useState('');
    const [focus, setFocus] = useState(false); // Thêm state focus
    const handleUserIconHover = () => {
        setShowUserMenu(true);
    };
    const handleBookSelection = (book) => {
        // Điều hướng đến trang chi tiết sách
        navigate('/book/' + book.bookId);
    };
    const handleFocus = () => {
        setFocus(true); // Khi focus vào input, cho phép tooltip hiển thị
    };

    const handleBlur = () => {
        // Tự động ẩn tooltip chỉ khi không còn focus và không có tương tác với suggestion
        setTimeout(() => {
            setFocus(false);
        }, 500); // Đợi 100ms để tránh mất focus quá nhanh
    };

    const [suggestions, setSuggestions] = useState([]);

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
                    <li
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/search?categoryId=${sub.categoryId}`);
                        }}
                        key={sub.categoryId}
                    >
                        <span>{sub.name}</span>
                        {/* {sub.subCategories?.length > 0 && renderSubCategories(sub.subCategories)} */}
                    </li>
                ))}
            </ul>
        );
    };

    const handleSearchClick = () => {
        if (bookName.trim()) {
            navigate(`/search?bookName=${encodeURIComponent(bookName)}`);
        } else {
            toast.warning('Vui lòng nhập tên sách để tìm kiếm!');
        }
    };
    const debounceSearch = useCallback(
        debounce(async (value) => {
            if (value.trim() === '') {
                setSuggestions([]);
                return;
            }

            try {
                const response = await bookService.getBooks(
                    null,
                    null,
                    value,
                    null,
                    null,
                    true,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                );
                setSuggestions(response.data || []);
            } catch (error) {
                toast.error('Error fetching book suggestions.');
            }
        }, 1000),
        [], // Tạo hàm debounce chỉ một lần
    );

    const handleBookNameChange = (event) => {
        const value = event.target.value;
        setBookName(value);

        // Gọi debounceSearch với chuỗi mới
        debounceSearch(value);
    };
    return (
        <header className={cx('header')}>
            <div className={cx('container_header')}>
                <Link
                    to={'/'}
                    style={{
                        display: 'block',
                        alignItems: 'center',
                    }}
                >
                    <div className={cx('logo')}>
                        <div className={cx('img')}>
                            <img src={logo} alt="Logo" />
                        </div>
                        <h3 className={cx('text-logo')}>Nhà sách Đại Thắng</h3>
                    </div>
                </Link>
                <div className={cx('category')}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <img src={menu} alt="Danh Mục" style={{ width: '48px', height: '48px', marginRight: '8px' }} />
                        <img
                            src={dropdown}
                            alt="Danh Mục"
                            style={{ width: '28px', height: '28px', marginRight: '8px', marginLeft: '-12px' }}
                        />
                    </div>
                    <div className={cx('category-menu')}>
                        <ul>
                            {categories.map((category) => (
                                <li
                                    onClick={() => navigate(`/search?categoryId=${category.categoryId}`)}
                                    key={category.categoryId}
                                >
                                    <span>{category.name}</span>

                                    {category.subCategories?.length > 0 && renderSubCategories(category.subCategories)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={cx('search')}>
                    <Tippy
                        content={
                            suggestions.length > 0 && (
                                <div className={cx('suggestions')}>
                                    {suggestions.map((book) => (
                                        <div
                                            key={book.bookId}
                                            onClick={() => handleBookSelection(book)}
                                            className={cx('suggestion-item')}
                                        >
                                            <div>
                                                <img
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                    }}
                                                    src={book.mainImage}
                                                    alt={book.title}
                                                />
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: '14px', color: '#333' }}>
                                                    {book.title}
                                                </strong>
                                                <br />
                                                <span style={{ fontSize: '12px', color: '#777' }}>{book.author}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                        visible={focus && !!suggestions.length} // Chỉ hiển thị khi focus và có gợi ý
                        interactive
                        interactiveBorder={10}
                        className={cx('tippy-box')}
                        placement="bottom-start"
                        offset={[0, 5]}
                        theme="light"
                    >
                        <input
                            type="text"
                            placeholder="Cây Cam Ngọt Của Tôi"
                            onChange={handleBookNameChange}
                            onFocus={handleFocus} // Set focus khi input được focus
                            onBlur={handleBlur} // Set focus khi input mất focus
                        />
                    </Tippy>
                    <button onClick={handleSearchClick}>
                        <FontAwesomeIcon className={cx('fa-icon')} icon={faMagnifyingGlass} />
                    </button>
                </div>
                <div className={cx('icon')}>
                    <div
                        className={cx('icon_con', 'user-icon')}
                        onMouseEnter={handleUserIconHover}
                        onMouseLeave={handleUserIconLeave}
                    >
                        <FontAwesomeIcon
                            style={{
                                marginLeft: 'auto',
                                width: '100%',
                            }}
                            className={cx('fa-icon')}
                            icon={faUser}
                        />
                        <br />
                        {auth && auth.user != null ? (
                            <>
                                <span style={{ textAlign: 'left' }}>
                                    {auth.user.firstName + ' ' + auth.user.lastName}
                                </span>
                            </>
                        ) : (
                            <>Tài khoản</>
                        )}

                        {showUserMenu && (
                            <div style={{ width: '170px' }} className={cx('user-menu')}>
                                <Link to="/orderbyphonenumber" className={cx('user-menu-item')}>
                                    Tra cứu đơn hàng
                                </Link>
                                {auth && auth.user ? (
                                    <>
                                        <Link to="/myaccount/order" className={cx('user-menu-item')}>
                                            Tài khoản của tôi
                                        </Link>
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
