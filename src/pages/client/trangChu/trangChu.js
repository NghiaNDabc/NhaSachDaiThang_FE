import { useEffect, useState } from 'react';
import Banner from '../../../layout/banner/banner';
import { bookService } from '../../../services/bookService/bookService';
import BookClientItem from '../../../components/bookClient/bookClientItem';
import style from './trangchu.module.scss';
import classNames from 'classnames/bind';
import { useClientContext } from '../../../contexts/CientContext';
const cx = classNames.bind(style);
function HomePage() {
    const [listNewBook, setListNewBook] = useState([]);
    const { categories } = useClientContext();
    const [selectedCategory, setSelectedCategory] = useState(1); // Danh mục được chọn
    const [booksByCategory, setBooksByCategory] = useState([]);
    useState(() => {
        const getListNewbook = async () => {
            const listnewbook = await bookService.getNewBook();
            setListNewBook(listnewbook);
        };
        getListNewbook();
    }, []);

    useEffect(() => {
        const getBookByCate = async (cateId) => {
            const { data } = await bookService.getBooks(
                null,
                cateId,
                null,
                1,
                10,
                true,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            );
            setBooksByCategory(data);
        };
        if (selectedCategory) getBookByCate(selectedCategory);
    }, [selectedCategory]);
    return (
        <div>
            <Banner />
            <br />
            <div style={{ backgroundColor: '#f2f2f2' }}>
                <div className={cx('section-title')}>
                    <span>Sách mới</span>
                </div>
            </div>
            <div className={cx('sach-giam-gia')}>
                {listNewBook.map((book) => (
                    <BookClientItem book={book} />
                ))}
            </div>

            <div className={cx('sach-theo-danh-muc')}>
                <br />
                <div style={{ backgroundColor: '#f2f2f2' }}>
                    <div className={cx('section-title')}>
                        <span>Sách theo danh mục</span>
                    </div>
                </div>
                <div className={cx('category-list')}>
                    {categories.map((category) => (
                        <button
                            key={category.categoryId}
                            className={cx('category-item', {
                                active: selectedCategory === category.categoryId,
                            })}
                            onClick={() => setSelectedCategory(category.categoryId)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                {/* Sách theo danh mục */}
                <div className={cx('book-section')}>
                    <div className={cx('book-list')}>
                        {booksByCategory.length > 0 ? (
                            booksByCategory.map((book) => <BookClientItem key={book.bookId} book={book} />)
                        ) : (
                            <p>Không có sách nào trong danh mục này.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
