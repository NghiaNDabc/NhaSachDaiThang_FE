import 'react-quill/dist/quill.snow.css';
import styles from './supplierFormStyle.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from '../button/button';
import { toast } from 'react-toastify';
import { supplierService } from '../../services/supplierService';
import { supplierValidationSchema } from '../../formik/supplierValidationSchema';
import RequiredStar from '../requiredStar/requiredStar';

const cx = classNames.bind(styles);

function SupplierEditForm({ item, onClose }) {
    const handleSubmit = async (values) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();

        const supplierData = {
            supplierId: item.supplierId,
            name: values.name,
            phone: values.phone,
            email: values.email || '',
            address: values.address,
            note: values.note || '',
            createdBy: `${user.firstName} ${user.lastName}`,
        };

        Object.keys(supplierData).forEach((key) => {
            formData.append(key, supplierData[key]);
        });

        try {
            await supplierService.put(formData);
            toast.success('Sửa nhà cung cấp thành công!');
            onClose();
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>

                <h2>Sửa nhà cung cấp</h2>
                <Formik
                    initialValues={{
                        name: item.name,
                        phone: item.phone,
                        email: item.email || '',
                        address: item.address,
                        note: item.note || '',
                    }}
                    validationSchema={supplierValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Tên nhà cung cấp <RequiredStar />
                                    <Field name="name" type="text" className={cx('input')} />
                                    <ErrorMessage name="name" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Địa chỉ <RequiredStar />
                                    <Field name="address" type="text" className={cx('input')} />
                                    <ErrorMessage name="address" component="div" className={cx('error-message')} />
                                </label>
                            </div>

                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Số điện thoại <RequiredStar />
                                    <Field name="phone" type="text" className={cx('input')} />
                                    <ErrorMessage name="phone" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Email
                                    <Field name="email" type="text" className={cx('input')} />
                                    <ErrorMessage name="email" component="div" className={cx('error-message')} />
                                </label>
                            </div>

                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Ghi chú
                                    <ReactQuill
                                        value={undefined}
                                        onChange={(value) => setFieldValue('note', value)}
                                        className={cx('description-editor')}
                                        theme="snow"
                                    />
                                    <ErrorMessage name="note" component="div" className={cx('error-message')} />
                                </label>
                            </div>
                            <br/>
                            <br/>
                            <Button type="submit" className={cx('submit-button')} variant="add">
                                Sửa
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default SupplierEditForm;

/*import 'react-quill/dist/quill.snow.css';
import styles from './supplierFormStyle.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React, { useEffect, useState } from 'react';
import Button from '../button/button';
import { toast } from 'react-toastify';
import { categoryService } from '../../services/categoryService';
import RequiredStar from '../requiredStar/requiredStar';
import { supplierService } from '../../services/supplierService';
import { supplierValidationSchema } from '../../formik/supplierValidationSchema';
const cx = classNames.bind(styles);

function SupplierEditForm({ item, onClose }) {
    const [name, setName] = useState(item.name);
    const [phone, setPhone] = useState(item.phone);
    const [email, setEmail] = useState(item.email);
    const [address, setAddress] = useState(item.address);
    const [note, setNote] = useState(item.note);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        let supplierData = {
            supplierId: item.supplierId,
            name,
            phone,
            address,
            createdBy: user.firstName + ' ' + user.lastName,
        };
        if (email) {
            supplierData = {
                email,
                ...supplierData,
            };
        }
        if (note) {
            supplierData = {
                note,
                ...supplierData,
            };
        }
        try {
            await supplierValidationSchema.validate(supplierData, { abortEarly: false });
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
        Object.keys(supplierData).forEach((key) => {
            formData.append(key, supplierData[key]);
        });
        await supplierService.put(formData);
        onClose();
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>

                <h2>Sửa nhà cung cấp </h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên nhà cung cấp <RequiredStar />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Địa chỉ <RequiredStar />
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                </div>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Số điện thoại <RequiredStar />
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Email
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                </div>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Ghi chú
                        <ReactQuill value={note} onChange={setNote} className={cx('description-editor')} theme="snow" />
                    </label>
                </div>
                <br />
                <br />
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Sửa
                </Button>
            </div>
        </div>
    );
}

export default SupplierEditForm;
*/
