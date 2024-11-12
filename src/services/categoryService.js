import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const categoryService = {
    async getActive() {
        try {
            const response = await axiosInstance.get('/v1/Categories/active');
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra');
                return null;
            }

            return response.data.data;
        } catch (error) {
            console.error(error);
        }
    },
};
