import { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import BookItemAdmin from './BookItemAdmin';
import classNames from 'classnames/bind';
import style from './BookList.module.scss';
import React, { memo } from 'react';
const cx = classNames.bind(style);

function BookListAdmin() {
    const [books, setBooks] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(7);

    const [countBook, setCountBook] = useState();
    useEffect(() => {
        const getCount = async () => {
            const response = await bookService.getCount();
            console.log(response);
            let count = response.activeBook + response.deactiveBook;

            setCountBook(count);
        };
        getCount();
    }, []);
    useEffect(() => {
        const fetchBoooks = async () => {
            try {
                console.log(123);
                const data = await bookService.getBooks(null, null, null, pageNumber, pageSize);
                console.log(data);
                setBooks(data);
            } catch (error) {
                toast.error(error);
            }
        };
        fetchBoooks();
    }, [pageNumber, pageSize]);
    const totalPages = Math.ceil(countBook / pageSize);
    const handlePagenumberChange = (page) => {
        setPageNumber(page);
    };
    const handlePagesizeChange = (page) => {
        setPageSize(page);
    };
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
                            onEdit={() => toast.success(`Edit book with ID: ${id}`)}
                            onDelete={() => toast.success(`Delete book with ID: ${id}`)}
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
