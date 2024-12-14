import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const categoryService = {
    async get(id = null, name = null, pageNumber = null, pageSize = null, active = false) {
        try {
            let url = '/v1/Categories';
            if (active === true) url += '/active';
            let params = new URLSearchParams();

            if (id !== null) {
                params.append('id', id);
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

            return response.data.data;
        } catch (error) {
            console.error(error);
        }
    },
    async put(formData) {
        try {
            const response = await axiosInstance.put('v1/Categories', formData);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async post(formData) {
        try {
            debugger;
            const response = await axiosInstance.post('v1/Categories', formData);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async changeStatus(id) {
        try {
            debugger;
            const rp = await axiosInstance.put('/v1/Categories/changeStatus?id=' + id);
            if (rp.status !== 200) {
                toast.error(rp.data?.errMessage || 'Có lỗi xảy ra.');
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
            const response = await axiosInstance.get('/v1/Categories/count');
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
    async delete(id) {
        debugger;
        try {
            const response = await axiosInstance.delete('/v1/Categories/' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    // async changeStatus(id) {
    //     try {
    //         const rp = await axiosInstance.put('/v1/Categories/changeStatus', id);
    //         if (rp.status !== 200) {
    //             toast.error(rp.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
    //             return false;
    //         } else {
    //             toast.success(rp.data.message);
    //             return true;
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
    //         throw error;
    //     }
    // },
};
