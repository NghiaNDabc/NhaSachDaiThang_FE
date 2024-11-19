import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const categoryService = {
    async get(id = null, name = null, pageNumber = null, pageSize = null) {
        try {
            let url = '/v1/Supliers';
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

            return response.data.data;
        } catch (error) {
            console.error(error);
        }
    },
    async put(formData) {
        try {
            const response = await axiosInstance.put('v1/Supliers', formData);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async post(formData) {
        try {
            const response = await axiosInstance.post('v1/Supliers', formData);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async changeStatus(id) {
        try {
            const rp = await axiosInstance.put('/v1/Supliers/changeStatus', id);
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
            const response = await axiosInstance.get('/v1/Supliers/count');
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
            const response = await axiosInstance.delete('/v1/Supliers/' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
};
