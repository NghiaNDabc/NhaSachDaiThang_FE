import { useState } from 'react';
import style from './bookCoverTypeFormStyle.module.scss';
import classNames from 'classnames/bind';
import Button from '../button/button';
import { bookCoverTypeService } from '../../services/bookCoverTypeService';
import { bookCoverTypeValidationSchema } from '../../formik/bookCoverTypeValidationSchema ';
import { toast, ToastContainer } from 'react-toastify';

const cx = classNames.bind(style);

function BookCoverTypeAddForm({ onClose, onAdd }) {
    const [name, setName] = useState();
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        const bookCoverTypeData = {
            name,
        };
        try {
            await bookCoverTypeValidationSchema.validate(bookCoverTypeData, { abortEarly: false });
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
        await bookCoverTypeService.post(formData);
        onAdd();
        setName();
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm bìa sách</h2>
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
                    Thêm 
                </Button>
            </div>
            <ToastContainer
                style={{ zIndex: 100000000 }}
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
            />
        </div>
    );
}

export default BookCoverTypeAddForm;
