    import * as Yup from 'yup';

    export const bookValidationSchema = Yup.object().shape({
        title: Yup.string().required('Tiêu đề không được để trống'),
        author: Yup.string().required('Tác giả không được để trống'),
        publisher: Yup.string().required('Nhà xuất bản không được để trống'),
        publishYear: Yup.number()
            .typeError('Năm xuất bản phải là số') // Thông báo khi kiểu dữ liệu sai
            .required('Năm xuất bản được để trống')
            .positive('Năm xuất bản phải lớn hơn 0'),
        pageCount: Yup.number()
            .typeError('Số trang phải là số') // Thông báo khi kiểu dữ liệu sai
            .required('Số trang không được để trống')
            .positive('Số trang phải lớn hơn 0')
            .integer('Số trang phải là số nguyên'),
        size: Yup.string().required('Kích thước không được để trống'),
        weight: Yup.number()
            .typeError('Cân nặng phải là số') // Thông báo khi kiểu dữ liệu sai
            .required('Cân nặng không được để trống')
            .positive('Cân nặng phải lớn hơn 0'),
        price: Yup.number()
            .typeError('Giá phải là số') // Thông báo khi kiểu dữ liệu sai
            .required('Giá bán không được để trống')
            .positive('Giá phải lớn hơn 0'),
        promotion: Yup.number()
            .nullable()
            .typeError('Khuyến mãi phải là số') // Thông báo khi kiểu dữ liệu sai
            .min(0, 'Khuyến mãi không được nhỏ hơn 0')
            .max(100, 'Khuyến mãi không được lớn hơn 100'),
        categoryId: Yup.string().required('Danh mục không được để trống'),
        languageId: Yup.number().required('Ngôn ngữ không được để trống'),
        bookCoverTypeId: Yup.string().required('Loại bìa không được để trống'),
    });

    /**    promotionEndDate: Yup.date()
            .nullable()
            .test('is-future-date', 'Ngày kết thúc khuyến mãi phải lớn hơn ngày hôm nay', function (value) {
                if (!value) return true; // Không kiểm tra nếu giá trị null
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00 để so sánh chính xác
                return value > today;
            }), */
