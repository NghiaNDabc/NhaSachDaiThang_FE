import * as Yup from 'yup';

export const languageValidationSchema = Yup.object().shape({
    name: Yup.string().required('Tên  không được để trống'),
});
