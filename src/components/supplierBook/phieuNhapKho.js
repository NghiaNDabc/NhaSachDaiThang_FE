import { useState } from 'react';
import { useCategories } from '../../contexts/CategoryContext';
import styles from './phieuNhapkho.module.scss';
import classNames from 'classnames/bind';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const cx = classNames.bind(styles);

function PhieuNhapKho({ supplierBook, onClose }) {
    const { suppliers } = useCategories();
    const [supplierName, setSupplierName] = useState();
    const [datetime, setDateTime] = useState(new Date(supplierBook.supplyDate));

    useState(() => {
        if (suppliers) {
            const s = suppliers.find((x) => x.supplierId == supplierBook.supplierId);
            setSupplierName(s.supplierName);
        }
    });

    const tinhTongTien = () => {
        return supplierBook.books.reduce((tongtien, item) => tongtien + item.quantity * item.supplyPrice, 0);
    };

    const tinhTien = (soluong, gia) => parseInt(gia) * parseInt(soluong);

    // Chức năng in PDF
    // const handleExportPDF = async () => {
    //     const element = document.getElementById('pdf-content');
    //     const canvas = await html2canvas(element, { scale: 2 });
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF('p', 'mm', 'a4');
    //     const pdfWidth = pdf.internal.pageSize.getWidth();
    //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //     pdf.save(`PhieuNhapKho_${supplierBook.supplierBookId}.pdf`);
    // };
    const handleExportPDF = async () => {
        try {
            // Lấy nội dung từ phần tử cần xuất
            const element = document.getElementById('pdf-content');
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Kiểm tra xem File System Access API có được hỗ trợ không
            if ('showSaveFilePicker' in window) {
                // Mở hộp thoại để chọn nơi lưu file
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: `PhieuNhapKho_${supplierBook.supplierBookId}.pdf`,
                    types: [
                        {
                            description: 'PDF Document',
                            accept: { 'application/pdf': ['.pdf'] },
                        },
                    ],
                });

                // Ghi dữ liệu vào file được chọn
                const writable = await fileHandle.createWritable();
                await writable.write(pdf.output('blob')); // Xuất dữ liệu dưới dạng blob
                await writable.close();
            } else {
                // Trường hợp không hỗ trợ File System Access API, dùng cách mặc định
                pdf.save(`PhieuNhapKho_${supplierBook.supplierBookId}.pdf`);
            }
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <button onClick={handleExportPDF} className={cx('export-button')}>
                    Xuất PDF
                </button>
                <div id="pdf-content" className={cx('pdf-content')}>
                    <div className={cx('header1')}>
                        <div>
                            <b>Nhà sách Đại Thắng</b> <br />
                            <i>Số nhà 98, Đại Thắng, Vụ Bản, Nam Định</i>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <b>Mẫu số 01 - VT</b>
                            <br />
                            <i>
                                {'('}Ban hành theo Thông tư số 200/2014/TT-BTC <br />
                                Ngày 22/12/2024 của Bộ Tài chính{')'}
                            </i>
                        </div>
                    </div>
                    <div className={cx('header2')}>
                        <div></div>
                        <div style={{ textAlign: 'center' }}>
                            <h3><b>PHIẾU NHẬP KHO</b></h3>
                            <i>
                                Ngày {datetime.getDate()}, tháng {datetime.getMonth() + 1}, năm {datetime.getFullYear()}
                            </i>
                            <br />
                            Số:PN {supplierBook.supplierBookId}
                        </div>
                        <div style={{ paddingLeft: '40px' }}>
                            Nợ:..... <br />
                            Có:.....
                        </div>
                    </div>

                    <div className={cx('infor')}>
                        <p>- Họ tên người giao: {supplierBook.supplierName}</p>
                    </div>

                    <div className={cx('product-table')}>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        S <br /> T <br /> T
                                    </th>
                                    <th>
                                        Tên, nhãn hiệu quy cách, phẩm chất, vật tư,
                                        <br /> dụng cụ, sản phẩm, hàng hóa
                                    </th>
                                    <th>Mã số</th>
                                    <th>Đơn vị tính</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                                <tr>
                                    <th>A</th>
                                    <th>B</th>
                                    <th>C</th>
                                    <th>D</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                </tr>
                            </thead>

                            <tbody>
                                {supplierBook.books.map((book, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{book.title}</td>
                                        <td>{book.bookId}</td>
                                        <td>Quyển</td>
                                        <td>{book.quantity}</td>
                                        <td>{book.supplyPrice}</td>
                                        <td>{tinhTien(book.quantity, book.supplyPrice)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td></td>
                                    <th>Cộng:</th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>{tinhTongTien()}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Thuế GTGT 10%:</th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{tinhTongTien() * 0.1}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Tổng tiền phải thanh toán:</th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <b>{tinhTongTien() * 1.1}</b>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <p>
                            - Tổng số tiền {'('}viết bằng chữ {')'}:
                            ................................................................................................................................................
                        </p>
                        <p>
                            - Số chứng từ kèm theo:
                            ................................................................................................................................................
                        </p>
                    </div>

                    <div className={cx('signature')}>
                        <table>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <i>
                                        Ngày {new Date().getDate()}, tháng {new Date().getMonth() + 1}, năm{' '}
                                        {new Date().getFullYear()}
                                    </i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>
                                        <b>Người lập phiếu</b>
                                    </p>{' '}
                                    <i>{'(Ký, họ tên)'}</i>
                                </td>
                                <td>
                                    <p>
                                        <b>Người giao hàng</b>
                                    </p>{' '}
                                    <i>{'(Ký, họ tên)'}</i>
                                </td>
                                <td>
                                    <p>
                                        <b>Thủ kho</b>
                                    </p>{' '}
                                    <i>{'(Ký, họ tên)'}</i>
                                </td>
                                <td>
                                    {' '}
                                    <p>
                                        <b>Kế toán trưởng</b>
                                        <br />
                                        <b>[Hoặc bộ phận có nhu cầu nhập]</b>
                                    </p>{' '}
                                    <i>{'(Ký, họ tên)'}</i>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhieuNhapKho;

// import { useState } from 'react';
// import { useCategories } from '../../contexts/CategoryContext';
// import styles from './phieuNhapkho.module.scss';
// import classNames from 'classnames/bind';
// const cx = classNames.bind(styles);
// function PhieuNhapKho({ supplierBook, onClose }) {
//     const { suppliers } = useCategories();
//     const [supplierName, setSupplierName] = useState();
//     const [datetime, setDateTime] = useState(new Date(supplierBook.supplyDate));
//     useState(() => {
//         if (suppliers) {
//             const s = suppliers.find((x) => x.supplierId == supplierBook.supplierId);
//             setSupplierName(s.supplierName);
//         }
//     });
//     const tinhTongTien = () => {
//         let x = supplierBook.books.reduce((tongtien, item) => {
//             return (tongtien += item.quantity * item.supplyPrice);
//         }, 0);

//         return x;
//     };
//     const tinhTien = (soluong, gia) => {
//         return parseInt(gia) * parseInt(soluong);
//     };
//     return (
//         <div className={cx('wrapper')}>
//             <div className={cx('container')}>
//                 <button onClick={onClose} className={cx('close-button')}>
//                     X
//                 </button>
//                 <div className={cx('header1')}>
//                     <div>
//                         <b>Nhà sách Đại Thắng</b> <br />
//                         <i>Số nhà 98, Đại Thắng, Vụ Bản, Nam Định</i>
//                     </div>
//                     <div>
//                         <b>Mẫu số 01 - VT</b>
//                         <br />
//                         <i>
//                             {'('}Ban hành theo Thông tư số 200/2014/TT-BTC <br />
//                             Ngày 22/12/2024 của Bộ Tài chính {')'}
//                         </i>
//                     </div>
//                 </div>
//                 <div className={cx('header2')}>
//                     <div></div>
//                     <div>
//                         <h3>PHIẾU NHẬP KHO</h3>
//                         <i>
//                             Ngày {datetime.getDate()}, tháng {datetime.getMonth() + 1}, năm {datetime.getFullYear()}
//                         </i>
//                         <br />
//                         <b>Số:PN {supplierBook.supplierBookId}</b>
//                     </div>
//                     <div>
//                         Nợ:..... <br />
//                         Có:.....
//                     </div>
//                 </div>

//                 <div className={cx('infor')}>
//                     <p>- Họ tên người giao: {supplierBook.supplierName}</p>
//                 </div>

//                 <div className={cx('product-table')}>
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>
//                                     S <br /> T <br />T
//                                 </th>
//                                 <th>
//                                     Tên, nhãn hiệu quy cách, phẩm chất, vật tư,
//                                     <br /> dụng cụ, sản phẩm, hàng hóa
//                                 </th>
//                                 <th>Mã số</th>
//                                 <th>Đơn vị tính</th>
//                                 <th>Số lượng</th>
//                                 <th>Đơn giá</th>
//                                 <th>Thành tiền</th>
//                             </tr>
//                             <tr>
//                                 <th>A</th>
//                                 <th>B</th>
//                                 <th>C</th>
//                                 <th>D</th>
//                                 <th>1</th>
//                                 <th>2</th>
//                                 <th>3</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {supplierBook.books.map((book, index) => (
//                                 <tr>
//                                     <td>{index + 1}</td>
//                                     <td>{book.title}</td>
//                                     <td>{book.bookId}</td>
//                                     <td>Quyển</td>
//                                     <td>{book.quantity}</td>
//                                     {/* <td>........</td> */}
//                                     <td>{book.supplyPrice}</td>
//                                     <td>{tinhTien(book.quantity, book.supplyPrice)}</td>
//                                 </tr>
//                             ))}
//                             <tr>
//                                 <td></td>
//                                 <th>Cộng:</th>
//                                 <td></td>
//                                 <td></td>
//                                 <td></td>
//                                 <td></td>
//                                 <td>
//                                     <b>{tinhTongTien()}</b>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td></td>
//                                 <th>Thuế GTGT 10%:</th>
//                                 <td></td>
//                                 <td></td>
//                                 <td></td>
//                                 <td></td>
//                                 <td>{tinhTongTien() * 0.1}</td>
//                             </tr>
//                             <tr>
//                                 <td></td>
//                                 <th>Tổng tiền phải thanh toán:</th>
//                                 <td></td>
//                                 <td></td>
//                                 <td></td>
//                                 <td></td>
//                                 <td>
//                                     <b>{tinhTongTien() * 1.1}</b>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>

//                 <div>
//                     <p>
//                         - Tổng số tiền {'('}viết bằng chữ {')'}:
//                         ......................................................................................................
//                     </p>
//                     <p>
//                         - Số chứng từ kèm theo:
//                         ........................................................................................................................
//                     </p>
//                 </div>

//                 <div className={cx('signature')}>
//                     <table styles={{ textAlign: 'center' }}>
//                         <tr>
//                             <td></td>
//                             <td></td>
//                             <td></td>
//                             <td>
//                                 <i>
//                                     Ngày {new Date().getDate()}, tháng {new Date().getMonth() + 1}, năm{' '}
//                                     {new Date().getFullYear()}
//                                 </i>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td>
//                                 <p>
//                                     <b>Người lập phiếu</b>
//                                 </p>{' '}
//                                 <i>{'(Ký, họ tên)'}</i>
//                             </td>
//                             <td>
//                                 <p>
//                                     <b>Người giao hàng</b>
//                                 </p>{' '}
//                                 <i>{'(Ký, họ tên)'}</i>
//                             </td>
//                             <td>
//                                 <p>
//                                     <b>Thủ kho</b>
//                                 </p>{' '}
//                                 <i>{'(Ký, họ tên)'}</i>
//                             </td>
//                             <td>
//                                 {' '}
//                                 <p>
//                                     <b>Kế toán trưởng</b>
//                                     <br />
//                                     <b>[Hoặc bộ phận có nhu cầu nhập]</b>
//                                 </p>{' '}
//                                 <i>{'(Ký, họ tên)'}</i>
//                             </td>
//                         </tr>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default PhieuNhapKho;
