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

function BookEdit({ book, onClose }) {
    const { categories, bookCoverTypes, languages } = useCategories();
    const [bookId, setBookId] = useState(book.bookId);
    const [newImg, setNewImg] = useState([]);
    const [title, setTitle] = useState(book.title);
    const [mainImage, setMainImage] = useState(book.mainImage);
    const [additionalImages, setAdditionalImage] = useState(
        book.additionalImages ? book.additionalImages.split(';') : [],
    );
    const [formattedCategories, setFormattedCategories] = useState([]);
    const [formattedLanguage, setFormattedLanguage] = useState([]);
    const [formattedBookcovertype, setFormattedBookcovertype] = useState([]);
    const handleImageChange = (e) => {
        const newImg = Array.from(e.target.files);
        setNewImg((pre) => [...pre, ...newImg]);
    };
    const removeImage = (index) => {
        setNewImg((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const removeAdditionalImage = (index) => {
        setAdditionalImage((pre) => pre.filter((_, i) => i != index));
    };

    const handleSubmit = async (values) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        let bookData = {
            bookId,
            ...values,

            additionalImages: additionalImages ? additionalImages.join(';') : null,
            modifyBy: `${user.firstName} ${user.lastName}`,
        };

        Object.keys(bookData).forEach((key) => {
            if (bookData[key] !== null && bookData[key] !== '') {
                formData.append(key, bookData[key]);
            }
        });
        formData.append('mainImage', mainImage);
        newImg.forEach((img) => {
            formData.append('imageFiles', img);
        });
        debugger;
        await bookService.putBook(formData);
        onClose();
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
                <h2>Sửa sách</h2>
                <h3>{title}</h3>
                <Formik
                    initialValues={{
                        title: book.title,
                        author: book.author,
                        publisher: book.publisher,
                        publishYear: book.publishYear,
                        publishYear: book.publishYear,
                        size: book.size,
                        weight: book.weight,
                        price: book.price,
                        pageCount: book.pageCount,
                        promotion: book.promotion,
                        promotionEndDate: book.promotionEndDate,
                        description: book.description,
                        categoryId: book.categoryId,
                        languageId: book.languageId,
                        bookCoverTypeId: book.bookCoverTypeId,
                    }}
                    validationSchema={bookValidationSchema}
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
                                            setFieldValue('categoryId', selectedOption.value ?? null)
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
                                        value={
                                            formattedCategories.find((option) => option.value === values.languageId) ||
                                            null
                                        }
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
                                        value={
                                            formattedCategories.find(
                                                (option) => option.value === values.bookCoverTypeId,
                                            ) || null
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
                            <div className={cx('all-img')}>
                                <div className={cx('label')}>
                                    Ảnh chính
                                    <div className={cx('image-preview-container')}>
                                        {mainImage != '' && (
                                            <div className={cx('image-preview-wrapper')}>
                                                <img src={mainImage} alt="Selected" className={cx('image-preview')} />{' '}
                                                <button
                                                    className={cx('remove-image-button')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMainImage('');
                                                    }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={cx('label')}>
                                    Ảnh liên quan
                                    <div className={cx('image-preview-container')}>
                                        {additionalImages.length > 0 &&
                                            additionalImages.map((image, index) => {
                                                return (
                                                    <div key={index} className={cx('image-preview-wrapper')}>
                                                        <img
                                                            src={image}
                                                            alt="Selected"
                                                            className={cx('image-preview')}
                                                        />{' '}
                                                        <button
                                                            className={cx('remove-image-button')}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeAdditionalImage(index);
                                                            }}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
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
                                    {newImg.map((image, index) => (
                                        <div key={index} className={cx('image-preview-wrapper')}>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Selected"
                                                className={cx('image-preview')}
                                            />{' '}
                                            <button
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
                            <div className={cx('image-preview-container')}></div>
                            <Button
                                type="submit"
                                onClick={() => {
                                    handleSubmit(values);
                                }}
                                className={cx('submit-button')}
                                variant="add"
                            >
                                Sửa
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default BookEdit;

// import 'react-quill/dist/quill.snow.css';
// import styles from './BookForm2.module.scss';
// import classNames from 'classnames/bind';
// import ReactQuill from 'react-quill';
// import React, { useState, useEffect } from 'react';
// import Button from '../button/button';
// import { useCategories } from '../../contexts/CategoryContext';
// import { bookService } from '../../services/bookService/bookService';
// import { toast } from 'react-toastify';
// import { bookValidationSchema } from '../../formik/useBookFormik';
// import Select from 'react-select';
// import RequiredStar from '../requiredStar/requiredStar';
// import {
//     fomatListBookCoverTypeToSelection,
//     fomatListLanguageToSelection,
//     fomatListToSelection,
// } from '../../utils/fomatListToSelect';
// const cx = classNames.bind(styles);

// function BookEdit({ onClose, book }) {
//     const { categories, bookCoverTypes, languages } = useCategories();
//     const [bookCoverTypeId, setBookCoverTypeId] = useState(book.bookCoverTypeId);
//     const [languageId, setLanguageId] = useState(book.languageId);
//     const [title, setTitile] = useState(book.title);
//     const [author, setAuthor] = useState(book.author);
//     const [publisher, setPublisher] = useState(book.publisher);
//     const [publishYear, setPublisYear] = useState(book.publishYear);
//     const [pageCount, setPageCount] = useState(book.pageCount);
//     const [size, setSize] = useState(book.size);
//     const [categoryId, setCategoryId] = useState(book.categoryId);
//     const [description, setDescription] = useState(book.description);
//     const [promotion, setPromotion] = useState(book.promotion);
//     const [weight, setWeight] = useState(book.weight);
//     const [price, setPrice] = useState(book.price);
//     const [promotionEndDate, setPromotionEndDate] = useState(book.promotionEndDate);
//     const [newImg, setNewImg] = useState([]);
//     const [mainImage, setMainImage] = useState(book.mainImage);
//     const [additionalImages, setAdditionalImage] = useState(
//         book.additionalImages ? book.additionalImages.split(';') : [],
//     );
//     const [formattedCategories, setFormattedCategories] = useState([]);
//     const [formattedLanguage, setformattedLanguage] = useState([]);
//     const [formattedBookcovertype, setformattedBookcovertype] = useState([]);
//     useEffect(() => {
//         const x = fomatListToSelection(categories);
//         const y = fomatListLanguageToSelection(languages);
//         const z = fomatListBookCoverTypeToSelection(bookCoverTypes);
//         setFormattedCategories(x);
//         setformattedLanguage(y);
//         setformattedBookcovertype(z);
//     }, [categories, languages, bookCoverTypes]);
//     const handleImageChange = (e) => {
//         const newImg = Array.from(e.target.files);
//         setNewImg((pre) => [...pre, ...newImg]);
//     };
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const user = JSON.parse(localStorage.getItem('user'));
//         const formData = new FormData();
//         let bookData = {
//             bookId: book.bookId,
//             categoryId,
//             bookCoverTypeId,
//             languageId,
//             title,
//             author,
//             publisher,
//             publishYear,
//             pageCount,
//             size,
//             weight,
//             price,
//             description,
//             mainImage,
//             additionalImages,
//             modifyBy: user.firstName + ' ' + user.lastName,
//         };
//         if (promotion) bookData = { promotion, ...bookData };
//         if (promotionEndDate) bookData = { promotionEndDate, ...bookData };
//         Object.keys(bookData).forEach((key) => {
//             formData.append(key, bookData[key]);
//         });
//         try {
//             await bookValidationSchema.validate(bookData, { abortEarly: false });
//         } catch (err) {
//             // Hiển thị lỗi validate
//             if (err.inner) {
//                 err.inner.forEach((validationError) => {
//                     toast.error(validationError.message);
//                 });
//             } else {
//                 toast.error('Có lỗi xảy ra khi thêm sách');
//             }
//             return;
//         }
//         newImg.forEach((img) => {
//             formData.append('imageFiles', img);
//         });

//         await bookService.putBook(formData);
//         onClose();
//     };
//     const removeImage = (index) => {
//         setNewImg((prevImages) => prevImages.filter((_, i) => i !== index));
//     };
//     const removeAdditionalImage = (index) => {
//         setAdditionalImage((pre) => pre.filter((_, i) => i != index));
//     };
//     return (
//         <div className={cx('wrapper')}>
//             <div className={cx('container')}>
//                 <button onClick={onClose} className={cx('close-button')}>
//                     X
//                 </button>
//                 <h2>Sửa sách: {title}</h2>
//                 <div className={cx('row')}>
//                     <label className={cx('label')}>
//                         Tiêu đề <RequiredStar />
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitile(e.target.value)}
//                             className={cx('input')}
//                             required
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Danh mục <RequiredStar />
//                         <Select
//                             className={cx('select-react')}
//                             options={formattedCategories}
//                             placeholder="Chọn danh mục"
//                             value={formattedCategories.find((option) => option.value === categoryId)}
//                             onChange={(selected) => setCategoryId(selected ? selected.value : null)}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Ngôn ngữ <RequiredStar />
//                         <Select
//                             className={cx('select-react')}
//                             options={formattedLanguage}
//                             placeholder="Chọn loại bìa"
//                             value={formattedLanguage.find((option) => option.value === languageId)}
//                             onChange={(selected) => setLanguageId(selected ? selected.value : null)}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Loại bìa <RequiredStar />
//                         <Select
//                             className={cx('select-react')}
//                             options={formattedBookcovertype}
//                             placeholder="Chọn loại bìa"
//                             value={formattedBookcovertype.find((option) => option.value === bookCoverTypeId)}
//                             onChange={(selected) => {
//                                 setBookCoverTypeId(selected ? selected.value : null);
//                             }}
//                         />
//                     </label>

//                     <label className={cx('label')}>
//                         Nhà xuất bản <RequiredStar />
//                         <input
//                             type="text"
//                             value={publisher}
//                             onChange={(e) => setPublisher(e.target.value)}
//                             className={cx('input')}
//                             required
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Năm xuất bản <RequiredStar />
//                         <input
//                             type="number"
//                             value={publishYear}
//                             onChange={(e) => setPublisYear(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                 </div>
//                 <div className={cx('row')}>
//                 <label className={cx('label')}>
//                         Tác giả <RequiredStar />
//                         <input
//                             type="text"
//                             value={author}
//                             onChange={(e) => setAuthor(e.target.value)}
//                             className={cx('input')}
//                             required
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Số trang <RequiredStar />
//                         <input
//                             type="number"
//                             value={pageCount}
//                             onChange={(e) => setPageCount(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Kích thước <RequiredStar />
//                         <input
//                             type="text"
//                             value={size}
//                             onChange={(e) => setSize(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Cân nặng (g)
//                         <RequiredStar />
//                         <input
//                             type="number"
//                             value={weight}
//                             onChange={(e) => setWeight(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Giá (VND)
//                         <RequiredStar />
//                         <input
//                             type="number"
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Khuyến mãi (%)
//                         <input
//                             type="text"
//                             value={promotion}
//                             onChange={(e) => setPromotion(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                     <label className={cx('label')}>
//                         Ngày kết thúc khuyến mãi
//                         <input
//                             type="datetime-local"
//                             value={promotionEndDate}
//                             onChange={(e) => setPromotionEndDate(e.target.value)}
//                             className={cx('input')}
//                         />
//                     </label>
//                 </div>
//                 <div className={cx('row')}>
//                     <label className={cx('label')}>
//                         Mô tả:
//                         <ReactQuill
//                             value={description}
//                             onChange={setDescription}
//                             className={cx('description-editor')}
//                             theme="snow"
//                         />
//                     </label>
//                 </div>
//                 <br></br>
//                 <div className={cx('all-img')}>
//                     <div className={cx('label')}>
//                         Ảnh chính
//                         <div className={cx('image-preview-container')}>
//                             {mainImage != '' && (
//                                 <div className={cx('image-preview-wrapper')}>
//                                     <img src={mainImage} alt="Selected" className={cx('image-preview')} />{' '}
//                                     <button
//                                         className={cx('remove-image-button')}
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             setMainImage('');
//                                         }}
//                                     >
//                                         X
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className={cx('label')}>
//                         Ảnh liên quan
//                         <div className={cx('image-preview-container')}>
//                             {additionalImages.length > 0 &&
//                                 additionalImages.map((image, index) => {
//                                     return (
//                                         <div key={index} className={cx('image-preview-wrapper')}>
//                                             <img src={image} alt="Selected" className={cx('image-preview')} />{' '}
//                                             <button
//                                                 className={cx('remove-image-button')}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     removeAdditionalImage(index);
//                                                 }}
//                                             >
//                                                 X
//                                             </button>
//                                         </div>
//                                     );
//                                 })}
//                         </div>
//                     </div>
//                 </div>
//                 <div className={cx('label')}>
//                     Hình ảnh
//                     <input onChange={handleImageChange} type="file" multiple accept="image/*" className={cx('input')} />
//                     <div className={cx('image-preview-container')}>
//                         {newImg.map((image, index) => (
//                             <div key={index} className={cx('image-preview-wrapper')}>
//                                 <img src={URL.createObjectURL(image)} alt="Selected" className={cx('image-preview')} />{' '}
//                                 <button
//                                     className={cx('remove-image-button')}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         removeImage(index);
//                                     }}
//                                 >
//                                     X
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//                 <div className={cx('image-preview-container')}></div>
//                 <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
//                     Sửa
//                 </Button>
//             </div>
//         </div>
//     );
// }

// export default BookEdit;
