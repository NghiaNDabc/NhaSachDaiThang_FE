import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const roleService = {
    async get() {
        try {
            const response = await axiosInstance.get('v1/Roles');
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
};
