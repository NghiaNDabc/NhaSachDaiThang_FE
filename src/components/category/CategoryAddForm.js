import 'react-quill/dist/quill.snow.css';
import styles from './CategoryAddForm.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React, { useEffect, useState } from 'react';
import Button from '../button/button';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import { categoryValidationSchema } from '../../formik/categoryValidationSchema';
import { categoryService } from '../../services/categoryService';
const cx = classNames.bind(styles);

function CategoryFormAdd({ onClose, onSuccess }) {
    const [categories, setCategories] = useState();
    const [name, setName] = useState('');
    const [parentCategoryID, setParentCategoryID] = useState();
    const [description, setDescription] = useState();

    const resetForm = () => {
        setName();
        setParentCategoryID();
        setDescription();
    };

    const getCategory = async () => {
        const x = await categoryService.get();
        setCategories(x);
    };

    useEffect(() => {
        getCategory();
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        let categoryData = {
            name,
            description,
            createdBy: user.firstName + ' ' + user.lastName,
        };
        if (parentCategoryID) {
            categoryData = {
                parentCategoryID,
                ...categoryData,
            };
        }
        try {
            await categoryValidationSchema.validate(categoryData, { abortEarly: false });
        } catch (err) {
            // Hiển thị lỗi validate
            if (err.inner) {
                err.inner.forEach((validationError) => {
                    toast.error(validationError.message);
                });
            } else {
                toast.error('Có lỗi xảy ra khi thêm sách');
            }
            return;
        }
        Object.keys(categoryData).forEach((key) => {
            formData.append(key, categoryData[key]);
        });
        await categoryService.post(formData);
        await getCategory();
        resetForm();
        onSuccess();
    };
// {category.subCategories && renderCategories(category.subCategories, level + 1)}
    const renderCategories = (categories, level = 0) => {
        if (categories)
            return categories.map((category) => (
                <React.Fragment key={category.categoryId}>
                    <option value={category.categoryId}>{`${'—'.repeat(level)} ${category.name}`}</option>
                    
                </React.Fragment>
            ));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>

                <h2>Thêm sách danh mục mới</h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên danh mục
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Danh mục cha
                        <select
                            value={parentCategoryID}
                            onChange={(e) => {
                                setParentCategoryID(e.target.value);
                            }}
                            className={cx('input')}
                        >
                            <option value="">Chọn danh mục cha</option>
                            {renderCategories(categories)}
                        </select>
                    </label>
                </div>

                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Mô tả:
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            className={cx('description-editor')}
                            theme="snow"
                        />
                    </label>
                </div>
                <br />
                <br />
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Thêm danh mục mới
                </Button>
            </div>
        </div>
    );
}

export default CategoryFormAdd;
