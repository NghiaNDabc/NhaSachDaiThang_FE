import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './resultCheckout.module.scss'; // Đảm bảo rằng bạn đã import SCSS
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import { useFormik } from 'formik';
import { getStatusColor, statusOptions } from '../../utils/orderstatusHepler';
import RequiredStar from '../../components/requiredStar/requiredStar';
const cx = classNames.bind(styles); // Để sử dụng với className

const OrderEditForm = ({ orderData, onClose }) => {
    const [bookDetails, setBookDetails] = useState(orderData.orderDetails);
    // Lưu thông tin chi tiết sách

    const [recipientName, setrecipientName] = useState(orderData.recipientName);
    const [shippingAddress, setshippingAddress] = useState(orderData.shippingAddress);
    const [status, setstatus] = useState(orderData.status);
    const { auth } = useAuth();
    const formik = useFormik({
        initialValues: {
            orderId: orderData.orderId,
            recipientName: recipientName,
            shippingAddress: shippingAddress,
            phone: orderData.phone,
            email: orderData.email,
            paymentMethod: orderData.paymentMethod,
            status: orderData.status, // default to Cash on Delivery
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
            const order = {
                ...values,
                userId,
                modifyBy: name,
                orderDetails: [],
            };
            debugger;
            await orderService.put(order);
            console.log('Order submitted:', order);
            // Thêm API gửi order tại đây
            onClose();
        },
    });
    return (
        <div className={cx('wrapper')}>
            <div
                style={{
                    overflowY: 'auto',
                    height: '850px', // Hoặc chiều cao phù hợp
                }}
                className={cx('container')}
            >
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h1>Sửa đơn hàng: {orderData.orderId}</h1>
                <form onSubmit={formik.handleSubmit}>
                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Tên người nhận: <RequiredStar />
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
                        </label>
                    </div>

                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Địa chỉ nhận hàng:
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
                        </label>
                    </div>

                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Số điện thoại:
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
                        </label>
                    </div>

                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Email:
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
                        </label>
                    </div>
                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Trạng thái đơn hàng:
                            <select
                                style={{
                                    color: getStatusColor(formik.values.status),
                                    fontSize: '20px', // Áp dụng màu dựa trên giá trị hiện tại
                                }}
                                name="status"
                                className={cx('select')}
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        style={{
                                            color: getStatusColor(status),
                                        }}
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <p
                        style={{
                            fontSize: '20px', // Áp dụng màu dựa trên giá trị hiện tại
                        }}
                    >
                        <strong>Tổng số tiền:</strong> {orderData.totalAmount.toLocaleString()} VND
                    </p>
                    <button type="submit" className={cx('button')}>
                        Lưu thông tin
                    </button>
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
                                        <img src={detail.mainImage} alt={detail.title} className={cx('bookImage')} />
                                    </td>
                                    <td>{detail.title}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.price.toLocaleString()} VND</td>
                                    <td>{(detail.quantity * detail.price).toLocaleString()} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    );
};

export default OrderEditForm;
