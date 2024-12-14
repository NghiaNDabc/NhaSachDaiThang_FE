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
        // Lấy user hiện tại từ localStorage
        alert('xx');
        const currentUser = JSON.parse(localStorage.getItem('user'));

        // Thêm trường modifyBy vào values
        values.modifyBy = `${currentUser.firstName} ${currentUser.lastName}`;

        const formData = new FormData();

        // Duyệt qua tất cả các field trong values và append vào formData
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });

        try {
            // Gọi API để cập nhật thông tin
            await userService.ClientPut(formData);
            toast.success('Sửa thông tin thành công');
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    return (
        <>
            {user && (
                <div>
                    <Formik
                        initialValues={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            roleId: user.roleId,
                            email: user.email,
                            phone: user.phone,
                            idNumber: user.idNumber,
                        }}
                        validationSchema={userValidationSchema}
                        onSubmit={handleSubmit} // handleSubmit tự động nhận values từ form
                    >
                        {() => (
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
                                        <Field type="text" name="email" className={cx('input')} readOnly />
                                        <ErrorMessage name="email" component="div" className={cx('error')} />
                                    </label>
                                    <label className={cx('label')}>
                                        Số CCCD
                                        <Field type="text" name="idNumber" className={cx('input')} />
                                    </label>
                                    <label className={cx('label')}>
                                        Số điện thoại
                                        <Field type="text" name="phone" className={cx('input')} />
                                        <ErrorMessage name="phone" component="div" className={cx('error')} />
                                    </label>
                                </div>
                                <div className={cx('image-preview-container')}></div>
                                <button className={cx('submit-button')} type="submit">
                                    Lưu thông tin
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
