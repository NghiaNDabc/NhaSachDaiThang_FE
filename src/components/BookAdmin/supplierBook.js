import { useState } from 'react';
import style from '../bookForm/BookForm2.module.scss';
import classNames from 'classnames/bind';
import Button from '../button/button';
import RequiredStar from '../requiredStar/requiredStar';
import { useCategories } from '../../contexts/CategoryContext';
import ReactQuill from 'react-quill';
import { supplierBooksService } from '../../services/supplierBookService';
import React from 'react';
import { supplierBookValidationSchema } from '../../formik/supplierBookValidationSchema';
import { toast } from 'react-toastify';
const cx = classNames.bind(style);

function SupplierBookForm({ onClose, book }) {
    const [title, setName] = useState(book.title);
    const [bookID, setBookID] = useState(book.bookId);
    const [supplyPrice, setSupplyPrice] = useState();
    const [supplierId, setSupplierId] = useState('');
    const [quanlity, setquanlity] = useState();
    const [note, setNote] = useState();
    const [supplyDate, setSupplyDate] = useState(Date.now());
    const { suppliers } = useCategories();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        let supplierBookData = {
            bookID,
            supplierId,
            supplyPrice,
            quanlity,
            supplyDate,
        };
        if (note)
            supplierBookData = {
                note,
                ...supplierBookData,
            };
        // try {
        //     await supplierBookValidationSchema.validate(supplierBookData, { abortEarly: false });
        // } catch (err) {
        //     // Hiển thị lỗi validate
        //     if (err.inner) {
        //         err.inner.forEach((validationError) => {
        //             toast.error(validationError.message);
        //         });
        //     } else {
        //         console.log(err);
        //         toast.error('Có lỗi xảy ra khi thêm sách');
        //     }
        //     return;
        // }
        Object.keys(supplierBookData).forEach((key) => {
            formData.append(key, supplierBookData[key]);
        });
        await supplierBooksService.post(formData);
    };
    const renderSupplier = (suppliers) => {
        return suppliers.map((supplier) => (
            <React.Fragment key={supplier.supplierId}>
                <option value={supplier.supplierId}>{`${supplier.name}`}</option>
            </React.Fragment>
        ));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Nhập sách</h2>
                <h4>
                    {bookID}: {title}
                </h4>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Nhà cung cấp
                        <RequiredStar />
                        <select
                            value={supplierId}
                            onChange={(e) => {
                                setSupplierId(e.target.value);
                            }}
                            className={cx('input')}
                        >
                            <option value="">Chọn nhà cung cấp</option>
                            {renderSupplier(suppliers)}
                        </select>
                    </label>
                    <label className={cx('label')}>
                        Ngày nhập
                        <RequiredStar />
                        <input
                            type="date"
                            value={supplyDate}
                            onChange={(e) => setSupplyDate(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                </div>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Số lượng
                        <RequiredStar />
                        <input
                            type="text"
                            value={quanlity}
                            onChange={(e) => setquanlity(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Giá
                        <RequiredStar />
                        <input
                            type="text"
                            value={supplyPrice}
                            onChange={(e) => setSupplyPrice(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                </div>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Ghi chú:
                        <ReactQuill value={note} onChange={setNote} className={cx('description-editor')} theme="snow" />
                    </label>
                </div>
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Nhập sách
                </Button>
            </div>
        </div>
    );
}

export default SupplierBookForm;
