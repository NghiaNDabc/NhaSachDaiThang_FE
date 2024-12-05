import style from './itemComponent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Button from '../button/button';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(style);
function SupplierBookComponent({ item, onEdit, onDelete }) {
    const [total, setToTal] = useState(0);

    const tinhTongTien = () => {
        let x = item.books.reduce((tongtien, item) => {
            return (tongtien += item.quantity * item.supplyPrice);
        }, 0);
        return x * 1.1;
    };

    useState(() => {
        if (item && item.books) {
            setToTal(tinhTongTien);
        }
    }, [item]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    <div className={cx('id')}>{item.supplierBookId}</div>

                    <div className={cx('name')}>{item.supplierName}</div>
                    <div className={cx('date')}>{formatDate(item.supplyDate)}</div>
                    <div className={cx('total')}>{formatCurrency(total)}</div>
                </div>

                <div className={cx('action')}>
                    <div>
                        <Button
                            variant="edit"
                            leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                            onClick={() => onEdit(item.supplierBookId)}
                        >
                            Xem / in
                        </Button>
                    </div>
                    <div>
                        <Button variant="delete" leftIcon={<FontAwesomeIcon icon={faTrash} />} onClick={onDelete}>
                            Xóa
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SupplierBookComponent;
