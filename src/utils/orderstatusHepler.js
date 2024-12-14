export const getStatusColor = (status) => {
    switch (status) {
        case "Chờ thanh toán online":
            return "#FFC107"; // Vàng đậm
        case "Chờ xác nhận":
            return "#FF5722"; // Cam đậm
        case "Đã xác nhận":
            return "#4CAF50"; // Xanh lá đậm
        case "Đang xử lý":
            return "#007BFF"; // Xanh dương đậm
        case "Đang giao":
            return "#00BCD4"; // Xanh ngọc đậm
        case "Đã giao đến":
            return "#6A1B9A"; // Tím đậm
        case "Đã hủy":
            return "#FF1744"; // Đỏ đậm
        case "Đã trả lại":
            return "#C62828"; // Đỏ thẫm đậm
        case "Đổi trả":
            return "#E91E63"; // Hồng đậm
        case "Hoàn tất":
            return "#1B5E20"; // Xanh đậm nhất
        default:
            return "#212121"; // Xám đậm
    }
};

export const statusOptions = [
    "Chờ thanh toán online",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Đã giao đến",
    "Đã hủy",
    "Đã trả lại",
    "Đổi trả",
    "Hoàn tất",
];
