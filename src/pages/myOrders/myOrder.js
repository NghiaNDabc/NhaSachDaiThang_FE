import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import style from './myorrder.module.scss';
import classNames from 'classnames/bind';
import { getStatusColor } from '../../utils/orderstatusHepler';
import Button from '../../components/button/button';

const cx = classNames.bind(style);
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const { auth } = useAuth();

    useEffect(() => {
        const getOrder = async () => {
            if (auth.user != null) {
                const { data } = await orderService.get(
                    null,
                    null,
                    null,
                    null,
                    null,
                    auth.user.userId,
                    null,
                    null,
                    null,
                );
                setOrders(data);
            }
        };
        getOrder();
    }, [auth]);

    return (
        <div className={cx('container')}>
            <h2 className={cx('header')}>Đơn hàng của tôi ({orders.length})</h2>
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
                                    fontWeight: 'bold',
                                }}
                            >
                                {order.status}
                            </td>
                            <td>
                                <Button
                                    onClick={() => {
                                        window.open(`/resultcheckout?orderId=${order.orderId}&&success=True`, '_blank');
                                    }}
                                >
                                    Xem chi tiết
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyOrders;
