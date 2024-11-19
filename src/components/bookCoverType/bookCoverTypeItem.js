import style from './itemComponent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Button from '../button/button';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(style);
function BookCoverTypeComponent({ item, onEdit, onDelete }) {
    const [bookCoverTypeItem, setbookCoverTypeItem] = useState(item);
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('id')}>{bookCoverTypeItem.bookCoverTypeId}</div>

                <div className={cx('name')}>{bookCoverTypeItem.name}</div>

                <div>
                    <Button
                        variant="edit"
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => onEdit(bookCoverTypeItem.bookCoverTypeId)}
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

export default BookCoverTypeComponent;
