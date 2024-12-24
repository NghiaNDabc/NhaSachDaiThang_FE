import React, { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CartContext } from '../../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './cartAndOrder.module.scss';
import { orderService } from '../../services/orderService';
import { serverUrl } from '../../api/axiosInstance';

const cx = classNames.bind(styles);
const CartPage = () => {
    const { cart, editCart, deleteBookInCart } = useContext(CartContext); // Cart chỉ chứa { id, quantity }
    const [books, setBooks] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleQuantityChange = (bookId, newQuantity) => {
        setBooks((prevBooks) => {
            // const afterBook = prevBooks.map((book) =>
            //     book.bookId === bookId
            //         ? { ...book, soluongmua: Math.max(1, Math.min(newQuantity, book.quantity)) } // thiên biến vạn hóa
            //         : book,
            // );
            const afterBook = prevBooks.map((book) =>
                book.bookId === bookId
                    ? { ...book, soluongmua: Math.max(1, newQuantity) } // thiên biến vạn hóa
                    : book,
            );
            const total = afterBook.reduce((sum, book) => {
                const priceAfterDiscount =
                    book.promotion && new Date(book.promotionEndDate) > new Date()
                        ? book.price * (1 - book.promotion / 100)
                        : book.price;
                return sum + priceAfterDiscount * book.soluongmua;
            }, 0);
            setTotalAmount(total);
            return afterBook;
        });
        editCart(bookId, newQuantity);
    };
    const handleDeleteBook = (bookId) => {
        setBooks((prevBooks) => {
            const afterBook = prevBooks.filter((item) => item.bookId !== bookId);
            const total = afterBook.reduce((sum, book) => {
                const priceAfterDiscount =
                    book.promotion && new Date(book.promotionEndDate) > new Date()
                        ? book.price * (1 - book.promotion / 100)
                        : book.price;
                return sum + priceAfterDiscount * book.soluongmua;
            }, 0);
            setTotalAmount(total);
            return afterBook;
        });
        deleteBookInCart(bookId);
    };

    // Fetch dữ liệu sách dựa trên cart
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const fetchedBooks = await Promise.all(
                    cart.map(async (item) => {
                        const response = await fetch(`${serverUrl}/v1/Book/active?id=${item.id}`);
                        const json = await response.json(); // Lấy JSON từ response
                        const book = json.data;
                        const priceAfterDiscount =
                            book.promotion && new Date(book.promotionEndDate) > new Date()
                                ? book.price * (1 - book.promotion / 100)
                                : book.price;
                        return { ...book, soluongmua: item.quantity, priceAfterDiscount };
                    }),
                );

                // Tính tổng tiền
                const total = fetchedBooks.reduce((sum, book) => {
                    const priceAfterDiscount =
                        book.promotion && new Date(book.promotionEndDate) > new Date()
                            ? book.price * (1 - book.promotion / 100)
                            : book.price;
                    return sum + priceAfterDiscount * book.soluongmua;
                }, 0);

                setBooks(fetchedBooks);
                debugger;
                setTotalAmount(total);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        if (cart.length > 0) {
            fetchBooks();
        } else {
            setBooks([]);
            setTotalAmount(0);
        }
    }, []);

    // Formik Configuration
    const formik = useFormik({
        initialValues: {
            recipientName: '',
            shippingAddress: '',
            phone: '',
            email: '',
            paymentMethod: 'cod', // default to Cash on Delivery
        },
        validationSchema: Yup.object({
            recipientName: Yup.string().required('Tên người nhận là bắt buộc.'),
            shippingAddress: Yup.string().required('Địa chỉ nhận hàng là bắt buộc.'),
            phone: Yup.string()
                .matches(/^[0-9]+$/, 'Số điện thoại chỉ chứa số.')
                .min(10, 'Số điện thoại phải có ít nhất 10 chữ số.')
                .required('Số điện thoại là bắt buộc.'),
            email: Yup.string().email('Email không hợp lệ.'),
        }),
        onSubmit: async (values) => {
            const user = localStorage.getItem('user');
            let name = 'guest';
            let userId = null;
            if (user) {
                const x = JSON.parse(user);
                userId = x.userId;
                name = x.firstName + ' ' + x.lastName;
            }
            const orderDetails = books.map((book) => ({
                bookId: book.bookId,
                quantity: book.soluongmua,
                price: book.priceAfterDiscount,
            }));
            const order = {
                ...values,
                userId,
                totalAmount,
                status: 'Chờ xác nhận',
                createdDate: new Date(),
                createdBy: name,
                orderDetails,
            };
            switch (values.paymentMethod) {
                case 'cod':
                    await orderService.post(order);
                    break;
                case 'vnpay':
                    order.status = 'Chờ thanh toán online';
                    await orderService.postVnPay(order);
                    break;
            }
            console.log('Order submitted:', order);
            // Thêm API gửi order tại đây
        },
    });

    return (
        <>
            {cart && cart.length > 0 ? (
                <div style={{ display: 'flex' }}>
                    {/* Bên trái: Danh sách sản phẩm */}
                    <div style={{ marginRight: '20px' }}>
                        {/* <h2>Giỏ Hàng</h2> */}
                        <table className={cx('book-order-table')}>
                            <thead>
                                <tr>
                                    <th colSpan="2">Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th style={{ width: '150px' }}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => {
                                    return (
                                        <tr key={book.bookId}>
                                            {/* Hình ảnh */}
                                            <td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                    }}
                                                >
                                                    <button
                                                        className={cx('del-btn')}
                                                        onClick={() => {
                                                            handleDeleteBook(book.bookId);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <img
                                                        src={book.mainImage}
                                                        alt={book.title}
                                                        style={{ width: '80px', height: 'auto' }}
                                                    />
                                                </div>
                                            </td>
                                            {/* Thông tin */}
                                            <td
                                                style={{
                                                    width: '300px',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                <h4>
                                                    <b>{book.title}</b>
                                                </h4>
                                                <p>Tác giả: {book.author}</p>
                                                <p>
                                                    Giá:{' '}
                                                    <span>
                                                        {book.price != book.priceAfterDiscount
                                                            ? book.priceAfterDiscount.toLocaleString()
                                                            : book.price.toLocaleString()}
                                                        ₫
                                                    </span>{' '}
                                                    <del>
                                                        <i>
                                                            {book.price != book.priceAfterDiscount
                                                                ? book.price.toLocaleString() + '₫'
                                                                : ''}
                                                        </i>
                                                    </del>
                                                </p>
                                            </td>
                                            {/* Số lượng */}
                                            <td>
                                                <div className={cx('wrap-btn-quantity')}>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(book.bookId, book.soluongmua - 1)
                                                        }
                                                        disabled={book.soluongmua <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        onChange={(e) =>
                                                            handleQuantityChange(
                                                                book.bookId,
                                                                parseInt(e.target.value) || 1,
                                                            )
                                                        }
                                                        style={{ width: '30px' }}
                                                        value={book.soluongmua}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(book.bookId, book.soluongmua + 1)
                                                        }
                                                        disabled={book.soluongmua >= book.quantity}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            {/* Thành tiền */}
                                            <td className="gia-tien-red">
                                                {(book.priceAfterDiscount * book.soluongmua).toLocaleString()}₫
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <h3 style={{ textAlign: 'right', marginTop: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                            Tổng tiền: {totalAmount.toLocaleString()}₫
                        </h3>
                    </div>

                    {/* Bên phải: Form đặt hàng */}
                    <div className={cx('container')}>
                        <h2 className={cx('title')}>Thông Tin Đặt Hàng</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={cx('formGroup')}>
                                <label className={cx('label')}>Tên người nhận:</label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    className={cx('input')}
                                    value={formik.values.recipientName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.recipientName && formik.errors.recipientName && (
                                    <p className={cx('error')}>{formik.errors.recipientName}</p>
                                )}
                            </div>

                            <div className={cx('formGroup')}>
                                <label className={cx('label')}>Địa chỉ nhận hàng:</label>
                                <input
                                    type="text"
                                    name="shippingAddress"
                                    className={cx('input')}
                                    value={formik.values.shippingAddress}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                                    <p className={cx('error')}>{formik.errors.shippingAddress}</p>
                                )}
                            </div>

                            <div className={cx('formGroup')}>
                                <label className={cx('label')}>Số điện thoại:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={cx('input')}
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p className={cx('error')}>{formik.errors.phone}</p>
                                )}
                            </div>

                            <div className={cx('formGroup')}>
                                <label className={cx('label')}>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    className={cx('input')}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className={cx('error')}>{formik.errors.email}</p>
                                )}
                            </div>

                            <div className={cx('formGroup')}>
                                <label className={cx('label')}>Phương thức thanh toán:</label>
                                <div className={cx('radioGroup')}>
                                    <div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            className={cx('radio')}
                                            checked={formik.values.paymentMethod === 'cod'}
                                            onChange={formik.handleChange}
                                        />
                                        <label>Thanh toán khi nhận hàng</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="vnpay"
                                            className={cx('radio')}
                                            checked={formik.values.paymentMethod === 'vnpay'}
                                            onChange={formik.handleChange}
                                        />
                                        <label>Thanh toán VNPay</label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className={cx('button')}>
                                Đặt hàng
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        height: '500px',
                        fontSize: '30px',
                        fontWeight: 'bold',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    Bạn không có sản phẩm nào trong giỏ hàng
                </div>
            )}
        </>
    );
};

export default CartPage;
