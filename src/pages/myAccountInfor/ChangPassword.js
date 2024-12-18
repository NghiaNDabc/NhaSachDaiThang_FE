import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import style from './myAccountInfor.module.scss';
import classNames from 'classnames/bind';
import RequiredStar from '../../components/requiredStar/requiredStar';
import { passWordValidation } from '../../formik/userValidationSchema';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
const cx = classNames.bind(style);
const ChangePassword = () => {
    const { user } = useAuth();
    const handleSubmit = async (values) => {
        debugger;
        // Lấy user hiện tại từ localStorage
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
            await userService.ChangePassword(formData);
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật thông tin');
        }
    };
    return (
        <>
            {user && (
                <div>
                    <h2>Đổi mật khẩu</h2>
                    <div>
                        <Formik
                            initialValues={{
                                password: '',
                                newPassword: '',
                                confirmPassword: '',
                                email: user.email,
                            }}
                            validationSchema={passWordValidation}
                            onSubmit={handleSubmit} // handleSubmit tự động nhận values từ form
                        >
                            {() => (
                                <Form>
                                    <div className={cx('row')}>
                                        <label className={cx('label')}>
                                            Email <RequiredStar />
                                            <Field type="text" name="email" className={cx('input')} readOnly />
                                            <ErrorMessage name="email" component="div" className={cx('error')} />
                                        </label>
                                        <label className={cx('label')}>
                                            Mật khẩu <RequiredStar />
                                            <Field type="password" name="password" className={cx('input')} />
                                            <ErrorMessage name="password" component="div" className={cx('error')} />
                                        </label>
                                    </div>

                                    <div className={cx('row')}>
                                        <label className={cx('label')}>
                                            Mật khẩu mới <RequiredStar />
                                            <Field type="password" name="newPassword" className={cx('input')} />
                                            <ErrorMessage name="newPassword" component="div" className={cx('error')} />
                                        </label>
                                        <label className={cx('label')}>
                                            Xác nhận mật khẩu
                                            <RequiredStar />
                                            <Field type="password" name="confirmPassword" className={cx('input')} />
                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="div"
                                                className={cx('error')}
                                            />
                                        </label>
                                    </div>

                                    <button className={cx('submit-button')} type="submit">
                                        Cập nhật
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChangePassword;
