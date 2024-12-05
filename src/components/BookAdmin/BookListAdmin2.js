import React, { memo, useState, useEffect, useCallback } from 'react';
import Select from 'react-select'; // Import thư viện React Select
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import BookItemAdmin from './BookItemAdmin';
import classNames from 'classnames/bind';
import style from './BookList.module.scss';
import Swal from 'sweetalert2';
import { useCategories } from '../../contexts/CategoryContext';

const cx = classNames.bind(style);

function BookListAdmin2() {
    const [books, setBooks] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [countBook, setCountBook] = useState();
    const [searchParams, setSearchParams] = useState({
        id: '',
        categoryId: null,
        categoryName: null,
        bookName: '',
        minPrice: '',
        maxPrice: '',
    });

    // Fetch book data
    const fetchBooks = async () => {
        try {
            const data = await bookService.getBooks(
                searchParams.id,
                searchParams.categoryId,
                searchParams.bookName,
                pageNumber,
                pageSize,
                false, // active
                searchParams.categoryName,
                searchParams.minPrice,
                searchParams.maxPrice,
            );
            setBooks(data);
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [pageNumber, pageSize]);

    const totalPages = Math.ceil(countBook / pageSize);
    const { categories } = useCategories();
    const formattedCategories = categories.map((cat) => ({
        value: cat.categoryId, // Giá trị sẽ lưu trữ
        label: cat.name, // Nội dung hiển thị
    }));

    // // Fetch categories for categoryId/categoryName
    // const [categories, setCategories] = useState([]);
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {

    //             setCategories(options);
    //         } catch (error) {
    //             toast.error('Không thể lấy danh mục');
    //         }
    //     };
    //     fetchCategories();
    // }, []);

    const handleSearch = () => {
        setPageNumber(1); // Reset về trang đầu
        fetchBooks();
    };
    const handleDelete = useCallback(async (bookItem) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa sách: ${bookItem.title} (Mã: ${bookItem.bookId})`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            await bookService.delete(bookItem.bookId); // Gọi hàm xóa
            //Swal.fire('Đã xóa!', 'Sách đã được xóa.', 'success');
            fetchBooks();
        }
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search-filters')}>
                <input
                    type="text"
                    placeholder="Nhập ID"
                    value={searchParams.id}
                    onChange={(e) => setSearchParams({ ...searchParams, id: e.target.value })}
                />
                <Select
                    options={formattedCategories}
                    placeholder="Chọn Category ID"
                    value={formattedCategories.find((cat) => cat.value === searchParams.categoryId)}
                    onChange={(selected) =>
                        setSearchParams({ ...searchParams, categoryId: selected ? selected.value : null })
                    }
                />
                {/* <Select
                    options={formattedCategories}
                    placeholder="Chọn Category Name"
                    value={categories.find((cat) => cat.name === searchParams.categoryName)}
                    onChange={(selected) =>
                        setSearchParams({ ...searchParams, categoryName: selected ? selected.name : null })
                    }
                /> */}
                <input
                    type="text"
                    placeholder="Nhập Tên sách"
                    value={searchParams.bookName}
                    onChange={(e) => setSearchParams({ ...searchParams, bookName: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={searchParams.minPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, minPrice: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={searchParams.maxPrice}
                    onChange={(e) => setSearchParams({ ...searchParams, maxPrice: e.target.value })}
                />
                <button onClick={() => console.log(searchParams.categoryId)}>NGHIIIIII</button>

                <button onClick={handleSearch}>Tìm kiếm</button>
                <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
            <div className={cx('list-book')}>
                {books.map((book) => (
                    <BookItemAdmin key={book.bookId} book={book} onDelete={() => handleDelete(book)} />
                ))}
            </div>
            <div className={cx('pagination')}>
                <div>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setPageNumber(index + 1)}
                            className={cx(pageNumber === index + 1 ? 'active' : '')}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        {[5, 7, 10, 15].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default memo(BookListAdmin2);
