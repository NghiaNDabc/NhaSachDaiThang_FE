import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.date).toLocaleDateString('vi-VN')),
    datasets: [
      {
        label: 'Doanh Thu',
        data: data.map(item => item.totalRevenue),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      },
    ],
  };

  return (
    <div className="chart">
      <h2>Biểu đồ Doanh Thu</h2>
      <Line data={chartData} />
    </div>
  );
};

export default RevenueChart;
