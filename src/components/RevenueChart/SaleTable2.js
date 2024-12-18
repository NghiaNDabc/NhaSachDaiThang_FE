import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import style from './saletable.module.scss';
import classNames from 'classnames/bind';
import Button from '../button/button';
import { FaFileExport } from 'react-icons/fa';

const cx = classNames.bind(style);

const SalesTable = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default: 5 items per page

    // Calculate total pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get current page data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            data.map((item) => ({
                Title: item.title,
                Author: item.author,
                TotalQuantity: item.totalQuantity,
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
        XLSX.writeFile(workbook, 'sales_data.xlsx');
    };

    // Handle page navigation
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className={cx('table-container')}>
            <h2>Sản phẩm đã bán</h2>
            <Button leftIcon={<FaFileExport />} variant="add" onClick={exportToExcel}>
                Xuất Excel
            </Button>

            <div className={cx('pagination-controls')}>
                <label>
                    Hiển thị:
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page when items per page changes
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                    </select>
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Hình ảnh</th>
                        <th>Tên sách</th>
                        <th>SL đã bán</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item) => (
                        <tr key={item.bookId}>
                            <td>
                                <img src={item.mainImage} alt={item.title} />
                            </td>
                            <td>{item.title}</td>
                            <td>{item.totalQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={cx('pagination')}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    {'<'}
                </button>
                <span>
                    Trang {currentPage} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                {'>'}
                </button>
            </div>
        </div>
    );
};

export default SalesTable;