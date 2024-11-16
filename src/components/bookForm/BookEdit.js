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

function BookEdit({ onClose, book }) {
    const categoriesx = useCategories();
    const [title, setTitile] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [publisher, setPublisher] = useState(book.publisher);
    const [publishDate, setPublishDate] = useState(book.publishDate);
    const [pageCount, setPageCount] = useState(book.pageCount);
    const [size, setSize] = useState(book.size);
    const [categoryId, setCategoryId] = useState(book.categoryId);
    const [description, setDescription] = useState(book.description);
    const [promotion, setPromotion] = useState(book.promotion);
    const [weight, setWeight] = useState(book.weight);
    const [price, setPrice] = useState(book.price);
    const [promotionEndDate, setPromotionEndDate] = useState(book.promotionEndDate);
    const [newImg, setNewImg] = useState([]);
    const [mainImage, setMainImage] = useState(book.mainImage);
    const [additionalImages, setAdditionalImage] = useState(book.additionalImages.split(';'));
    const handleImageChange = (e) => {
        const newImg = Array.from(e.target.files);
        setNewImg((pre) => [...pre, ...newImg]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        let bookData = {
            bookId: book.bookId,
            categoryId,
            title,
            author,
            publisher,
            publishDate,
            pageCount,
            size,
            weight,
            price,
            description,
            mainImage,
            additionalImages,
            modifyBy: user.firstName + ' ' + user.lastName,
        };
        if (promotion) bookData = { promotion, ...bookData };
        if (promotionEndDate) bookData = { promotionEndDate, ...bookData };
        Object.keys(bookData).forEach((key) => {
            formData.append(key, bookData[key]);
        });
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
        newImg.forEach((img) => {
            formData.append('imageFiles', img);
        });

        await bookService.putBook(formData);
        onClose();
    };
    const renderCategories = (categories, level = 0) => {
        return categories.map((category) => (
            <React.Fragment key={category.categoryId}>
                <option value={category.categoryId}>{`${'—'.repeat(level)} ${category.name}`}</option>
                {category.subCategories && renderCategories(category.subCategories, level + 1)}
            </React.Fragment>
        ));
    };
    const removeImage = (index) => {
        setNewImg((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const removeAdditionalImage = (index) => {
        setAdditionalImage((pre) => pre.filter((_, i) => i != index));
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
                            {renderCategories(categoriesx)}
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
                        Ngày xuất bản
                        <input
                            type="date"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                </div>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Số trang
                        <input
                            type="number"
                            value={pageCount}
                            onChange={(e) => setPageCount(e.target.value)}
                            className={cx('input')}
                        />
                    </label>
                    <label className={cx('label')}>
                        Kích thước
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
                        Giá (VND)
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
                                        <img src={image} alt="Selected" className={cx('image-preview')} />{' '}
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
                <div className={cx('label')}>
                    Hình ảnh
                    <input onChange={handleImageChange} type="file" multiple accept="image/*" className={cx('input')} />
                    <div className={cx('image-preview-container')}>
                        {newImg.map((image, index) => (
                            <div key={index} className={cx('image-preview-wrapper')}>
                                <img src={URL.createObjectURL(image)} alt="Selected" className={cx('image-preview')} />{' '}
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
                    Sửa
                </Button>
            </div>
        </div>
    );
}

export default BookEdit;
