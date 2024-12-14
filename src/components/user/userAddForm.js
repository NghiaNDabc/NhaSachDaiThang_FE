import 'react-quill/dist/quill.snow.css';
import styles from './userAddForm.module.scss';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../button/button';
import { toast } from 'react-toastify';
import RequiredStar from '../requiredStar/requiredStar';
import Select from 'react-select';
import { useRole } from '../../contexts/roleContext';
import { userService } from '../../services/userService';
import { userValidationSchema } from '../../formik/userValidationSchema';

const cx = classNames.bind(styles);

function UserAddForm({ onClose }) {
    const { roles } = useRole();
    console.log(roles);
    const [fomatRoles, setfomatRoles] = useState([]);
    // Validation schema with Yup
    useEffect(() => {
        if (roles && roles.length > 0) {
            setfomatRoles(
                roles.map((role) => ({
                    value: role.roleId,
                    label: role.roleName,
                })),
            );
        }
    }, [roles]);
    const [images, setImages] = useState([]);
    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const handleImageChange = (e) => {
        const newImg = Array.from(e.target.files);
        setImages((pre) => [...pre, ...newImg]);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();

        // Add createdBy field
        values.createdBy = `${user.firstName} ${user.lastName}`;

        // Append all fields to FormData
        Object.keys(values).forEach((key) => {
            formData.append(key, values[key]);
        });
        images.forEach((img) => {
            formData.append('imageFiles', img);
        });
        try {
            await userService.post(formData);
            toast.success('Thêm người dùng thành công');
            onClose();
        } catch (err) {
            toast.error('Có lỗi xảy ra khi thêm người dùng');
        }
        setSubmitting(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm người mới</h2>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        roleId: '',
                        email: '',
                        phone: '',
                        idNumber: '',
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
                                <label className={cx('label')}>
                                    Chức vụ <RequiredStar />
                                    <Select
                                        className={cx('select-react')}
                                        options={fomatRoles}
                                        placeholder="Chọn chức vụ"
                                        value={fomatRoles.find((role) => role.value === values.roleId)}
                                        onChange={(option) => setFieldValue('roleId', option?.value || '')}
                                    />
                                    <ErrorMessage name="roleId" component="div" className={cx('error')} />
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
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Mật khẩu <RequiredStar />
                                    <Field type="password" name="passWord" className={cx('input')} />
                                    <ErrorMessage name="passWord" component="div" className={cx('error')} />
                                </label>
                                <label className={cx('label')}>
                                    Nhập lại mật khẩu <RequiredStar />
                                    <Field type="password" name="confirmPassWord" className={cx('input')} />
                                    <ErrorMessage name="confirmPassWord" component="div" className={cx('error')} />
                                </label>
                            </div>
                            <div className={cx('label')}>
                                Hình ảnh
                                <input
                                    onChange={handleImageChange}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className={cx('input')}
                                />
                                <div className={cx('image-preview-container')}>
                                    {images &&
                                        images.length > 0 &&
                                        images.map((image, index) => (
                                            <div key={index} className={cx('image-preview-wrapper')}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Selected"
                                                    className={cx('image-preview')}
                                                />{' '}
                                                <button
                                                    className={cx('remove-image-button')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(index);
                                                    }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className={cx('image-preview-container')}></div>
                            <Button type="submit" className={cx('submit-button')} variant="add" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang thêm...' : 'Tạo mới'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default UserAddForm;
