import 'react-quill/dist/quill.snow.css';
import styles from './BookForm2.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React, { useEffect, useState } from 'react';
import Button from '../button/button';
import { useCategories } from '../../contexts/CategoryContext';
import { bookService } from '../../services/bookService/bookService';
import { bookValidationSchema } from '../../formik/useBookFormik';
import RequiredStar from '../requiredStar/requiredStar';
import Select from 'react-select';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
    fomatListBookCoverTypeToSelection,
    fomatListLanguageToSelection,
    fomatListToSelection,
} from '../../utils/fomatListToSelect';

const cx = classNames.bind(styles);

function BookForm({ onClose }) {
    const { categories, bookCoverTypes, languages } = useCategories();
    const [images, setImages] = useState([]);
    const [formattedCategories, setFormattedCategories] = useState([]);
    const [formattedLanguage, setFormattedLanguage] = useState([]);
    const [formattedBookcovertype, setFormattedBookcovertype] = useState([]);
    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const handleImageChange = (e) => {
        const newImg = Array.from(e.target.files);
        setImages((prev) => [...prev, ...newImg]);
    };

    const handleSubmit = async (values) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        let bookData = {
            ...values,
            createdBy: `${user.firstName} ${user.lastName}`,
        };

        Object.keys(bookData).forEach((key) => {
            if (bookData[key] !== null && bookData[key] !== '') {
                formData.append(key, bookData[key]);
            }
        });

        images.forEach((img) => {
            formData.append('imageFiles', img);
        });

        await bookService.postBook(formData);
    };

    useEffect(() => {
        const categoriesFormatted = fomatListToSelection(categories);
        const languagesFormatted = fomatListLanguageToSelection(languages);
        const bookCoverTypesFormatted = fomatListBookCoverTypeToSelection(bookCoverTypes);

        setFormattedCategories(categoriesFormatted);
        setFormattedLanguage(languagesFormatted);
        setFormattedBookcovertype(bookCoverTypesFormatted);
    }, [categories, languages, bookCoverTypes]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm sách mới</h2>

                <Formik
                    initialValues={{
                        title: '',
                        author: '',
                        publisher: '',
                        publishYear: '',
                        pageCount: '',
                        size: '',
                        weight: '',
                        price: '',
                        promotion: '',
                        promotionEndDate: '',
                        description: '',
                        categoryId: '',
                        languageId: '',
                        bookCoverTypeId: '',
                    }}
                    validationSchema={bookValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, resetForm }) => (
                        <Form>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Tiêu đề <RequiredStar />
                                    <Field type="text" name="title" className={cx('input')} />
                                    <ErrorMessage name="title" component="div" className={cx('error-message')} />
                                </label>

                                <label className={cx('label')}>
                                    Danh mục <RequiredStar />
                                    <Select
                                        name="categoryId"
                                        options={formattedCategories}
                                        placeholder="Chọn danh mục"
                                        onChange={(selectedOption) =>
                                            setFieldValue('categoryId', selectedOption?.value ?? '')
                                        }
                                        value={
                                            formattedCategories.find((option) => option.value === values.categoryId) ||
                                            null
                                        }
                                    />
                                    <ErrorMessage name="categoryId" component="div" className={cx('error-message')} />
                                </label>

                                <label className={cx('label')}>
                                    Ngôn ngữ <RequiredStar />
                                    <Select
                                        name="languageId"
                                        placeholder="Chọn ngôn ngữ"
                                        options={formattedLanguage}
                                        onChange={(selectedOption) => setFieldValue('languageId', selectedOption.value)}
                                    />
                                    <ErrorMessage name="languageId" component="div" className={cx('error-message')} />
                                </label>

                                <label className={cx('label')}>
                                    Loại bìa <RequiredStar />
                                    <Select
                                        name="bookCoverTypeId"
                                        placeholder="Chọn loại bìa"
                                        options={formattedBookcovertype}
                                        onChange={(selectedOption) =>
                                            setFieldValue('bookCoverTypeId', selectedOption.value)
                                        }
                                    />
                                    <ErrorMessage
                                        name="bookCoverTypeId"
                                        component="div"
                                        className={cx('error-message')}
                                    />
                                </label>

                                <label className={cx('label')}>
                                    Nhà xuất bản <RequiredStar />
                                    <Field type="text" name="publisher" className={cx('input')} />
                                    <ErrorMessage name="publisher" component="div" className={cx('error-message')} />
                                </label>

                                <label className={cx('label')}>
                                    Năm xuất bản <RequiredStar />
                                    <Field type="number" name="publishYear" className={cx('input')} />
                                    <ErrorMessage name="publishYear" component="div" className={cx('error-message')} />
                                </label>
                            </div>
                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Tác giả <RequiredStar />
                                    <Field type="text" name="author" className={cx('input')} />
                                    <ErrorMessage name="author" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Số trang <RequiredStar />
                                    <Field type="text" name="pageCount" className={cx('input')} />
                                    <ErrorMessage name="pageCount" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Kích thước <RequiredStar />
                                    <Field type="text" name="size" className={cx('input')} />
                                    <ErrorMessage name="size" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Cân nặng <RequiredStar />
                                    <Field type="text" name="weight" className={cx('input')} />
                                    <ErrorMessage name="weight" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Giá bán (VND) <RequiredStar />
                                    <Field type="text" name="price" className={cx('input')} />
                                    <ErrorMessage name="price" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Khuyến mãi
                                    <Field type="text" name="promotion" className={cx('input')} />
                                    <ErrorMessage name="promotion" component="div" className={cx('error-message')} />
                                </label>
                                <label className={cx('label')}>
                                    Ngày kết thúc khuyến mãi
                                    <Field type="datetime-local" name="promotionEndDate" className={cx('input')} />
                                    <ErrorMessage
                                        name="promotionEndDate"
                                        component="div"
                                        className={cx('error-message')}
                                    />
                                </label>
                            </div>

                            <div className={cx('row')}>
                                <label className={cx('label')}>
                                    Mô tả:
                                    <Field name="description">
                                        {({ field }) => (
                                            <ReactQuill
                                                value={field.value || ''}
                                                onChange={(value) => setFieldValue('description', value)}
                                                className={cx('description-editor')}
                                                theme="snow"
                                            />
                                        )}
                                    </Field>
                                </label>
                            </div>
                            <br></br>
                            <div className={cx('label')}>
                                Hình ảnh
                                <input
                                    onChange={handleImageChange}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className={cx('input')}
                                />
                                <div className={cx('image-preview-container')}>
                                    {images &&
                                        images.length > 0 &&
                                        images.map((image, index) => (
                                            <div key={index} className={cx('image-preview-wrapper')}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Selected"
                                                    className={cx('image-preview')}
                                                />{' '}
                                                <button
                                                    type="button"
                                                    className={cx('remove-image-button')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(index);
                                                    }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className={cx('image-preview-container')}></div>
                            <Button type="submit" className={cx('submit-button')} variant="add">
                                Thêm sách mới
                            </Button>

                            <Button
                                onClick={() => {
                                    resetForm();
                                    setImages([]);
                                }}
                                className={cx('reset-button')}
                                variant="delete"
                            >
                                Reset
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default BookForm;
