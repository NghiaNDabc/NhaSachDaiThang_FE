import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const supplierBooksService = {
    async get() {
        try {
            const response = await axiosInstance.get('v1/SupplierBooks');
            return response.data.data;
        } catch (error) {
            console.error(error);
        }
    },
    async put(formData) {
        try {
            const response = await axiosInstance.put('v1/SupplierBooks', formData);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async post(formData) {
        try {
            const response = await axiosInstance.post('v1/SupplierBooks', formData);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async delete(id) {
        try {
            const response = await axiosInstance.delete('/v1/SupplierBooks/?id=' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
};
