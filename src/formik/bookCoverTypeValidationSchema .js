import * as Yup from 'yup';

export const bookCoverTypeValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên  không được để trống').max(100, 'Tối đa 100 ký tự'),
});
