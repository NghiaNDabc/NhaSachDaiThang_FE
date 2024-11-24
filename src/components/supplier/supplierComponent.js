import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './itemComponent.module.scss';
import Button from '../button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { categoryService } from '../../services/categoryService';

const cx = classNames.bind(style);
function SuplierComponent({ item, onDelete, onEdit }) {
    const [supplier, setSupplier] = useState(item);
    const [isDel, setIsDel] = useState(supplier.isDel);
    const onChangeStatus = async (id) => {
        const rs = categoryService.changeStatus(id);
        if (rs) setIsDel((pre) => !pre);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('id')}>{supplier.supplierId}</div>
                <div className={cx('name')}>{supplier.name}</div>
                <div className={cx('address')}>{supplier.address}</div>
                <div>
                    <Button
                        className={cx(isDel == true ? 'deactive' : 'active')}
                        leftIcon={<FontAwesomeIcon icon={faSquareCheck} />}
                        noBackground
                        small
                        onClick={() => onChangeStatus(supplier.supplierId)}
                    />
                </div>
                <div>
                    <Button
                        variant="edit"
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => onEdit(supplier.categoryId)}
                        small
                    >
                        Sửa
                    </Button>
                </div>
                <div>
                    <Button small variant="delete" leftIcon={<FontAwesomeIcon icon={faTrash} />} onClick={onDelete}>
                        Xóa
                    </Button>
                </div>
            </div>
        </>
    );
}

export default SuplierComponent;
