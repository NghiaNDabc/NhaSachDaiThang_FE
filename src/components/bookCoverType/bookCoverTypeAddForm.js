import { useState } from 'react';
import style from './bookCoverTypeFormStyle.module.scss';
import classNames from 'classnames/bind';
import Button from '../button/button';
import { bookCoverTypeService } from '../../services/bookCoverTypeService';
import { bookCoverTypeValidationSchema } from '../../formik/bookCoverTypeValidationSchema ';
import { toast, ToastContainer } from 'react-toastify';
import ToastCustom from '../toast/toastComponent';
import { useFormik } from 'formik';



const cx = classNames.bind(style);

function BookCoverTypeAddForm({ onClose, onAdd }) {
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: bookCoverTypeValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                formData.append(key, values[key]);
            });
            try {
                await bookCoverTypeService.post(formData);
                onAdd();
                resetForm();
            } catch (error) {
                toast.error('Có lỗi xảy ra khi thêm sách.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm bìa sách</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Tên
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cx('input', {
                                    error: formik.touched.name && formik.errors.name,
                                })}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className={cx('error')}>{formik.errors.name}</p>
                            )}
                        </label>
                    </div>
                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className={cx('submit-button')}
                        variant="add"
                    >
                        Thêm
                    </Button>
                </form>
            </div>
           
        </div>
    );
}

export default BookCoverTypeAddForm;
