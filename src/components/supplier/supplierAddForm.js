import 'react-quill/dist/quill.snow.css';
import styles from './supplierFormStyle.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from '../button/button';
import { toast } from 'react-toastify';
import RequiredStar from '../requiredStar/requiredStar';
import { supplierService } from '../../services/supplierService';
import { supplierValidationSchema } from '../../formik/supplierValidationSchema';

const cx = classNames.bind(styles);

function SuplierFormAdd({ onClose, onSuccess }) {
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const supplierData = {
                ...values,
                createdBy: `${user.firstName} ${user.lastName}`,
            };

            const formData = new FormData();
            Object.keys(supplierData).forEach((key) => {
                if (supplierData[key] !== '') formData.append(key, supplierData[key]);
            });

            await supplierService.post(formData);
            toast.success('Thêm nhà cung cấp thành công!');
            onSuccess();
        } catch (error) {
            toast.error('Đã xảy ra lỗi trong quá trình thêm nhà cung cấp.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm nhà cung cấp mới</h2>

                <Formik
                    initialValues={{
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        note: '',
                    }}
                    validationSchema={supplierValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Tên nhà cung cấp <RequiredStar />
                                    <Field type="text" name="name" className={cx('input')} />
                                    <ErrorMessage name="name" component="div" className={cx('error')} />
                                </label>
                                <label className={cx('label')}>
                                    Địa chỉ <RequiredStar />
                                    <Field type="text" name="address" className={cx('input')} />
                                    <ErrorMessage name="address" component="div" className={cx('error')} />
                                </label>
                            </div>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Số điện thoại <RequiredStar />
                                    <Field type="text" name="phone" className={cx('input')} />
                                    <ErrorMessage name="phone" component="div" className={cx('error')} />
                                </label>
                                <label className={cx('label')}>
                                    Email
                                    <Field type="text" name="email" className={cx('input')} />
                                    <ErrorMessage name="email" component="div" className={cx('error')} />
                                </label>
                            </div>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Ghi chú
                                    <ReactQuill
                                        value={''}
                                        onChange={(value) => setFieldValue('note', value)}
                                        className={cx('description-editor')}
                                        theme="snow"
                                    />
                                </label>
                            </div>

                            <br />
                            <Button type="submit" disabled={isSubmitting} className={cx('submit-button')} variant="add">
                                {isSubmitting ? 'Đang xử lý...' : 'Tạo mới'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default SuplierFormAdd;

/*import 'react-quill/dist/quill.snow.css';
import styles from './supplierFormStyle.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from '../button/button';
import { toast } from 'react-toastify';
import RequiredStar from '../requiredStar/requiredStar';
import { supplierService } from '../../services/supplierService';
import { supplierValidationSchema } from '../../formik/supplierValidationSchema';

const cx = classNames.bind(styles);

function SuplierFormAdd({ onClose, onSuccess }) {
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const supplierData = {
                ...values,
                createdBy: `${user.firstName} ${user.lastName}`,
            };

            const formData = new FormData();
            Object.keys(supplierData).forEach((key) => {
                formData.append(key, supplierData[key]);
            });

            await supplierService.post(formData);
            toast.success('Thêm nhà cung cấp thành công!');
            onSuccess();
        } catch (error) {
            toast.error('Đã xảy ra lỗi trong quá trình thêm nhà cung cấp.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm nhà cung cấp mới</h2>

                <Formik
                    initialValues={{
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        note: '',
                    }}
                    validationSchema={supplierValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Tên nhà cung cấp <RequiredStar />
                                    <Field
                                        type="text"
                                        name="name"
                                        className={cx('input')}
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className={cx('error')}
                                    />
                                </label>
                                <label className={cx('label')}>
                                    Địa chỉ <RequiredStar />
                                    <Field
                                        type="text"
                                        name="address"
                                        className={cx('input')}
                                    />
                                    <ErrorMessage
                                        name="address"
                                        component="div"
                                        className={cx('error')}
                                    />
                                </label>
                            </div>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Số điện thoại <RequiredStar />
                                    <Field
                                        type="text"
                                        name="phone"
                                        className={cx('input')}
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className={cx('error')}
                                    />
                                </label>
                                <label className={cx('label')}>
                                    Email
                                    <Field
                                        type="text"
                                        name="email"
                                        className={cx('input')}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className={cx('error')}
                                    />
                                </label>
                            </div>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Ghi chú
                                    <ReactQuill
                                        value={''}
                                        onChange={(value) =>
                                            setFieldValue('note', value)
                                        }
                                        className={cx('description-editor')}
                                        theme="snow"
                                    />
                                </label>
                            </div>
                            <br />
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={cx('submit-button')}
                                variant="add"
                            >
                                {isSubmitting
                                    ? 'Đang xử lý...'
                                    : 'Thêm nhà cung cấp'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default SuplierFormAdd;
*/
