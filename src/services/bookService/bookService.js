import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export const bookService = {
    async getBooks(id = null, categoryId = null, name = null, pageNumber = null, pageSize = null, active = false) {
        try {
            let url = '/v1/Book';
            if (active === true) url += '/active';
            let params = new URLSearchParams();

            if (id !== null) {
                params.append('id', id);
            }
            if (categoryId !== null) {
                params.append('categoryId', categoryId);
            }
            if (name !== null) {
                params.append('name', name);
            }
            if (pageNumber !== null && pageSize !== null) {
                params.append('pageNumber', pageNumber);
                params.append('pageSize', pageSize);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axiosInstance.get(url);
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
                return null;
            }

            //toast.error(response.data.Message);

            return response.data.data;
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },

    async changeStatus(id) {
        try {
            const rp = await axiosInstance.put('/v1/Book/changeStatus', id);
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
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
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
