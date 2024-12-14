import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import style from './orderbyPhone.module.scss';
import classNames from 'classnames/bind';
import { getStatusColor } from '../../utils/orderstatusHepler';

const cx = classNames.bind(style);

const OrdersByPhoneNumber = () => {
    const [orders, setOrders] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState(''); // State để lưu số điện thoại nhập vào
    const [searching, setSearching] = useState(false); // State để quản lý việc tìm kiếm
    const { auth } = useAuth();

    // Hàm gọi API để tìm kiếm đơn hàng theo số điện thoại
    const getOrdersByPhone = async (phone) => {
        setSearching(true);
        try {
            const { data } = await orderService.get(null, null, null, null, null, null, phone);
            setOrders(data);
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm kiếm đơn hàng:', error);
        }
        setSearching(false);
    };

    // Xử lý sự kiện khi người dùng nhấn nút tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        if (phoneNumber) {
            getOrdersByPhone(phoneNumber);
        } else {
            alert('Vui lòng nhập số điện thoại.');
        }
    };

    return (
        <div className={cx('container')}>
            <h2 className={cx('header')}>Tra cứu đơn hàng</h2>
            <form onSubmit={handleSearch} className={cx('search-form')}>
                <input
                    type="text"
                    style={{
                        fontSize: '16px',
                    }}
                    placeholder="Nhập số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={cx('phone-input')}
                />
                <button type="submit" className={cx('search-button')} disabled={searching}>
                    {searching ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                </button>
            </form>
            {orders && orders.length >= 0 && (
                <>
                    <h3 className={cx('header')}>Đơn hàng của tôi ({orders.length})</h3>
                    <table className={cx('order-table')}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.orderId}>
                                    <td>{index + 1}</td>
                                    <td>{order.orderId}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>{order.totalAmount.toLocaleString()} VND</td>
                                    <td
                                        style={{
                                            color: getStatusColor(order.status),
                                        }}
                                    >
                                        {order.status}
                                    </td>
                                    <td>
                                        <button
                                            className={cx('action-button')}
                                            onClick={() => {
                                                window.open(
                                                    `/resultcheckout?orderId=${order.orderId}&&success=True`,
                                                    '_blank',
                                                );
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default OrdersByPhoneNumber;
