import style from './itemComponent.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import Button from '../button/button';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const cx = classNames.bind(style);
function LanguageComponent({ item, onEdit, onDelete }) {
    const [languageItem, setLanguageItem] = useState(item);
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('id')}>{languageItem.languageId}</div>

                <div className={cx('name')}>{languageItem.name}</div>

                <div>
                    <Button
                        variant="edit"
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => onEdit(languageItem.languageId)}
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

export default LanguageComponent;
