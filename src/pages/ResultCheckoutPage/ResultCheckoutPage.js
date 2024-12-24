import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './resultCheckout.module.scss'; // Đảm bảo rằng bạn đã import SCSS
import { CartContext } from '../../contexts/CartContext';
import Button from '../../components/button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faDollar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { getStatusColor } from '../../utils/orderstatusHepler';
import { serverUrl } from '../../api/axiosInstance';
import Swal from 'sweetalert2';
const cx = classNames.bind(styles); // Để sử dụng với className

const ResultCheckoutPage = () => {
    const [searchParams] = useSearchParams(); // Lấy các tham số trên URL
    const [orderData, setOrderData] = useState(null); // Lưu thông tin đơn hàng
    const [bookDetails, setBookDetails] = useState([]); // Lưu thông tin chi tiết sách
    const [error, setError] = useState(null); // Lưu thông báo lỗi
    const { clear } = useContext(CartContext);
    const [IsOnlinePayted, setIsOnlinePayted] = useState(true);
    const [messageOnlinePayted, setMessageOnlinePayted] = useState('(Đã thanh toán qua VNPay)');
    const [canCancel, setCanCacel] = useState();
    // Lấy tham số từ URL
    const orderId = searchParams.get('orderId');
    const success = searchParams.get('success');
    const { auth } = useAuth();
    // Lấy thông tin đơn hàng
    const thanhtoan = async () => {
        orderService.postVnPayByOrderId(orderId);
    };
    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${serverUrl}/v1/order?orderId=${orderId}`);
            const order = response.data.data;
            if (order.status === 'Chờ thanh toán online') {
                setIsOnlinePayted(false);
                setMessageOnlinePayted('(Chưa thanh toán online)');
            }
            if (
                order.status === 'Chờ thanh toán online' ||
                order.status === 'Chờ xác nhận' ||
                order.status === 'Đã xác nhận' ||
                order.status === 'Đang xử lý'
            ) {
                setCanCacel(true);
            }
            setOrderData(order);

            // Gọi API lấy chi tiết sách dựa trên bookId
            const details = order.orderDetails;
            //  await Promise.all(
            //     order.orderDetails.map(async (detail) => {
            //         const res = await axios.get(`http://localhost:5030/api/v1/Book/active?id=${detail.bookId}`);
            //         const book = res.data.data;
            //         return { ...detail, mainImage: book.mainImage, title: book.title }; // Gộp thông tin sách và orderDetails
            //     }),
            // );
            setBookDetails(details);
        } catch {
            setError('Không thể tải thông tin đơn hàng hoặc chi tiết sách. Vui lòng thử lại.');
        }
    };

    const cancelOrder = async () => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn hủy đơn hàng không?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            cancelButtonText: 'Hủy',
        });
        if (result.isConfirmed) {
            try {
                await orderService.cancel(orderId);
                await fetchOrderDetails(); // Gọi lại hàm fetchOrderDetails sau khi hủy đơn hàng
                setCanCacel(false);
            } catch {
                setError('Hủy đơn hàng không thành công. Vui lòng thử lại.');
            }
        }
    };

    useEffect(() => {
        if (success === 'True') {
            clear();
            fetchOrderDetails();
        } else {
            setError('Đặt hàng không thành công.');
        }
    }, [orderId, success]);

    return (
        <div className={cx('container')}>
            <h1>Thông tin đơn hàng</h1>
            {success === 'True' ? (
                orderData ? (
                    <div>
                        {/* Hiển thị thông báo đặt hàng thành công */}
                        <div className={cx('successMessage')}>
                            <span className={cx('checkIcon')}>✔</span>
                            <span>
                                Đặt hàng thành công{' '}
                                {orderData.paymentMethod == 'vnpay'
                                    ? messageOnlinePayted
                                    : '(Thanh toán khi nhận hàng)'}
                            </span>
                        </div>

                        <h2>Thông tin đơn hàng</h2>
                        <p>
                            <strong>Mã đơn hàng:</strong> {orderData.orderId}
                        </p>
                        <p>
                            <strong>Tên người nhận:</strong> {orderData.recipientName}
                        </p>
                        <p>
                            <strong>Ngày đặt:</strong> {orderData.createdDate}
                        </p>
                        <p>
                            <strong>Số điện thoại :</strong> {orderData.phone}
                        </p>
                        <p>
                            <strong>Email :</strong> {orderData.email}
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong> {orderData.shippingAddress}
                        </p>
                        <p>
                            <strong>Tổng số tiền:</strong> {orderData.totalAmount.toLocaleString()} VND
                        </p>
                        <p>
                            <strong>Phương thức thanh toán:</strong> {orderData.paymentMethod}
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>
                            <span
                                style={{
                                    color: getStatusColor(orderData.status),
                                }}
                            >
                                {orderData.status}
                            </span>
                        </p>

                        <h3>Chi tiết đơn hàng</h3>
                        <table className={cx('orderTable')}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên sách</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                    <th>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookDetails.map((detail, index) => (
                                    <tr key={detail.orderDetailId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={detail.mainImage}
                                                alt={detail.title}
                                                className={cx('bookImage')}
                                            />
                                        </td>
                                        <td>{detail.title}</td>
                                        <td>{detail.quantity}</td>
                                        <td>{detail.price.toLocaleString()} VND</td>
                                        <td>{(detail.quantity * detail.price).toLocaleString()} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Đang tải thông tin đơn hàng...</p>
                )
            ) : (
                <div className={cx('errorMessage')}>
                    <h2>{error}</h2>
                </div>
            )}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {auth.isLoggedIn ? (
                    <>
                        {IsOnlinePayted == false ? (
                            <Button
                                onClick={() => thanhtoan()}
                                leftIcon={<FontAwesomeIcon icon={faDollar} />}
                                variant="add"
                            >
                                Thanh toán
                            </Button>
                        ) : (
                            <div></div>
                        )}
                        {canCancel && (
                            <Button
                                onClick={() => cancelOrder()}
                                leftIcon={<FontAwesomeIcon icon={faCancel} />}
                                variant="delete"
                            >
                                Hủy đơn
                            </Button>
                        )}
                    </>
                ) : (
                    IsOnlinePayted && <div></div>
                )}
            </div>
        </div>
    );
};

export default ResultCheckoutPage;
