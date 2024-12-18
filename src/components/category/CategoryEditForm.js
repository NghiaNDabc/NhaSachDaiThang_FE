import 'react-quill/dist/quill.snow.css';
import styles from './CategoryAddForm.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React, { useEffect, useState } from 'react';
import Button from '../button/button';
import { toast } from 'react-toastify';
import { categoryValidationSchema } from '../../formik/categoryValidationSchema';
import { categoryService } from '../../services/categoryService';
import RequiredStar from '../requiredStar/requiredStar';
import { Formik, Field, Form } from 'formik';

const cx = classNames.bind(styles);

function CategoryFormEdit({ category, onClose }) {
    const [categories, setCategories] = useState([]);
    const [fomatCate, setFomatCate] = useState([]);

    // Fetch categories from the server
    const getCategory = async () => {
        const response = await categoryService.get();
        setCategories(response);
        setFomatCate(formatCategoriesToSelect(response));
    };

    useEffect(() => {
        getCategory();
    }, []);

    // Format categories to be used by react-select or standard select
    const formatCategoriesToSelect = (categories) => {
        return categories.map((category) => ({
            value: category.categoryId,
            label: category.name,
        }));
    };

    const handleSubmit = async (values) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();

        let categoryData = {
            categoryId: values.categoryId,
            name: values.name,
            description: values.description,
            createdBy: `${user.firstName} ${user.lastName}`,
        };

        if (values.parentCategoryID) {
            categoryData.parentCategoryID = values.parentCategoryID;
        }

        try {
            await categoryValidationSchema.validate(categoryData, { abortEarly: false });
        } catch (err) {
            if (err.inner) {
                err.inner.forEach((validationError) => {
                    toast.error(validationError.message);
                });
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật danh mục');
            }
            return;
        }

        Object.keys(categoryData).forEach((key) => {
            formData.append(key, categoryData[key]);
        });

        await categoryService.put(formData);
        onClose();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>

                <h2>Cập nhật danh mục</h2>
                <h3>Mã danh mục {category.categoryId}</h3>

                <Formik
                    initialValues={{
                        categoryId: category.categoryId,
                        name: category.name,
                        parentCategoryID: category.parentCategoryID || '',
                        description: category.description || '',
                    }}
                    validationSchema={categoryValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Tên danh mục <RequiredStar />
                                    <Field
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={cx('input')}
                                        required
                                    />
                                </label>

                                <label className={cx('label')}>
                                    Danh mục cha <RequiredStar />
                                    <Field as="select" name="parentCategoryID" className={cx('input')}>
                                        <option value="">Chọn danh mục cha</option>
                                        {categories &&
                                            categories.map((category) => (
                                                <option key={category.categoryId} value={category.categoryId}>
                                                    {category.name}
                                                </option>
                                            ))}
                                    </Field>
                                </label>
                            </div>

                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Mô tả:
                                    <ReactQuill
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        className={cx('description-editor')}
                                        theme="snow"
                                    />
                                </label>
                            </div>

                            <br />
                            <br />
                            <Button type="submit" className={cx('submit-button')} variant="add">
                                Cập nhật
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default CategoryFormEdit;
