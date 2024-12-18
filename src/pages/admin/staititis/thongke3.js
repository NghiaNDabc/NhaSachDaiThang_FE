import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatisticsChart from '../../../components/RevenueChart/StatisticsChart2';
import SalesTable from '../../../components/RevenueChart/SaleTable2';
import style from './thongke3.module.scss';
import classNames from 'classnames/bind';
import Button from '../../../components/button/button';
import axiosInstance, { serverUrl } from '../../../api/axiosInstance';
const cx = classNames.bind(style);
const THongKe3 = () => {
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    });

    const [revenueData, setRevenueData] = useState([]);
    const [salesData, setSalesData] = useState([]);

    const fetchData = async () => {
        try {
            // Fetch revenue data
            const revenueResponse = await axiosInstance.get(serverUrl + '/Statistics/revenue-by-date', {
                params: { ngayBatDau: startDate, ngayKetThuc: endDate },
            });

            // Fetch sales data
            const salesResponse = await axiosInstance.get(serverUrl + '/Statistics/topSelling', {
                params: { ngayBatDau: startDate, ngayKetThuc: endDate },
            });

            setRevenueData(revenueResponse.data.data || []);
            setSalesData(salesResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={cx('app')}>
            <header className={cx('app-header')}>
                <div className={cx('filters')}>
                    <div>
                        <label>Ngày bắt đầu:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label>Ngày kết thúc:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <Button variant="add" onClick={fetchData}>
                        Thống kê
                    </Button>
                </div>
            </header>

            <div className={cx('row')}>
                <>
                    <StatisticsChart data={revenueData} />
                </>

                <>
                    <SalesTable data={salesData} />
                </>
            </div>
        </div>
    );
};

export default THongKe3;
