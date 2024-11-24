import React, { memo, useCallback, useState } from 'react';
import classNames from 'classnames/bind';
import style from './userComponent.module.scss';
import Button from '../button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import BookEdit from '../bookForm/BookEdit';
import SupplierBookForm from './supplierBook';

const cx = classNames.bind(style);
function UserItemComponent({ user, onDelete }) {
    const [userItem, setBookItem] = useState(user);
    const [isDel, setIsDel] = useState(user.isDel);
    const onChangeStatus = async (id) => {
        const rs = userService.changeStatus(id);
        if (rs) setIsDel((pre) => !pre);
    };
    const [isEdit, setIsEdit] = useState(false);
    const onClose = useCallback(async () => {
        setIsEdit((isEdit) => !isEdit);
        const id = userItem.bookId;
        const { data } = await userService.getBooks(id);
        setBookItem(data);
    });

    return (
        <>
            {isEdit && <BookEdit onClose={onClose} user={userItem} />}
            <div className={cx('wrapper')}>
                <img src={userItem.image} />
                <div className={cx('id')}>{userItem.userId}</div>
                <div className={cx('name')}>{userItem.lastName+' '+ userItem.firstName}</div>
                <div>
                    <Button
                        className={cx(isDel == true ? 'deactive' : 'active')}
                        leftIcon={<FontAwesomeIcon icon={faSquareCheck} />}
                        noBackground
                        onClick={() => onChangeStatus(bookItem.bookId)}
                    />
                </div>
                <div>
                    <Button
                        variant="edit"
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => setIsEdit(true)}
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

export default memo(UserItemComponent);
