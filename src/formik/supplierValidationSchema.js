import * as Yup from 'yup';

export const supplierValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên nhà cung cấp đề không được để trống').max(100,'Tối đa 100 ký tự'),
    address: Yup.string().required('Địa chỉ không được để trống'),
    email: Yup.string()
        .nullable()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Định dạng email không hợp lệ').max(50,'Tối đa 50 ký tự'),

    phone: Yup.string()
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số và chỉ chứa số')
        .required('Số điện thoại không được để trống'),
});

