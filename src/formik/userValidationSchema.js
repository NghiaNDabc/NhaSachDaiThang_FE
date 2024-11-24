import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('Tên không được để trống'),
    lastName: Yup.string().required('Họ đệm không được để trống'),
    roleId: Yup.string().required('Chức vụ không được để trống'),
    email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
    phone: Yup.string().required('Số điện thoại không được để trống'),
    passWord: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
    confirmPassWord: Yup.string()
        .oneOf([Yup.ref('passWord')], 'Mật khẩu nhập lại không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});
