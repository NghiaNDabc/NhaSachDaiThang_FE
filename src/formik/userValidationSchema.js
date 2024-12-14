import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('Tên không được để trống'),
    lastName: Yup.string().required('Họ đệm không được để trống'),
    roleId: Yup.string().required('Chức vụ không được để trống'),
    email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
});
export const passWordValidation = Yup.object().shape({
    password: Yup.string().required('Mật khẩu không được để trống'),
    newPassword: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassWord')], 'Mật khẩu nhập lại không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});
