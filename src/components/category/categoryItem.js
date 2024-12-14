import React, { memo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './CategoryItem.module.scss';
import Button from '../button/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { categoryService } from '../../services/categoryService';
import CategoryFormEdit from './CategoryEditForm';

const cx = classNames.bind(style);
function CategoryItemAdmin({ category, level, onDelete, onEdit }) {
    const [categoryItem, setCategoryItem] = useState(category);
    const [isDel, setIsDel] = useState(category.isDel);
    const onChangeStatus = async (id) => {
        debugger
        const rs = await categoryService.changeStatus(id);
        if (rs) setIsDel((pre) => !pre);
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('id')}>{'\u00A0\u00A0'.repeat(level) + categoryItem.categoryId}</div>
                <div
                    style={{
                        padding: `0 ${5 * level}px`,
                    }}
                    className={cx('name')}
                >
                    <div className={cx('name' + level)}>{categoryItem.name}</div>
                </div>
                <div>
                    <Button
                        className={cx(isDel == true ? 'deactive' : 'active')}
                        leftIcon={<FontAwesomeIcon icon={faSquareCheck} />}
                        noBackground
                        small
                        onClick={() => onChangeStatus(categoryItem.categoryId)}
                    />
                </div>
                <div>
                    <Button
                        variant="edit"
                        leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
                        onClick={() => onEdit(categoryItem.categoryId)}
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

export default CategoryItemAdmin;
