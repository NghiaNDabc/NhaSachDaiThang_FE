import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/button/button';
import BookListAdmin from '../../../components/BookAdmin/BookListAdmin';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
// import style from './L.module.scss';
import { ToastContainer } from 'react-toastify';
import { languageService } from '../../../services/languageService';
import LanguageComponent from '../../../components/language/languageItem';
import LanguageAddForm from '../../../components/language/languageAddForm';
import LanguageEditForm from '../../../components/language/languageEditForm';
import Swal from 'sweetalert2';
import ToastCustom from '../../../components/toast/toastComponent';
// const cx = classNames.bind(style);
function LanguageManager() {
    const [languageList, setLanguageList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editId, setEitId] = useState();
    const [refresh, setRefresh] = useState(0);
    const clickAdd = async () => {
        setIsAdd(!isAdd);
    };
    const fetchLanguage = async () => {
        const data = await languageService.get();
        setLanguageList((pre) => data);
    };
    useEffect(() => {
        fetchLanguage();
    }, [refresh]);

    const handleDelete = async (language) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa: ${language.name}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            console.log(language.languageId);
            await languageService.delete(language.languageId); // Gọi hàm xóa
            //Swal.fire('Đã xóa!', 'Sách đã được xóa.', 'success');
            fetchLanguage();
        }
    };

    return (
        <div>
            <div>
                <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới ngôn ngữ
                </Button>
            </div>
            {isAdd && <LanguageAddForm onAdd={() => setRefresh((p) => p + 1)} onClose={clickAdd} />}
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
                <div style={{ width: '4%', textAlign: 'left' }}>ID</div>
                <div style={{ width: '60%', textAlign: 'left', textIndent: '80px' }}>Tên ngôn ngữ</div>

                <div style={{ width: '20%' }}></div>

                <div style={{ flexGrow: 1, textAlign: 'center' }}>Hành động</div>
            </div>
            {languageList &&
                languageList.length > 0 &&
                languageList.map((item, index) => (
                    <>
                        <LanguageComponent
                            onDelete={() => handleDelete(item)}
                            key={index}
                            item={item}
                            onEdit={() => setEitId(item.languageId)}
                        />
                        {editId == item.languageId && (
                            <LanguageEditForm
                                item={item}
                                onClose={() => {
                                    setLanguageList([]);
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

export default LanguageManager;
