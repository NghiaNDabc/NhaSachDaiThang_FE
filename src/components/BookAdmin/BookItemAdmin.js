import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './BookItemAdmin.module.scss';
import Button from '../button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { bookService } from '../../services/bookService/bookService';
const cx = classNames.bind(style);
function BookItemAdmin({ book, onRestock, onEdit, onDelete }) {
    const [isDel, setIsDel] = useState(book.isDel);
    const onDeactive =async (id)=>{
       const rs = bookService.changeStatus(id);
       if(rs) setIsDel(pre=> !pre);
    }
    return (
        <div className={cx('wrapper')}>
            <img src={book.mainImage} />
            <div className={cx('book-id')}>{book.bookId}</div>
            <div className={cx('book-name')}>{book.title}</div>
            <div className={cx('book-quanlity')}>{book.quanlity}</div>
            <div className={cx('book-categoryName')}>{book.categoryName}</div>
            <div>
                <Button
                    className={cx(isDel == true ? 'deactive' : 'active')}
                    leftIcon={<FontAwesomeIcon icon={faSquareCheck} />}
                    noBackground
                    onClick={() => onDeactive(book.id)}
                />
            </div>
            <div>
                <Button variant="add" leftIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => onRestock(book.id)}>
                    Nhập
                </Button>
            </div>
            <div>
                <Button
                    variant="edit"
                    leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                    onClick={() => onEdit(book.id)}
                >
                    Sửa
                </Button>
            </div>
            <div>
                <Button
                    variant="delete"
                    leftIcon={<FontAwesomeIcon icon={faTrash} />}
                    onClick={() => onDelete(book.id)}
                >
                    Xóa
                </Button>
            </div>
        </div>
    );
}

export default memo(BookItemAdmin);
