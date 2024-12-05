import React, { createContext, useState, useEffect } from 'react';

// Tạo Context
export const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
    const [cart, setCart, ] = useState(() => {
        // Lấy dữ liệu từ localStorage nếu có
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Cập nhật localStorage khi cart thay đổi
    // useEffect(() => {
    //     localStorage.setItem('cart', JSON.stringify(cart));
    // }, [cart]);

    // Hàm thêm sản phẩm vào giỏ (chỉ lưu id và số lượng)
    const addToCart = (productId, quantity) => {
        const storedCart = localStorage.getItem('cart');
        const tempcart = storedCart ? JSON.parse(storedCart) : [];
        const existingProduct = tempcart.find((item) => item.id === productId);
        let temp2;
        if (existingProduct) {
            // Tăng số lượng nếu sản phẩm đã tồn tại
            temp2 = tempcart.map((item) =>
                item.id === productId ? { id: item.id, quantity: item.quantity + quantity } : item,
            );
        } else {
            // Thêm sản phẩm mới với số lượng ban đầu là 1
            temp2 = [...tempcart, { id: productId, quantity: quantity }];
        }
        setCart(temp2);
        localStorage.setItem('cart', JSON.stringify(temp2));
    };
    const editCart = (productId, quantity) => {
        const storedCart = localStorage.getItem('cart');
        const tempcart = storedCart ? JSON.parse(storedCart) : [];
        let temp2;
        if (quantity <= 0) {
            // Xóa sản phẩm nếu số lượng <= 0
            temp2 = tempcart.filter((item) => item.id !== productId);
        }

        const existingProduct = tempcart.find((item) => item.id === productId);
        if (existingProduct) {
            // Cập nhật số lượng nếu sản phẩm đã tồn tại
            temp2 = tempcart.map((item) => (item.id === productId ? { id: productId, quantity } : item));
        } else {
            // Thêm sản phẩm mới nếu chưa tồn tại
            temp2 = [...tempcart, { id: productId, quantity }];
        }
        setCart(temp2);
        localStorage.setItem('cart', JSON.stringify(temp2));
    };
    const deleteBookInCart= (productId)=>{
        const storedCart = localStorage.getItem('cart');
        const tempcart = storedCart ? JSON.parse(storedCart) : [];
        const temp2 = tempcart.filter((item) => item.id !== productId);
        setCart(temp2);
        localStorage.setItem('cart', JSON.stringify(temp2));
    }
    // Giá trị cung cấp cho các component con
    return <CartContext.Provider value={{ cart, editCart, addToCart,deleteBookInCart }}>{children}</CartContext.Provider>;
};
