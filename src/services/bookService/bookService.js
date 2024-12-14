import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export const bookService = {
    async getBooks(
        id = null,
        categoryId = null,
        bookName = null,
        pageNumber = null,
        pageSize = null,
        active = null,
        categoryName = null,
        minPrice = null,
        maxprice = null,
        minQuatity = null,
        maxQuanlity = null,
        isPromotion = null,
        languageId = null,
        bookCoverTypeId = null,
    ) {
        try {
            let url = '/v1/Book';
            if (active === true) url += '/active';
            let params = new URLSearchParams();

            if (id !== null && id != '') {
                params.append('id', id);
            }
            if (categoryName !== null && categoryName != '') {
                params.append('categoryName', categoryName);
            }
            if (minPrice !== null && minPrice != '') {
                params.append('minPrice', minPrice);
            }
            if (maxprice !== null && maxprice != '') {
                params.append('maxprice', maxprice);
            }
            if (categoryId !== null && categoryId != '') {
                params.append('categoryId', categoryId);
            }
            if (bookName !== null && bookName != '') {
                params.append('bookName', bookName);
            }
            if (minQuatity !== null && minQuatity != '') {
                params.append('minQuatity', minQuatity);
            }
            if (maxQuanlity !== null && maxQuanlity != '') {
                params.append('maxQuanlity', maxQuanlity);
            }
            if (languageId !== null && languageId != '') {
                params.append('languageId', languageId);
            }
            if (bookCoverTypeId !== null && bookCoverTypeId != '') {
                params.append('bookCoverTypeId', bookCoverTypeId);
            }
            if (isPromotion !== null && isPromotion === true) {
                params.append('isPromotion', isPromotion);
            }
            if (pageNumber !== null && pageSize !== null) {
                params.append('pageNumber', pageNumber);
                params.append('pageSize', pageSize);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axiosInstance.get(url);
            if (response.status === 204) {
                return [];
                toast.warn('Không có cuốn sách nào');
            }
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
                return null;
            }

            //toast.error(response.data.Message);
            var data = response.data.data;
            var count = response.data.count;
            return { data, count };
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },
    async getBookAdmin(
        id = null,
        categoryId = null,
        bookName = null,
        pageNumber = null,
        pageSize = null,
        active = null,
        categoryName = null,
        minPrice = null,
        maxprice = null,
        minQuatity = null,
        maxQuanlity = null,
        isPromotion = null,
        languageId = null,
        bookCoverTypeId = null,
    ) {
        debugger;
        try {
            let url = '/v1/Book';
            let params = new URLSearchParams();
            if (typeof active === 'boolean') {
                params.append('active', active);
            }
            if (id !== null && id != '') {
                params.append('id', id);
            }
            if (categoryName !== null && categoryName != '') {
                params.append('categoryName', categoryName);
            }
            if (minPrice !== null && minPrice != '') {
                params.append('minPrice', minPrice);
            }
            if (maxprice !== null && maxprice != '') {
                params.append('maxprice', maxprice);
            }
            if (categoryId !== null && categoryId != '') {
                params.append('categoryId', categoryId);
            }
            if (bookName !== null && bookName != '') {
                params.append('bookName', bookName);
            }
            if (minQuatity !== null && minQuatity != '') {
                params.append('minQuatity', minQuatity);
            }
            if (maxQuanlity !== null && maxQuanlity != '') {
                params.append('maxQuanlity', maxQuanlity);
            }
            if (languageId !== null && languageId != '') {
                params.append('languageId', languageId);
            }
            if (bookCoverTypeId !== null && bookCoverTypeId != '') {
                params.append('bookCoverTypeId', bookCoverTypeId);
            }
            if (isPromotion !== null && isPromotion === true) {
                params.append('isPromotion', isPromotion);
            }
            if (pageNumber !== null && pageSize !== null) {
                params.append('pageNumber', pageNumber);
                params.append('pageSize', pageSize);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axiosInstance.get(url);
            if (response.status === 204) {
                return [];
                toast.warn('Không có cuốn sách nào');
            }
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
                return null;
            }

            //toast.error(response.data.Message);
            var data = response.data.data;
            var count = response.data.count;
            return { data, count };
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },
    async getNewBook() {
        try {
            let url = '/v1/Book/newBook';
            const response = await axiosInstance.get(url);
            if (response.status === 204) {
                return [];
            }
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
                return null;
            }

            //toast.error(response.data.Message);
            var data = response.data.data;
            debugger;
            return data;
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },

    async changeStatus(id) {
        try {
            const rp = await axiosInstance.put('/v1/Book/changeStatus/' + id);
            if (rp.status !== 200) {
                toast.error(rp.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
                return false;
            } else {
                toast.success(rp.data.message);
                return true;
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },
    async getCount() {
        try {
            const response = await axiosInstance.get('/v1/Book/count');
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra');
                return null;
            }

            return response.data.data;
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },
    async postBook(formData) {
        try {
            const response = await axiosInstance.post('v1/Book', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.errMessage || response.data.message);
            }
        } catch (error) {
            toast.error(error);
        }
    },
    async putBook(formData) {
        try {
            const response = await axiosInstance.put('v1/Book', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async delete(id) {
        try {
            const response = await axiosInstance.delete('/v1/Book/' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
};
