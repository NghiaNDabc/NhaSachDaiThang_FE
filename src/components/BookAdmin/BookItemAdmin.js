import React, { memo, useCallback, useState } from 'react';
import classNames from 'classnames/bind';
import style from './BookItemAdmin.module.scss';
import Button from '../button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { bookService } from '../../services/bookService/bookService';
import BookEdit from '../bookForm/BookEdit';
import SupplierBookForm from './supplierBook';

const cx = classNames.bind(style);
function BookItemAdmin({ book, onRestock, onDelete }) {
    const [bookItem, setBookItem] = useState(book);
    const [isDel, setIsDel] = useState(book.isDel);
    const onChangeStatus = async (id) => {
        const rs = bookService.changeStatus(id);
        if (rs) setIsDel((pre) => !pre);
    };
    const [isEdit, setIsEdit] = useState(false);
    const [isSupply, setisSupply] = useState(false);
    const onClose = useCallback(async () => {
        setIsEdit((isEdit) => !isEdit);
        const id = bookItem.bookId;
        const { data } = await bookService.getBooks(id);

        debugger;
        console.log(data);
        setBookItem(data);
    });
    const onCloseSupply = async () => {
        setisSupply((isEdit) => !isEdit);
        const id = bookItem.bookId;
        const { data } = await bookService.getBooks(id);
        console.log(data);
        setBookItem(data);
    };

    return (
        <>
            {isEdit && <BookEdit onClose={onClose} book={bookItem} />}
            {isSupply && <SupplierBookForm onClose={onCloseSupply} book={bookItem} />}
            <div className={cx('wrapper')}>
                <img src={bookItem.mainImage ? bookItem.mainImage : null} />
                <div className={cx('book-id')}>{bookItem.bookId}</div>
                <div className={cx('book-name')}>{bookItem.title}</div>
                <div className={cx('book-quanlity')}>{bookItem.quantity}</div>
                <div className={cx('book-categoryName')}>{bookItem.categoryName}</div>
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
                        variant="add"
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => setisSupply(true)}
                    >
                        Nhập
                    </Button>
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

export default memo(BookItemAdmin);
