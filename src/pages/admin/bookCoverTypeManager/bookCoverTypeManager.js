import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/button/button';
import BookListAdmin from '../../../components/BookAdmin/BookListAdmin';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
// import style from './L.module.scss';
import { bookCoverTypeService } from '../../../services/bookCoverTypeService';
import Swal from 'sweetalert2';
import { bookService } from '../../../services/bookService/bookService';
import BookCoverTypeAddForm from '../../../components/bookCoverType/bookCoverTypeAddForm';
import BookCoverTypeComponent from '../../../components/bookCoverType/bookCoverTypeItem';
import BookCoverTypeEditForm from '../../../components/bookCoverType/bookCoverTypeEditForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToastCustom from '../../../components/toast/toastComponent';
// const cx = classNames.bind(style);
function BookCoverTypeManager() {
    const [bookCoverTypeList, setBookCoverTypeList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editId, setEitId] = useState();
    const [refresh, setRefresh] = useState(0);
    const clickAdd = async () => {
        setIsAdd(!isAdd);
    };
    const fetchBooCoverType = async () => {
        const data = await bookCoverTypeService.get();

        setBookCoverTypeList((pre) => data);
    };
    useEffect(() => {
        fetchBooCoverType();
    }, [refresh]);

    const handleDelete = async (bookCoverType) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa: ${bookCoverType.name}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            await bookCoverTypeService.delete(bookCoverType.bookCoverTypeId); // Gọi hàm xóa
            //Swal.fire('Đã xóa!', 'Sách đã được xóa.', 'success');
            fetchBooCoverType();
        }
    };

    return (
        <div>
            <div>
                <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới
                </Button>
            </div>
            {isAdd && <BookCoverTypeAddForm onAdd={() => setRefresh((p) => p + 1)} onClose={clickAdd} />}

            {bookCoverTypeList &&
                bookCoverTypeList.length > 0 &&
                bookCoverTypeList.map((item, index) => (
                    <>
                        <BookCoverTypeComponent
                            onDelete={() => handleDelete(item)}
                            key={index}
                            item={item}
                            onEdit={() => setEitId(item.bookCoverTypeId)}
                        />
                        {editId == item.bookCoverTypeId && (
                            <BookCoverTypeEditForm
                                item={item}
                                onClose={() => {
                                    setBookCoverTypeList([]);
                                    setRefresh((p) => p + 1);
                                    setEitId(0);
                                }}
                            />
                        )}
                    </>
                ))}
                 {/* <ToastCustom/> */}
        </div>
    );
}

export default BookCoverTypeManager;
