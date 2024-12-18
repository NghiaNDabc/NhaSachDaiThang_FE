import * as Yup from 'yup';

export const bookCoverTypeValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Tên  không được để trống'),
});
