import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RevenueChart from '../../../components/RevenueChart/RevenueChart';
import ProductsTable from '../../../components/RevenueChart/ProductsTable';
import style from './style.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style)
const Statitis = () => {
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1); // Đầu tháng
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()); // Cuối tháng
        return date.toISOString().split('T')[0];
    });
    const [revenueData, setRevenueData] = useState([]);
    const [productsData, setProductsData] = useState([]);

    const fetchData = async () => {
        try {
            const revenueRes = await axios.get(`http://localhost:5030/api/statistics/revenue-by-date`, {
                params: { ngayBatDau: startDate, ngayKetThuc: endDate },
            });
            const productsRes = await axios.get(`http://localhost:5030/api/statistics/topSelling`, {
                params: { ngayBatDau: startDate, ngayKetThuc: endDate },
            });

            setRevenueData(revenueRes.data.data || []);
            setProductsData(productsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={cx('app')}>
            <h1>Thống Kê Doanh Thu</h1>
            <div className={cx('filters')}>
                <div className={cx("input-group")}>
                    <label>Ngày bắt đầu:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div  className={cx("input-group")}>
                    <label>Ngày kết thúc:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button onClick={fetchData}>Thống kê</button>
            </div>

            <RevenueChart data={revenueData} />
            <ProductsTable data={productsData} />
        </div>
    );
};

export default Statitis;
