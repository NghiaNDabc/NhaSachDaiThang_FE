import 'react-quill/dist/quill.snow.css';
import styles from './BookForm2.module.scss';
import classNames from 'classnames/bind';
import ReactQuill from 'react-quill';
import React, { useState } from 'react';
import Button from '../button/button';
import { useCategories } from '../../contexts/CategoryContext';
import { bookService } from '../../services/bookService/bookService';

const cx = classNames.bind(styles);

function BookForm2({ onClose }) {
    const categoriesx = useCategories();
    console.log();
    const [title, setTitile] = useState('');
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [publishDate, setPublishDate] = useState();
    const [pageCount, setPageCount] = useState('');
    const [size, setSize] = useState('');
    const [categoryId, setCategoryId] = useState();
    const [description, setDescription] = useState();
    const [promotion, setPromotion] = useState();
    const [promotionEndDate, setPromotionEndDate] = useState();
    const [images, setImages] = useState([]);
    const handleImageChange = (e) => {
        const newImg = Array.from(e.target.files);
        setImages((pre) => [...pre, ...newImg]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(categoryId);
        const formData = new FormData();
        const bookData = {
            categoryId,
            title,
            author,
            publisher,
            publishDate,
            pageCount,
            size,
            description,
            promotion,
            promotionEndDate,
        };

        Object.keys(bookData).forEach((key) => {
            formData.append(key, bookData[key]);
        });

        images.forEach((img) => {
            formData.append('imageFiles', img);
        });

        bookService.postBook(formData);
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
                            type="text"
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
                        Khuyến mãi
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
                            type="date"
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
                        {images.map((image, index) => (
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
                    Thêm sách mới
                </Button>
            </div>
        </div>
    );
}

export default BookForm2;
