import * as Yup from 'yup';

export const supplierBookValidationSchema = Yup.object().shape({
    supplierId: Yup.string().required('Nhà cung cấp đề không được để trống'),
    quanlity: Yup.number()
        .typeError('Số lượng phải là số') // Thông báo khi kiểu dữ liệu sai
        .required('Số lượng không được để trống')
        .positive('Số lượng phải lớn hơn 0'),
    supplyPrice: Yup.number()
        .typeError('Giá nhập phải là số') // Thông báo khi kiểu dữ liệu sai
        .required('Giá nhập không được để trống')
        .positive('giá nhập phải lớn hơn 0'),
    // supplyDate: Yup.DateSchema() // Thông báo khi kiểu dữ liệu sai
    //     .required('Ngày nhập không được để trống')
    //     .positive('giá nhập phải lớn hơn 0'),
});
