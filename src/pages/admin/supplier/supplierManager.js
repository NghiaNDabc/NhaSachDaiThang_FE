import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/button/button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import SuplierFormAdd from '../../../components/supplier/supplierAddForm';
import SuplierComponent from '../../../components/supplier/supplierComponent';
import { supplierService } from '../../../services/supplierService';
import SupplierEditForm from '../../../components/supplier/supplierEditForm';
import ToastCustom from '../../../components/toast/toastComponent';
// const cx = classNames.bind(style);
function SupplierManager() {
    const [suplierList, setSuplierList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editId, setEitId] = useState();
    const [refresh, setRefresh] = useState(0);
    const clickAdd = async () => {
        setIsAdd(!isAdd);
    };
    const fetchLanguage = async () => {
        const data = await supplierService.get();
        console.log('nghiadz', data);

        setSuplierList((pre) => data);
    };
    useEffect(() => {
        fetchLanguage();
    }, [refresh]);

    const handleDelete = async (supplier) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa: ${supplier.name}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            console.log(supplier.supplierId);
            await supplierService.delete(supplier.supplierId); // Gọi hàm xóa
            //Swal.fire('Đã xóa!', 'Sách đã được xóa.', 'success');
            fetchLanguage();
        }
    };

    return (
        <div>
            <div>
                <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới nhà cung cấp
                </Button>
            </div>
            {isAdd && <SuplierFormAdd onSuccess={() => setRefresh((p) => p + 1)} onClose={clickAdd} />}
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
                <div style={{ width: '60%', textAlign: 'left', textIndent: '30px' }}>Tên nhà cung câp</div>

                <div style={{ width: '20%' }}>Địa chỉ</div>

                <div style={{ flexGrow: 1, textAlign: 'center' }}>Hành động</div>
            </div>
            {suplierList &&
                suplierList.length > 0 &&
                suplierList.map((item, index) => (
                    <>
                        <SuplierComponent
                            onDelete={() => handleDelete(item)}
                            key={index}
                            item={item}
                            onEdit={() => setEitId(item.supplierId)}
                        />
                        {editId == item.supplierId && (
                            <SupplierEditForm
                                item={item}
                                onClose={() => {
                                    setSuplierList([]);
                                    setRefresh((prev) => prev + 1);
                                    setEitId(0);
                                }}
                            />
                        )}
                    </>
                ))}
            <ToastCustom />
        </div>
    );
}

export default SupplierManager;
