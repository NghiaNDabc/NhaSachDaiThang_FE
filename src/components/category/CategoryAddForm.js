import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import styles from './CategoryAddForm.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import Button from '../button/button';
import { categoryService } from '../../services/categoryService';
import { toast } from 'react-toastify';
import { categoryValidationSchema } from '../../formik/categoryValidationSchema';
import RequiredStar from '../requiredStar/requiredStar';
import Select from 'react-select';
import { fomatListToSelection } from '../../utils/fomatListToSelect';

const cx = classNames.bind(styles);

function CategoryFormAdd({ onClose, onSuccess }) {
    const [categories, setCategories] = useState([]);
    const [fomatCate, setfomatCate] = useState([]);

    // Function to format categories to selection options
    const fomatCategoryToSelection = (categories) => {
        let result = [];
        categories.forEach((category) => {
            result.push({
                value: category.categoryId,
                label: `${category.name}`,
            });
        });
        return result;
    };

    const getCategory = async () => {
        const x = await categoryService.get();
        setCategories(x);
        const y = fomatCategoryToSelection(x);
        setfomatCate(y);
    };

    useEffect(() => {
        getCategory();
    }, []);

    // Formik hook for managing form state and validation
    const formik = useFormik({
        initialValues: {
            name: '',
            parentCategoryID: null,
            description: '',
        },
        validationSchema: categoryValidationSchema,
        onSubmit: async (values) => {
            const user = JSON.parse(localStorage.getItem('user'));
            const formData = new FormData();
            let categoryData = {
                name: values.name,
                description: values.description,
                createdBy: `${user.firstName} ${user.lastName}`,
            };
            if (values.parentCategoryID != null && values.parentCategoryID != '') {
                categoryData = {
                    ...categoryData,
                    parentCategoryID: values.parentCategoryID,
                };
            }
            try {
                await categoryValidationSchema.validate(categoryData, { abortEarly: false });
            } catch (err) {
                // Show validation errors
                if (err.inner) {
                    err.inner.forEach((validationError) => {
                        toast.error(validationError.message);
                    });
                } else {
                    toast.error('Có lỗi xảy ra khi thêm danh mục');
                }
                return;
            }
            // Append data to FormData
            Object.keys(categoryData).forEach((key) => {
                formData.append(key, categoryData[key]);
            });
            await categoryService.post(formData);
            await getCategory();
            formik.resetForm(); // Reset Formik form after successful submission
            onSuccess();
        },
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>

                <h2>Thêm danh mục mới</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Tên danh mục <RequiredStar />
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={cx('input')}
                                required
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className={cx('error')}>{formik.errors.name}</div>
                            )}
                        </label>
                        <label className={cx('label')}>
                            Danh mục cha <RequiredStar />
                            <Select
                                className={cx('select-react')}
                                name="parentCategoryID"
                                placeholder="Chọn danh mục cha"
                                options={fomatCate}
                                value={fomatCate.find((option) => option.value === formik.values.parentCategoryID)}
                                onChange={(option) =>
                                    formik.setFieldValue('parentCategoryID', option ? option.value : null)
                                }
                                isClearable
                            />
                            {formik.touched.parentCategoryID && formik.errors.parentCategoryID && (
                                <div className={cx('error')}>{formik.errors.parentCategoryID}</div>
                            )}
                        </label>
                    </div>

                    <div className={cx('row')}>
                        <label className={cx('label')}>
                            Mô tả:
                            <ReactQuill
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue('description', value)}
                                className={cx('description-editor')}
                                theme="snow"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className={cx('error')}>{formik.errors.description}</div>
                            )}
                        </label>
                    </div>

                    <Button type="submit" className={cx('submit-button')} variant="add">
                        Tạo mới
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default CategoryFormAdd;
