import { useState } from 'react';
import style from './bookCoverTypeFormStyle.module.scss';
import classNames from 'classnames/bind';
import Button from '../button/button';
import { bookCoverTypeService } from '../../services/bookCoverTypeService';
import { categoryValidationSchema } from '../../formik/categoryValidationSchema';
import { toast, ToastContainer } from 'react-toastify';

const cx = classNames.bind(style);

function BookCoverTypeEditForm({ item, onClose }) {
    const [bookCoverType, setLanguage] = useState(item);
    const [name, setName] = useState(bookCoverType.name);
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const bookCoverTypeData = {
            bookCoverTypeId: bookCoverType.bookCoverTypeId,
            name,
        };
        try {
            await categoryValidationSchema.validate(bookCoverTypeData, { abortEarly: false });
        } catch (err) {
            // Hiển thị lỗi validate
            if (err.inner) {
                err.inner.forEach((validationError) => {
                    toast.error(validationError.message);
                });
            } else {
                toast.error('Có lỗi xảy ra khi thêm sách');
            }
            return;
        }
        Object.keys(bookCoverTypeData).forEach((key) => {
            formData.append(key, bookCoverTypeData[key]);
        });
        await bookCoverTypeService.put(formData);
        onClose();
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={() => onClose()} className={cx('close-button')}>
                    X
                </button>
                <h2> Sửa bìa sách</h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                </div>
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Sửa
                </Button>
            </div>
        </div>
    );
}

export default BookCoverTypeEditForm;
