import style from './userComponent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Button from '../button/button';
import { faTrash, faPenToSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { userService } from '../../services/userService';
const cx = classNames.bind(style);
function UserComponent({ item, onEdit, onDelete }) {
    const [userItem, setLanguageItem] = useState(item);
    const [isDel, setIsDel] = useState(item.isDel);
    const onChangeStatus = async (id) => {
        const rs = userService.changeStatus(id);
        if (rs) setIsDel((pre) => !pre);
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('id')}>{userItem.userId}</div>

                <div className={cx('name')}>{userItem.firstName + ' ' + userItem.lastName}</div>
                <div className={cx('id')}>{userItem.roleName}</div>
                <div>
                    <Button
                        className={cx(isDel == true ? 'deactive' : 'active')}
                        leftIcon={<FontAwesomeIcon icon={faSquareCheck} />}
                        noBackground
                        small
                        onClick={() => onChangeStatus(item.userId)}
                    />
                </div>
                <div>
                    <Button
                        variant="edit"
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => onEdit(userItem.userId)}
                    >
                        Sửa
                    </Button>
                </div>
                <div>
                    <Button variant="delete" leftIcon={<FontAwesomeIcon icon={faTrash} />} onClick={onDelete}>
                        Xóa
                    </Button>
                </div>
            </div>
        </>
    );
}

export default UserComponent;
