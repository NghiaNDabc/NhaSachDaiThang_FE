import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const ProductsTable = ({ data }) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'products.xlsx');
    };

    return (
        <div className="table-container">
            <h2>Sản Phẩm Đã Bán</h2>
            <table>
                <thead>
                    <tr>
                        <th>Hình Ảnh</th>
                        <th>Tên Sách</th>
                        <th>Tác Giả</th>
                        <th>Số Lượng Đã Bán</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.bookId}>
                            <td>
                                <img src={item.mainImage} alt={item.title} />
                            </td>
                            <td>{item.title}</td>
                            <td>{item.author}</td>
                            <td>{item.totalQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={exportToExcel}>Xuất Excel</button>
        </div>
    );
};

export default ProductsTable;
