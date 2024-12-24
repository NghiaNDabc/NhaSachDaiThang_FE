import React, { useEffect, useState } from 'react';
import { orderService } from '../../../services/orderService';
import { useAuth } from '../../../contexts/AuthContext';
import style from './ordermanagement.module.scss';
import classNames from 'classnames/bind';
import Button from '../../../components/button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { canEdit, getStatusColor, statusOptions } from '../../../utils/orderstatusHepler';
import OrderEditForm from '../../ResultCheckoutPage/OrderEditForm';
import ToastCustom from '../../../components/toast/toastComponent';
const cx = classNames.bind(style);

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState(''); // State để lưu số điện thoại nhập vào
    const [minOrderDate, setminOrderDate] = useState();
    const [maxOrderDate, setmaxOrderDate] = useState();
    const [searching, setSearching] = useState(false); // State để quản lý việc tìm kiếm
    const [status, setStatus] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [countItem, setCountItem] = useState();
    const [totalPages, settotalPages] = useState();
    const [editId, setEitId] = useState(0);

    const { auth } = useAuth();
    // const statuses = [
    //     'Chờ thanh toán online',
    //     'Chờ xử lý',
    //     'Đã xác nhận',
    //     'Đang xử lý',
    //     'Đang giao',
    //     'Đã giao đến',
    //     'Đã hủy',
    //     'Đã trả lại',
    //     'Đổi trả',
    //     'Hoàn tất',
    // ];
    const statuses = statusOptions;
    const handlePagesizeChange = (page) => {
        const x = Math.ceil(countItem / page);
        if (x < pageNumber) {
            setPageNumber(x);
        }
        setPageSize(page);
    };
    const handlePagenumberChange = (page) => {
        setPageNumber(page);
    };
    // Hàm gọi API để tìm kiếm đơn hàng theo số điện thoại
    const getOrder = async () => {
        setSearching(true);
        try {
            debugger;
            const { data, count } = await orderService.get2(
                null,
                minOrderDate,
                maxOrderDate,
                null,
                null,
                status,
                null,
                phoneNumber,
                pageNumber,
                pageSize,
            );
            setOrders(data);
            setCountItem(count);
            settotalPages(Math.ceil(count / pageSize));
        } catch (error) {
            console.error('Có lỗi xảy ra khi tìm kiếm đơn hàng:', error);
        }
        setSearching(false);
    };
    useEffect(() => {
        getOrder();
    }, [pageNumber, pageSize]);

    // Xử lý sự kiện khi người dùng nhấn nút tìm kiếm
    const handleSearch = () => {
        getOrder();
    };

    return (
        <div className={cx('')}>
            <div className={cx('filters')}>
                <div className={cx('row')}>
                    <Select
                        isClearable
                        className={cx('select')}
                        options={statuses.map((s) => ({ value: s, label: s }))}
                        placeholder="Trạng thái"
                        onChange={(option) => setStatus(option?.value || null)}
                    />
                    <input
                        className={cx('input')}
                        type="text"
                        placeholder="Số điện thoại"
                        value={phoneNumber || ''}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    Ngày bắt đầu
                    <input
                        className={cx('input')}
                        type="date"
                        placeholder="Từ"
                        value={minOrderDate || ''}
                        onChange={(e) => setminOrderDate(e.target.value)}
                    />
                    Ngày kết thúc
                    <input
                        className={cx('input')}
                        type="date"
                        placeholder="Đến"
                        value={maxOrderDate}
                        onChange={(e) => setmaxOrderDate(e.target.value)}
                    />
                </div>
                <div className={cx('row')}>
                    <div>
                        <Button onClick={() => handleSearch()} leftIcon={<FontAwesomeIcon icon={faSearch} />}>
                            {searching ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={() => window.open('order/add', '_blank')}
                            variant="add"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Thêm đơn hàng mới
                        </Button>
                    </div>
                </div>
            </div>
            {orders && orders.length >= 0 && (
                <>
                    <table className={cx('order-table')}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <>
                                    {editId == order.orderId && (
                                        <OrderEditForm
                                            orderData={order}
                                            onClose={() => {
                                                // setLanguageList([]);
                                                // setRefresh((prev) => prev + 1);
                                                getOrder();
                                                setEitId(0);
                                            }}
                                        />
                                    )}
                                    <tr key={order.orderId}>
                                        <td>{index + 1}</td>
                                        <td>{order.orderId}</td>
                                        <td>{order.createdDate}</td>
                                        <td>{order.totalAmount.toLocaleString()} ₫</td>
                                        <td>{order.paymentMethod}</td>
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
                                                leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                                                disabled={!canEdit(order.status)}
                                                onClick={() => setEitId(order.orderId)}
                                                variant="edit"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    window.open(
                                                        `/resultcheckout?orderId=${order.orderId}&&success=True`,
                                                        '_blank',
                                                    );
                                                }}
                                            >
                                                Xem chi tiết
                                            </Button>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <div className={cx('pagination')}>
                <div>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePagenumberChange(index + 1)}
                            className={cx(pageNumber === index + 1 ? 'active' : '')}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div>
                    <select value={pageSize} onChange={(e) => handlePagesizeChange(e.target.value)}>
                        <option value={12}>12</option>
                        <option value={15}>15</option>
                        <option value={18}>18</option>
                        <option value={20}>20</option>
                        <option value={23}>23</option>
                    </select>
                </div>
            </div>
            <ToastCustom />
        </div>
    );
};

export default OrdersManagement;
