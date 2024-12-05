import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/button/button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
// import style from './L.module.scss';
import Swal from 'sweetalert2';
import { userService } from '../../services/userService';
import UserEditForm from '../../components/user/userEditForm';
import UserComponent from '../../components/user/userComponent';
import UserAddForm from '../../components/user/userAddForm';
// const cx = classNames.bind(style);
function UserManagement() {
    const [userList, setUserList] = useState([]);
    const [isAdd, setIsAdd] = useState(false);
    const [editId, setEitId] = useState();
    const [refresh, setRefresh] = useState(0);
    const clickAdd = async () => {
        setIsAdd(!isAdd);
    };
    const fetchUser = async () => {
        const { data, count } = await userService.get();

        setUserList((pre) => data);
    };
    useEffect(() => {
        fetchUser();
    }, [refresh]);

    const handleDelete = async (language) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa: ${language.name}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            console.log(language.userId);
            await userService.delete(language.userId);
            fetchUser();
        }
    };

    return (
        <div>
            <div>
                <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới người dùng
                </Button>
            </div>
            {isAdd && (
                <UserAddForm
                    onAdd={() => {
                        setUserList([]);
                        setRefresh((p) => p + 1);
                    }}
                    onClose={clickAdd}
                />
            )}

            {userList &&
                userList.length > 0 &&
                userList.map((item, index) => (
                    <>
                        <UserComponent
                            onDelete={() => handleDelete(item)}
                            key={index}
                            item={item}
                            onEdit={() => setEitId(item.userId)}
                        />
                        {editId == item.userId && (
                            <UserEditForm
                                item={item}
                                onClose={() => {
                                    setUserList([]);
                                    setRefresh((prev) => prev + 1);
                                    setEitId(0);
                                }}
                            />
                        )}
                    </>
                ))}
        </div>
    );
}

export default UserManagement;
