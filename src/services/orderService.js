import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
export const orderService = {
    async get(
        orderId = null,
        orderDate = null,
        deliveredDate = null,
        customerName = null,
        status = null,
        userId = null,
        phoneNumber = null,
        pageNumber = null,
        pageSize = null,
    ) {
        try {
            let url = 'v1/Order';
            let params = new URLSearchParams();

            if (orderId !== null && orderId !== '') {
                params.append('orderId', orderId);
            }
            if (orderDate !== null && orderDate !== '') {
                params.append('orderDate', orderDate);
            }
            if (deliveredDate !== null && deliveredDate !== '') {
                params.append('deliveredDate', deliveredDate);
            }
            if (customerName !== null && customerName !== '') {
                params.append('customerName', customerName);
            }
            if (status !== null && status !== '') {
                params.append('status', status);
            }
            if (userId !== null && userId !== '') {
                params.append('userId', userId);
            }
            if (phoneNumber !== null && phoneNumber !== '') {
                params.append('phoneNumber', phoneNumber);
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
                toast.warn('Không có đơn hàng nào');
                return [];
            }
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu đơn hàng.');
                return null;
            }

            const data = response.data.data;

            debugger;
            return { data };
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },
    async get2(
        orderId = null,
        minorderDate = null,
        maxorderDate = null,
        deliveredDate = null,
        customerName = null,
        status = null,
        userId = null,
        phoneNumber = null,
        pageNumber = null,
        pageSize = null,
    ) {
        try {
            let url = 'v1/Order';
            let params = new URLSearchParams();

            if (orderId !== null && orderId !== '') {
                params.append('orderId', orderId);
            }
            if (minorderDate !== null && minorderDate !== '') {
                params.append('minorderDate', minorderDate);
            }
            if (maxorderDate !== null && maxorderDate !== '') {
                params.append('maxorderDate', maxorderDate);
            }
            if (deliveredDate !== null && deliveredDate !== '') {
                params.append('deliveredDate', deliveredDate);
            }
            if (customerName !== null && customerName !== '') {
                params.append('customerName', customerName);
            }
            if (status !== null && status !== '') {
                params.append('status', status);
            }
            if (userId !== null && userId !== '') {
                params.append('userId', userId);
            }
            if (phoneNumber !== null && phoneNumber !== '') {
                params.append('phoneNumber', phoneNumber);
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
                toast.warn('Không có đơn hàng nào');
                return [];
            }
            if (response.status !== 200) {
                toast.error(response.data?.errMessage || 'Có lỗi xảy ra khi lấy dữ liệu đơn hàng.');
                return null;
            }

            const data = response.data.data;

            const count = response.data.count;
            return { data, count };
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Lỗi kết nối. Vui lòng thử lại sau.');
            throw error;
        }
    },
    async post(formData) {
        try {
            const response = await axiosInstance.post('v1/Order', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('cart', []);
                window.location.href = `/resultcheckout?orderId=${response.data.data.orderId}&&success=True`;
            } else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async put(formData) {
        try {
            const response = await axiosInstance.put('v1/Order', formData);
            if (response.data.success) {
                toast.success(response.data.message);
            } else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
    async postVnPay(formData) {
        try {
            const response = await axiosInstance.post('v1/VnPay', formData);

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('cart', []);
                // Chuyển hướng đến URL trả về
                const paymentUrl = response.data.paymentUrl;
                window.location.href = paymentUrl;
            } else {
                toast.error(response.data.errMessage || response.data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi tạo URL thanh toán.');
        }
    },
    async postVnPayByOrderId(orderId) {
        try {
            const response = await axiosInstance.post('v1/VnPay/' + orderId);

            if (response.data.success) {
                toast.success(response.data.message);

                // Chuyển hướng đến URL trả về
                const paymentUrl = response.data.paymentUrl;
                window.location.href = paymentUrl;
            } else {
                toast.error(response.data.errMessage || response.data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi tạo URL thanh toán.');
        }
    },
    async cancel(orderId) {
        try {
            const response = await axiosInstance.put('v1/Order/cancel/' + orderId);

            if (response.data.success) {
                toast.success('Hủy đơn hàng thành công');
            } else {
                toast.error(response.data.errMessage || response.data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi tạo URL thanh toán.');
        }
    },
    async delete(id) {
        try {
            const response = await axiosInstance.delete('/v1/Order/?id=' + id);
            if (response.data.success) toast.success(response.data.message);
            else toast.error(response.data.errNessage || response.data.message);
        } catch (error) {
            toast.error(error);
        }
    },
};
