import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import BookItemAdmin from './BookItemAdmin';
import classNames from 'classnames/bind';
import style from './BookList.module.scss';
import React, { memo } from 'react';
import Swal from 'sweetalert2';

const cx = classNames.bind(style);

function BookListAdmin() {
    const [books, setBooks] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(7);

    const [countBook, setCountBook] = useState();
    const fetchBoooks = async () => {
        try {
            const data = await bookService.getBooks(null, null, null, pageNumber, pageSize);
            console.log(data);
            setBooks(data);
        } catch (error) {
            toast.error(error);
        }
    };
    useEffect(() => {
        const getCount = async () => {
            const response = await bookService.getCount();
            console.log(response);
            let count = response.activeBook + response.deactiveBook;
            console.log("count" + response.activeBook +' '+ response.deactiveBook);
            setCountBook(count);
        };
        getCount();
    }, []);
    useEffect(() => {
        fetchBoooks();
    }, [pageNumber, pageSize]);
    const totalPages = Math.ceil(countBook / pageSize);
    const handlePagenumberChange = (page) => {
        setPageNumber(page);
    };
    const handlePagesizeChange = (page) => {
        const x = Math.ceil(countBook / page);
        if (x < pageNumber) {
            setPageNumber(x);
        }
        setPageSize(page);
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
            fetchBoooks();
        }
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('list-book')}>
                {books.map((book) => {
                    let id = book.bookId;
                    return (
                        <BookItemAdmin
                            key={book.bookId}
                            book={book}
                            onRestock={() => toast.success(`Restock book with ID: ${id}`)}
                            onDelete={() => handleDelete(book)}
                        />
                    );
                })}
                <div className={cx('pagination')}>
                    <div>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePagenumberChange(index + 1)}
                                className={cx(pageNumber === index + 1 ? 'active' : '')}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <div>
                        <select value={pageSize} onChange={(e) => handlePagesizeChange(e.target.value)}>
                            <option value={5}>5</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(BookListAdmin);
