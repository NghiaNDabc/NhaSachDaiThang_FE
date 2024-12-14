import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { bookService } from '../../services/bookService/bookService';
import classNames from 'classnames/bind';
import style from './adminorder.module.scss';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import Tippy from '@tippyjs/react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import 'tippy.js/dist/tippy.css';
import { orderService } from '../../services/orderService';
import RequiredStar from '../requiredStar/requiredStar';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(style);
function AdminOrderForm() {
    const [books, setBooks] = useState([]);
    const [bookName, setBookName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const handleQuantityChange = (bookId, newQuantity) => {
        setBooks((prevBooks) => {
            const afterBook = prevBooks.map((book) =>
                book.bookId === bookId
                    ? { ...book, soluongmua: Math.max(1, Math.min(newQuantity, book.quantity)) } // thiên biến vạn hóa
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
    };
    const handleBookSelection = (book) => {
        book.soluongmua = 1;
        const priceAfterDiscount =
            book.promotion && new Date(book.promotionEndDate) > new Date()
                ? book.price * (1 - book.promotion / 100)
                : book.price;
        book.priceAfterDiscount = priceAfterDiscount;
        setBooks((prev) => [...prev, book]);
        setTotalAmount((pre) => pre + priceAfterDiscount);
        setBookName(''); // Clear input after selection
        setSuggestions([]); // Clear suggestions after selection
    };
    const handleBookSearch = debounce(async (bookName) => {
        if (!bookName) return;
        try {
            const response = await bookService.getBooks(
                null,
                null,
                bookName,
                null,
                null,
                null,
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
    }, 1000);

    const handleBookNameChange = (event) => {
        const value = event.target.value;
        setBookName(value);
        if (value == null || value == '') setSuggestions([]);
        handleBookSearch(value);
    };

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
            <h1>Thêm đơn hàng mới</h1>
            <div style={{ display: 'flex' }}>
                {/* Bên trái: Danh sách sản phẩm */}
                <div style={{ marginRight: '20px', minWidth: '600px' }}>
                    {/* <h2>Giỏ Hàng</h2> */}
                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Nhập tên sách cần thêm
                            <RequiredStar />
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
                                                        <span style={{ fontSize: '12px', color: '#777' }}>
                                                            {book.author}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                                visible={!!suggestions.length} // Kiểm tra trước khi hiển thị
                                interactive
                                placement="top-start"
                                offset={[0, 10]}
                            >
                                <input
                                    type="text"
                                    value={bookName}
                                    onChange={handleBookNameChange}
                                    className={cx('input')}
                                    required
                                />
                            </Tippy>
                        </label>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th colSpan="2" style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    Sản phẩm
                                </th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Số lượng</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', width: '150px' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books &&
                                books.map((book) => {
                                    return (
                                        <tr key={book.bookId}>
                                            {/* Hình ảnh */}
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        handleDeleteBook(book.bookId);
                                                    }}
                                                    style={{ backgroundColor: 'transparent', color: 'black' }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                                <img
                                                    src={book.mainImage}
                                                    alt={book.title}
                                                    style={{ width: '80px', height: 'auto' }}
                                                />
                                            </td>
                                            {/* Thông tin */}
                                            <td
                                                style={{
                                                    width: '300px',
                                                    wordBreak: 'break-word',
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
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
                                            <td
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                }}
                                            >
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
                                                        handleQuantityChange(book.bookId, parseInt(e.target.value) || 1)
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
                                            </td>
                                            {/* Thành tiền */}
                                            <td style={{ border: '1px solid #ddd', padding: '8px', color: 'red' }}>
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
                                <p className={cx('errorMessage')}>{formik.errors.recipientName}</p>
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
                                <p className={cx('errorMessage')}>{formik.errors.shippingAddress}</p>
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
                                <p className={cx('errorMessage')}>{formik.errors.phone}</p>
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
                                <p className={cx('errorMessage')}>{formik.errors.email}</p>
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
        </>
    );
}

export default AdminOrderForm;
