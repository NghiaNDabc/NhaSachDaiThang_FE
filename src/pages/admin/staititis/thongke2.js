import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './thongke2.module.scss';

const Statistics2 = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartType, setChartType] = useState('line');
    const [timeFilter, setTimeFilter] = useState('month'); // "week" or "month"
    const [revenueData, setRevenueData] = useState([]);
    const [topSellingData, setTopSellingData] = useState([]);

    useEffect(() => {
        const currentDate = new Date();
        if (timeFilter === 'month') {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                .toISOString()
                .split('T')[0];
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                .toISOString()
                .split('T')[0];
            setStartDate(startOfMonth);
            setEndDate(endOfMonth);
            fetchData(startOfMonth, endOfMonth);
        } else if (timeFilter === 'week') {
            const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1))
                .toISOString()
                .split('T')[0];
            const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7))
                .toISOString()
                .split('T')[0];
            setStartDate(startOfWeek);
            setEndDate(endOfWeek);
            fetchData(startOfWeek, endOfWeek);
        }
    }, [timeFilter]);

    const fetchData = async (start, end) => {
        try {
            const revenueRes = await axiosInstance.get(
                `/statistics/revenue-by-date?ngayBatDau=${start}&ngayKetThuc=${end}`,
            );
            const topSellingRes = await axiosInstance.get(
                `/statistics/topSelling?ngayBatDau=${start}&ngayKetThuc=${end}`,
            );
            setRevenueData(revenueRes.data.data);
            setTopSellingData(topSellingRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleExportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const ws = XLSX.utils.json_to_sheet(topSellingData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, `TopSellingProducts${fileExtension}`);
    };

    const chartData = {
        labels: revenueData.map((item) => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Doanh Thu',
                data: revenueData.map((item) => item.totalRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="statistics">
            <h1>Thống kê doanh thu</h1>
            <div className="filters">
                <label>
                    Lọc theo:
                    <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                        <option value="month">Tháng</option>
                        <option value="week">Tuần</option>
                    </select>
                </label>
                <div className="chart-type-selector">
                    <label>
                        Chọn loại biểu đồ:
                        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                            <option value="line">Biểu đồ đường</option>
                            <option value="bar">Biểu đồ cột</option>
                        </select>
                    </label>
                </div>
                <label>
                    Ngày bắt đầu:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label>
                    Ngày kết thúc:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
                <button onClick={() => fetchData(startDate, endDate)}>Thống kê</button>
            </div>

            <div className="content">
                <div className="chart-container">
                    {chartType === 'line' ? (
                        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    ) : (
                        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    )}
                </div>

                <div className="products">
                    <h2>Sản phẩm đã bán</h2>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Tác giả</th>
                                <th>Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSellingData.map((product) => (
                                <tr key={product.bookId}>
                                    <td>
                                        <img src={product.mainImage} alt={product.title} />
                                    </td>
                                    <td>{product.title}</td>
                                    <td>{product.author}</td>
                                    <td>{product.totalQuantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleExportToExcel}>Xuất Excel</button>
                </div>
            </div>
        </div>
    );
};

export default Statistics2;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";
// import "./thongke2.module.scss";
// import axiosInstance from "../../../api/axiosInstance";

// const Statistics2 = () => {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [chartType, setChartType] = useState("line");
//   const [revenueData, setRevenueData] = useState([]);
//   const [topSellingData, setTopSellingData] = useState([]);

//   useEffect(() => {
//     const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//       .toISOString()
//       .split("T")[0];
//     const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
//       .toISOString()
//       .split("T")[0];

//     setStartDate(currentMonthStart);
//     setEndDate(currentMonthEnd);

//     fetchData(currentMonthStart, currentMonthEnd);
//   }, []);

//   const fetchData = async (start, end) => {
//     try {
//       const revenueRes = await axiosInstance.get(
//         `/statistics/revenue-by-date?ngayBatDau=${start}&ngayKetThuc=${end}`
//       );
//       const topSellingRes = await axiosInstance.get(
//         `/statistics/topSelling?ngayBatDau=${start}&ngayKetThuc=${end}`
//       );
//       setRevenueData(revenueRes.data.data);
//       setTopSellingData(topSellingRes.data.data);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   const handleExportToExcel = () => {
//     const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//     const fileExtension = ".xlsx";

//     const ws = XLSX.utils.json_to_sheet(topSellingData);
//     const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: fileType });

//     FileSaver.saveAs(data, `TopSellingProducts${fileExtension}`);
//   };

//   const chartData = {
//     labels: revenueData.map((item) => new Date(item.date).toLocaleDateString()),
//     datasets: [
//       {
//         label: "Doanh Thu",
//         data: revenueData.map((item) => item.totalRevenue),
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="statistics">
//       <h1>Thống kê doanh thu</h1>
//       <div className="filters">
//         <label>
//           Ngày bắt đầu:
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </label>
//         <label>
//           Ngày kết thúc:
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </label>
//         <button onClick={() => fetchData(startDate, endDate)}>Thống kê</button>
//       </div>

//       <div className="chart-type-selector">
//         <button
//           className={chartType === "line" ? "active" : ""}
//           onClick={() => setChartType("line")}
//         >
//           Biểu đồ đường
//         </button>
//         <button
//           className={chartType === "bar" ? "active" : ""}
//           onClick={() => setChartType("bar")}
//         >
//           Biểu đồ cột
//         </button>
//       </div>

//       <div className="chart-container">
//         {chartType === "line" ? (
//           <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
//         ) : (
//           <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
//         )}
//       </div>

//       <h2>Sản phẩm đã bán</h2>
//       <table className="products-table">
//         <thead>
//           <tr>
//             <th>Hình ảnh</th>
//             <th>Tên sản phẩm</th>
//             <th>Tác giả</th>
//             <th>Số lượng</th>
//           </tr>
//         </thead>
//         <tbody>
//           {topSellingData.map((product) => (
//             <tr key={product.bookId}>
//               <td>
//                 <img src={product.mainImage} alt={product.title} />
//               </td>
//               <td>{product.title}</td>
//               <td>{product.author}</td>
//               <td>{product.totalQuantity}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button onClick={handleExportToExcel}>Xuất Excel</button>
//     </div>
//   );
// };

// export default Statistics2;
