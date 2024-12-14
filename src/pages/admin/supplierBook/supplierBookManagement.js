import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SupplierBookForm from '../../../components/BookAdmin/supplierBook';
import { supplierBooksService } from '../../../services/supplierBookService';
import SupplierBookComponent from '../../../components/supplierBook/supplierBookItem';
import style from './supplierBookManagement.module.scss';
import classNames from 'classnames/bind';
import Button from '../../../components/button/button';
import Select from 'react-select';
import { useCategories } from '../../../contexts/CategoryContext';
import PhieuNhapKho from '../../../components/supplierBook/phieuNhapKho';
const cx = classNames.bind(style);
function SupplierManagement() {
    const [supplierBookList, setSupplierBookList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [editId, setEitId] = useState();
    const [refresh, setRefresh] = useState(0);
    const [searchParams, setsearchParams] = useState(0);
    const [totalPages, settotalPages] = useState();
    const [supplierBookId, setsupplierBookId] = useState();
    const [supplierId, setSupplierId] = useState();
    const [maxSupplyDate, setmaxSupplyDate] = useState();
    const [minSupplyDate, setminSupplyDate] = useState();
    const { suppliers } = useCategories();
    const [formatSupplier, setFormatSupplier] = useState();
    const formatSupplierFuc = (suppliers) => {
        let rs = [];

        suppliers.forEach((sup) => {
            rs.push({
                value: sup.supplierId,
                label: sup.name,
            });
        });
        return rs;
    };
    useEffect(() => {
        if (suppliers && suppliers.length > 0) setFormatSupplier(formatSupplierFuc(suppliers));
    }, [suppliers]);
    const clickAdd = async () => {
        setIsAdd(!isAdd);
    };
    const handleInputChange = (x) => {
        console.log(x);
    };
    const handleSearch = (x) => {
        console.log(x);
    };

    const [count, setCount] = useState();
    const fetchSupplierBook = async () => {
        const { data, count } = await supplierBooksService.get(
            supplierBookId,
            supplierId,
            null,
            null,
            null,
            minSupplyDate,
            maxSupplyDate,
            pageNumber,
            pageSize,
        );
        setCount(count);
        setSupplierBookList(data);
        settotalPages(Math.ceil(count / pageSize));
    };
    useEffect(() => {
        fetchSupplierBook();
    }, [refresh, pageNumber, pageSize]);
    const handlePagenumberChange = (page) => {
        setPageNumber(page);
    };
    const handlePagesizeChange = (page) => {
        const x = Math.ceil(count / page);
        if (x < pageNumber) {
            setPageNumber(x);
        }
        setPageSize(page);
    };
    const handleDelete = async (supplierBook) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa: ${supplierBook.supplierBookId}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            console.log(supplierBook.userId);
            await supplierBooksService.delete(supplierBook.supplierBookId);
            fetchSupplierBook();
        }
    };

    return (
        <div>
            <div></div>
            <div className={cx('filters')}>
                <div className={cx('row')}>
                    <input
                        className={cx('input')}
                        type="text"
                        placeholder="ID"
                        value={supplierBookId || ''}
                        onChange={(e) => setsupplierBookId(e.target.value)}
                    />
                    <Select
                        isClearable
                        className={cx('select')}
                        options={suppliers.map((supplier) => ({ value: supplier.supplierId, label: supplier.name }))}
                        placeholder="Nhà cung cấp"
                        onChange={(option) => setSupplierId(option?.value || null)}
                    />
                    Ngày bắt đầu
                    <input
                        className={cx('input')}
                        type="date"
                        placeholder="Từ"
                        value={minSupplyDate || ''}
                        onChange={(e) => setminSupplyDate(e.target.value)}
                    />
                    Ngày kết thúc
                    <input
                        className={cx('input')}
                        type="date"
                        placeholder="Đến"
                        value={maxSupplyDate}
                        onChange={(e) => setmaxSupplyDate(e.target.value)}
                    />
                </div>
                <div className={cx('row')}>
                    <div>
                        <Button onClick={() => fetchSupplierBook()} leftIcon={<FontAwesomeIcon icon={faSearch} />}>
                            Tìm kiếm
                        </Button>
                    </div>
                    <div>
                        <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                            Nhập sách
                        </Button>
                    </div>
                </div>
            </div>
            {isAdd && (
                <SupplierBookForm
                    onAdd={() => {
                        setSupplierBookList([]);
                        setRefresh((p) => p + 1);
                    }}
                    onClose={clickAdd}
                />
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid gray',
                }}
            >
                <div style={{ width: '4%', textAlign: 'center' }}>ID</div>
                <div style={{ width: '55%', textAlign: 'center' }}>Tên nhà cung câp</div>

                <div style={{ width: '10%' }}>Ngày nhập</div>
                <div style={{ width: '10    %', textAlign: 'center' }}>Tổng tiền</div>
                <div style={{ flexGrow: 1, textAlign: 'center' }}>Hành động</div>
            </div>
            {supplierBookList &&
                supplierBookList.length > 0 &&
                supplierBookList.map((item, index) => (
                    <>
                        <SupplierBookComponent
                            onDelete={() => handleDelete(item)}
                            key={index}
                            item={item}
                            onEdit={() => setEitId(item.supplierBookId)}
                        />
                        {editId == item.supplierBookId && (
                            <PhieuNhapKho
                                supplierBook={item}
                                onClose={() => {
                                    setEitId(0);
                                }}
                            />
                        )}
                    </>
                ))}
            <br />
            <br />
            <br />
            <div className={cx('pagination')}>
                <div>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePagenumberChange(index + 1)}
                            className={cx(pageNumber === index + 1 ? 'active' : '')}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div>
                    <select value={pageSize} onChange={(e) => handlePagesizeChange(e.target.value)}>
                        <option value={12}>12</option>
                        <option value={13}>13</option>
                        <option value={15}>15</option>
                        <option value={18}>18</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SupplierManagement;
