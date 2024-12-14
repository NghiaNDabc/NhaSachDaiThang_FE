import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import style from './statisticchaer2.module.scss';
import classNames from 'classnames/bind';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);
const cx = classNames.bind(style);
const StatisticsChart = ({ data }) => {
    const [chartType, setChartType] = useState('line');
    const [timeFrame, setTimeFrame] = useState('day'); // Default: 'day'

    // Helper function to group data by week or month
    const groupData = (timeFrame) => {
        if (timeFrame === 'day') {
            return data.map((d) => ({
                ...d,
                date: d.date.split('T')[0],
            }));
        } else if (timeFrame === 'week') {
            // Group by week (ISO week starts on Monday)
            const grouped = data.reduce((acc, item) => {
                const weekStart = new Date(item.date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Start of ISO week
                const weekKey = weekStart.toISOString().split('T')[0];
                if (!acc[weekKey]) acc[weekKey] = 0;
                acc[weekKey] += item.totalRevenue;
                return acc;
            }, {});
            return Object.entries(grouped).map(([key, value]) => ({ date: key, totalRevenue: value }));
        } else if (timeFrame === 'month') {
            // Group by month
            const grouped = data.reduce((acc, item) => {
                const monthKey = item.date.substring(0, 7); // 'YYYY-MM'
                if (!acc[monthKey]) acc[monthKey] = 0;
                acc[monthKey] += item.totalRevenue;
                return acc;
            }, {});
            return Object.entries(grouped).map(([key, value]) => ({ date: key, totalRevenue: value }));
        }
    };

    // Processed data based on selected time frame
    const filteredData = groupData(timeFrame);
    const labels = filteredData.map((item) => item.date);
    const values = filteredData.map((item) => item.totalRevenue);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Doanh thu',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={cx('chart-container')}>
            <h2>Biểu đồ doanh thu</h2>
            <div className={cx('controls')}>
                <label>
                    Loại biểu đò
                    <select value={timeFrame} onChange={(e) => setChartType(e.target.value)}>
                        <option value="line">Biểu đồ đường</option>
                        <option value="bar">Biểu đồ cột</option>
                    </select>
                </label>
            </div>
            <div className={cx('controls')}>
                <label>
                    Thống kê theo:
                    <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
                        <option value="day">Ngày</option>
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                    </select>
                </label>
            </div>
            <div className={cx('chart')}>
                {chartType === 'line' ? <Line data={chartData} /> : <Bar data={chartData} />}
            </div>
            <div className={cx('tong-doanh-thu')}>
                Tổng doanh thu:{' '}
                {data
                    .reduce((total, item) => {
                        return total + item.totalRevenue;
                    }, 0)
                    .toLocaleString() + ' VND'}
            </div>
        </div>
    );
};

export default StatisticsChart;
