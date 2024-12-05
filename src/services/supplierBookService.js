import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const supplierBooksService = {
    async get(
        supplierBookId = null,
        supplierId = null,
        bookId = null,
        supplierName = null,
        bookname = null,
        minSupplyDate = null,
        maxSupplyDate = null,
        pageNumber = null,
        pageSize = null,
    ) {
        try {
            let params = new URLSearchParams();
            let url = '/v1/SupplierBooks';
            if (supplierBookId !== null && supplierBookId != '') {
                params.append('supplierBookId', supplierBookId);
            }
            if (supplierId !== null && supplierId != '') {
                params.append('supplierId', supplierId);
            }
            if (bookId !== null && bookId != '') {
                params.append('bookId', bookId);
            }
            if (supplierName !== null && supplierName != '') {
                params.append('supplierName', supplierName);
            }
            if (bookname !== null && bookname != '') {
                params.append('bookname', bookname);
            }
            if (minSupplyDate !== null && minSupplyDate != '') {
                params.append('minSupplyDate', minSupplyDate);
            }
            if (maxSupplyDate !== null && maxSupplyDate != '') {
                params.append('maxSupplyDate', maxSupplyDate);
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
            debugger;
            return { data, count };
        } catch (error) {
            console.error('Error fetching:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
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
            if (response.data.success) {
                toast.success(response.data.message);
                return response.data.success;
            } else {
                toast.error(response.data.errNessage || response.data.message);
                return false;
            }
        } catch (error) {
            toast.error(error);
            return false;
        }
    },
    async delete(id) {
        debugger;
        try {
            const response = await axiosInstance.delete('/v1/SupplierBooks/?id=' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
};
