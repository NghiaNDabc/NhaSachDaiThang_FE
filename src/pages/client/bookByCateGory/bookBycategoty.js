import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bookService } from '../../../services/bookService/bookService';
import BookClientItem from '../../../components/bookClient/bookClientItem';
import style from './bookByCategory.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function CategoryPage() {
    const { categoryId } = useParams(); // Lấy ID danh mục từ URL
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [priceFilter, setPriceFilter] = useState(null); // Bộ lọc giá

    const fetchBooks = async () => {
        const filters = {
            categoryId,
            pageNumber: page,
            pageSize: 12,
        };

        // Thêm bộ lọc giá nếu có
        if (priceFilter) {
            if (priceFilter.minPrice) filters.minPrice = priceFilter.minPrice;
            if (priceFilter.maxPrice) filters.maxprice = priceFilter.maxPrice;
        }

        try {
            const { data, count } = await bookService.getBooks(
                null,
                filters.categoryId,
                null,
                filters.pageNumber,
                filters.pageSize,
                true,
                null,
                filters.minPrice,
                filters.maxprice,
            );
            setBooks(data);
            setTotalPages(Math.ceil(count / 12)); // Tính tổng số trang
        } catch (error) {
            console.error('Lỗi khi tải sách theo danh mục:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [categoryId, page, priceFilter]);

    const handlePriceFilterChange = (filter) => {
        setPriceFilter(filter);
        setPage(1); // Reset về trang đầu tiên
    };

    return (
        <div className={cx('category-page')}>
            <div className={cx('filter-section')}>
                <h3>Bộ lọc giá</h3>
                <div className={cx('filter-options')}>
                    <label>
                        <input
                            type="radio"
                            name="priceFilter"
                            checked={!priceFilter}
                            onChange={() => handlePriceFilterChange(null)}
                        />
                        Tất cả
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="priceFilter"
                            checked={priceFilter?.minPrice === 0 && priceFilter?.maxPrice === 150000}
                            onChange={() => handlePriceFilterChange({ minPrice: 0, maxPrice: 150000 })}
                        />
                        0 - 150,000
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="priceFilter"
                            checked={priceFilter?.minPrice === 150000 && priceFilter?.maxPrice === 300000}
                            onChange={() => handlePriceFilterChange({ minPrice: 150000, maxPrice: 300000 })}
                        />
                        150,000 - 300,000
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="priceFilter"
                            checked={priceFilter?.minPrice === 300000}
                            onChange={() => handlePriceFilterChange({ minPrice: 300000 })}
                        />
                        Trên 300,000
                    </label>
                </div>
            </div>
            <div className={cx('right')}>
                <div className={cx('book-list')}>
                    {books.length > 0 ? (
                        books.map((book) => <BookClientItem key={book.bookId} book={book} />)
                    ) : (
                        <p>Không có sách nào trong danh mục này.</p>
                    )}
                </div>
                <div className={cx('pagination')}>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            className={cx({ active: page === index + 1 })}
                            onClick={() => setPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryPage;
