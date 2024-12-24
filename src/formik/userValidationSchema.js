import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('Tên không được để trống').max(100, 'Tối đa 100 ký tự'),
    lastName: Yup.string().required('Họ đệm không được để trống').max(100, 'Tối đa 100 ký tự'),
    roleId: Yup.string().required('Chức vụ không được để trống'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email không được để trống')
        .max(100, 'Tối đa 100 ký tự')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Định dạng email không hợp lệ'),
    passWord: Yup.string()
        .test('no-spaces', 'Mật khẩu không được chứa dấu cách', (value) => !/\s/.test(value))
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(20, 'Mật khẩu tối đa 20 ký tự')
        .required('Mật khẩu không được để trống'),
    confirmPassWord: Yup.string()
        .oneOf([Yup.ref('passWord')], 'Mật khẩu không khớp..')
        .required('Vui lòng xác nhận mật khẩu'),
});
export const userEditValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('Tên không được để trống').max(100, 'Tối đa 100 ký tự'),
    lastName: Yup.string().required('Họ đệm không được để trống').max(100, 'Tối đa 100 ký tự'),
    roleId: Yup.string().required('Chức vụ không được để trống'),
    idNumber: Yup.string()
        .nullable()
        .matches(/^\d{9,12}$/, 'Số CCCD phải có từ 9 đến 12 ký tự và chỉ bao gồm số'),
    phone: Yup.string()
        .nullable()
        .matches(/^\d{10,11}$/, 'Số điện thoại phải có từ 10 đến 11 ký tự và chỉ bao gồm số'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email không được để trống')
        .max(100, 'Tối đa 100 ký tự')
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Định dạng email không hợp lệ'),
});
export const passWordValidation = Yup.object().shape({
    password: Yup.string().required('Mật khẩu không được để trống'),
    newPassword: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu nhập lại không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});
