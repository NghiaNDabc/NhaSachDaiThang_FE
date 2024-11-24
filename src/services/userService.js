import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const userService = {
    async get(id = null, name = null, pageNumber = null, pageSize = null) {
        try {
            let url = '/v1/User';
            let params = new URLSearchParams();
            if (id !== null && id != '') {
                params.append('id', id);
            }
            if (name !== null && name != '') {
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
            if (response.status === 204) {
                return [];
            }
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu sách.');
                return [];
            }

            var data = response.data.data;
            var count = response.data.count;
            return { data, count };
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },

    async changeStatus(id) {
        try {
            const rp = await axiosInstance.put('/v1/User/changeStatus/' + id);
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
    async post(formData) {
        try {
            const response = await axiosInstance.post('v1/User', formData, {
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
    async put(formData) {
        try {
            const response = await axiosInstance.put('v1/User', formData, {
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
            const response = await axiosInstance.delete('/v1/User/' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
};
