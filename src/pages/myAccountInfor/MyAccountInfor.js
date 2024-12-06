import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { userValidationSchema } from '../../formik/userValidationSchema';
import { toast } from 'react-toastify';
import style from './myAccountInfor.module.scss';
import classNames from 'classnames/bind';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import RequiredStar from '../../components/requiredStar/requiredStar';
const cx = classNames.bind(style);
const AccountInfo = () => {
    const { user } = useAuth();
    const handleSubmit = async (values) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();

        // Add createdBy field
        values.modifyBy = `${user.firstName} ${user.lastName}`;

        // Append all fields to FormData
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });

        try {
            await userService.ClientPut(formData);
            toast.success('Sửa thông tin thành');
        } catch (err) {
            toast.error('Có lỗi xảy ra khi thêm người dùng');
        }
    };
    return (
        <>
            {user && (
                <div>
                    {/* <h2>Thông tin tài khoản</h2>
                    <p>Tên: {user.firstName}</p>
                    <p>Email: {user.email}</p>
                    <p>Điện thoại: {user.phone}</p>
                    <p>Địa chỉ: {user.address}</p> */}

                    <Formik
                        initialValues={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            roleId: user.roleId,
                            email: user.email,
                            phone: user.phone,
                            idNumber: user.idNumber,
                            passWord: '',
                            confirmPassWord: '',
                        }}
                        validationSchema={userValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, setFieldValue, isSubmitting }) => (
                            <Form>
                                <div className={cx('row')}>
                                    <label className={cx('label')}>
                                        Tên <RequiredStar />
                                        <Field type="text" name="firstName" className={cx('input')} />
                                        <ErrorMessage name="firstName" component="div" className={cx('error')} />
                                    </label>
                                    <label className={cx('label')}>
                                        Họ đệm <RequiredStar />
                                        <Field type="text" name="lastName" className={cx('input')} />
                                        <ErrorMessage name="lastName" component="div" className={cx('error')} />
                                    </label>
                                </div>
                                <div className={cx('row')}>
                                    <label className={cx('label')}>
                                        Email <RequiredStar />
                                        <Field type="text" name="email" className={cx('input')} />
                                        <ErrorMessage name="email" component="div" className={cx('error')} />
                                    </label>
                                    <label className={cx('label')}>
                                        Số CCCD
                                        <Field type="text" name="idNumber" className={cx('input')} />
                                    </label>
                                    <label className={cx('label')}>
                                        Số điện thoại <RequiredStar />
                                        <Field type="text" name="phone" className={cx('input')} />
                                        <ErrorMessage name="phone" component="div" className={cx('error')} />
                                    </label>
                                </div>
                                <div className={cx('image-preview-container')}></div>
                                <button
                                    onClick={() => handleSubmit(values)}
                                    className={cx('submit-button')}
                                    variant="add"
                                >
                                    Sửa
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
        </>
    );
};

export default AccountInfo;
