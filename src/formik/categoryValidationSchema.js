import * as Yup from 'yup';

export const categoryValidationSchema = Yup.object().shape({
    name: Yup.string().required('Tên danh mục không được để trống'),
});
