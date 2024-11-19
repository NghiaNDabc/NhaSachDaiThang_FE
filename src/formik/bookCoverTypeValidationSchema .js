import * as Yup from 'yup';

export const bookCoverTypeValidationSchema = Yup.object().shape({
    name: Yup.string().required('Tên  không được để trống'),
});
