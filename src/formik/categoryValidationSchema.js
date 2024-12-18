import * as Yup from 'yup';

export const categoryValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên danh mục không được để trống').max(100, 'Tối đa 100 ký tự'),
});
