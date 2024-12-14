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
import RequiredStar from '../requiredStar/requiredStar';
const cx = classNames.bind(styles);

function CategoryFormEdit({ category, onClose }) {
    const [categories, setCategories] = useState();
    const [categoryId, setCategoryId] = useState(category.categoryId);
    const [name, setName] = useState(category.name);
    const [parentCategoryID, setParentCategoryID] = useState(category.parentCategoryID);
    const [description, setDescription] = useState(category.description);

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
            categoryId,
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
        await categoryService.put(formData);
        onClose();
    };
    //  {category.subCategories && renderCategories(category.subCategories, level + 1)}
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
                <h3>Mã danh mục {categoryId}</h3>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên danh mục <RequiredStar />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Danh mục cha <RequiredStar />
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
                    Cập nhật
                </Button>
            </div>
        </div>
    );
}

export default CategoryFormEdit;
