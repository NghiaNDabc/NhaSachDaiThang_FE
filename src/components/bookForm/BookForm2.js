import 'react-quill/dist/quill.snow.css';
import styles from './BookForm2.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React, { useState } from 'react';
import Button from '../button/button';
import { useCategories } from '../../contexts/CategoryContext';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import { bookValidationSchema } from '../../formik/useBookFormik';
const cx = classNames.bind(styles);

function BookForm2({ onClose }) {
    const { categories, bookCoverTypes, languages } = useCategories();
    const [title, setTitile] = useState('');
    const [bookCoverTypeId, setBookCoverTypeId] = useState('');
    const [languageId, setLanguageId] = useState('');
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [publishYear, setPublishYear] = useState();
    const [pageCount, setPageCount] = useState('');
    const [size, setSize] = useState('');
    const [categoryId, setCategoryId] = useState();
    const [description, setDescription] = useState();
    const [promotion, setPromotion] = useState();
    const [promotionEndDate, setPromotionEndDate] = useState();
    const [images, setImages] = useState([]);
    const [weight, setWeight] = useState();
    const [price, setPrice] = useState();
    const resetForm = () => {
        setTitile('');
        setAuthor('');
        setPublisher('');
        setBookCoverTypeId('');
        setLanguageId('');
        setPageCount('');
        setPublishYear('');
        setPageCount('');
        setSize('');
        setCategoryId('');
        setDescription('');
        setPromotion('');
        setPromotionEndDate('');
        setImages('');
        setWeight('');
        setPrice('');
    };

    const handleImageChange = (e) => {
        const newImg = Array.from(e.target.files);
        setImages((pre) => [...pre, ...newImg]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (promotion != undefined && promotion < 0) {
            toast.error('Kiểm tra lại thời gian khuyến mãi');
        }
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        let bookData = {
            categoryId,
            languageId,
            bookCoverTypeId,
            title,
            author,
            publisher,
            publishYear,
            pageCount,
            size,
            weight,
            price,
            description,
            createdBy: user.firstName + ' ' + user.lastName,
        };
        if (promotion) bookData = { promotion, ...bookData };
        if (promotionEndDate) bookData = { promotionEndDate, ...bookData };
        try {
            await bookValidationSchema.validate(bookData, { abortEarly: false });
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
        Object.keys(bookData).forEach((key) => {
            formData.append(key, bookData[key]);
        });

        if (images && images.length > 0)
            images.forEach((img) => {
                formData.append('imageFiles', img);
            });

        await bookService.postBook(formData);
    };
    const renderCategories = (categories, level = 0) => {
        return categories.map((category) => (
            <React.Fragment key={category.categoryId}>
                <option value={category.categoryId}>{`${'—'.repeat(level)} ${category.name}`}</option>
                {category.subCategories && renderCategories(category.subCategories, level + 1)}
            </React.Fragment>
        ));
    };
    const renderBookCoverType = (bookCoverTypes) => {
        return bookCoverTypes.map((bookCoverType) => (
            <React.Fragment key={bookCoverType.bookCoverTypeId}>
                <option value={bookCoverType.bookCoverTypeId}>{`${bookCoverType.name}`}</option>
            </React.Fragment>
        ));
    };
    const renderLanguages = (languages) => {
        return languages.map((language) => (
            <React.Fragment key={language.languageId}>
                <option value={language.languageId}>{`${language.name}`}</option>
            </React.Fragment>
        ));
    };
    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm sách mới</h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tiêu đề
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitile(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Danh mục
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                            }}
                            className={cx('input')}
                        >
                            <option value="">Chọn danh mục</option>
                            {renderCategories(categories)}
                        </select>
                    </label>
                    <label className={cx('label')}>
                        Ngôn ngữ
                        <select
                            value={languageId}
                            onChange={(e) => {
                                setLanguageId(e.target.value);
                            }}
                            className={cx('input')}
                        >
                            <option value="">Chọn ngôn ngữ</option>
                            {renderLanguages(languages)}
                        </select>
                    </label>
                    <label className={cx('label')}>
                        Loại bìa
                        <select
                            value={bookCoverTypeId}
                            onChange={(e) => {
                                setBookCoverTypeId(e.target.value);
                            }}
                            className={cx('input')}
                        >
                            <option value="">Chọn loại bìa</option>
                            {renderBookCoverType(bookCoverTypes)}
                        </select>
                    </label>
                    <label className={cx('label')}>
                        Tác giả
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Nhà xuất bản
                        <input
                            type="text"
                            value={publisher}
                            onChange={(e) => setPublisher(e.target.value)}
                            className={cx('input')}
                            required
                        />
                    </label>
                    <label className={cx('label')}>
                        Năm xuất bản
                        <input
                            type="number"
                            value={publishYear}
                            onChange={(e) => setPublishYear(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                </div>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Số trang
                        <input
                            type="text"
                            value={pageCount}
                            onChange={(e) => setPageCount(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                    <label className={cx('label')}>
                        Kích thước (dài x rộng x cao cm)
                        <input
                            type="text"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                    <label className={cx('label')}>
                        Cân nặng (g)
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                    <label className={cx('label')}>
                        Giá bán (VND)
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                    <label className={cx('label')}>
                        Khuyến mãi (%)
                        <input
                            type="text"
                            value={promotion}
                            onChange={(e) => setPromotion(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                    <label className={cx('label')}>
                        Ngày kết thúc khuyến mãi
                        <input
                            type="datetime-local"
                            value={promotionEndDate}
                            onChange={(e) => setPromotionEndDate(e.target.value)}
                            className={cx('input')}
                        />
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
                <br></br>
                <div className={cx('label')}>
                    Hình ảnh
                    <input onChange={handleImageChange} type="file" multiple accept="image/*" className={cx('input')} />
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
                <Button onClick={handleSubmit} className={cx('submit-button')} variant="add">
                    Thêm sách mới
                </Button>
                <Button onClick={resetForm} className={cx('reset-button')} variant="delete">
                    Reset
                </Button>
            </div>
        </div>
    );
}

export default BookForm2;
