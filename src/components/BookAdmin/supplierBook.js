import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import style from './supplierbook.module.scss';
import classNames from 'classnames/bind';
import Button from '../button/button';
import RequiredStar from '../requiredStar/requiredStar';
import { useCategories } from '../../contexts/CategoryContext';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import 'tippy.js/dist/tippy.css';
import Select from 'react-select';
import { supplierBooksService } from '../../services/supplierBookService';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
const cx = classNames.bind(style);

function SupplierBookForm({ onAdd, onClose }) {
    const [bookName, setBookName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [note, setNote] = useState('');
    const [reCal, setreCal] = useState(0);
    const [supplyDate, setSupplyDate] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const { suppliers } = useCategories();
    const [formatSupplier, setFormatSupplier] = useState();
    const [vat, SetVat] = useState(0);
    const [totalPrice, setTotalPeice] = useState(0);
    const [nccErr, setNccErr] = useState('');
    const [dateErr, setDateErr] = useState('');
    const [listBookErr, setListBookErr] = useState('');
    // Debounced function to search books
    // const handleBookSearch = debounce(async (bookName) => {
    //     if (!bookName) return;
    //     try {
    //         const response = await bookService.getBooks(
    //             null,
    //             null,
    //             bookName,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //             null,
    //         );
    //         setSuggestions(response.data || []);
    //     } catch (error) {
    //         toast.error('Error fetching book suggestions.');
    //     }
    // }, 1500);

    // const handleBookNameChange = (event) => {
    //     const value = event.target.value;
    //     setBookName(value);
    //     if (value == null || value == '') setSuggestions([]);
    //     handleBookSearch(value);
    // };
    const debounceSearch = useCallback(
        debounce(async (value) => {
            if (value.trim() === '') {
                setSuggestions([]);
                return;
            }

            try {
                const response = await bookService.getBooks(
                    null,
                    null,
                    value,
                    null,
                    null,
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
                setSuggestions(response.data || []);
            } catch (error) {
                toast.error('Error fetching book suggestions.');
            }
        }, 1000),
        [], // Tạo hàm debounce chỉ một lần
    );

    const handleBookNameChange = (event) => {
        const value = event.target.value;
        setBookName(value);

        // Gọi debounceSearch với chuỗi mới
        debounceSearch(value.trim());
    };
    const formatSupplierFuc = (suppliers) => {
        let rs = [];

        suppliers.forEach((sup) => {
            rs.push({
                value: sup.supplierId,
                label: sup.name,
            });
        });
        return rs;
    };
    useEffect(() => {
        if (suppliers && suppliers.length > 0) setFormatSupplier(formatSupplierFuc(suppliers));
    }, [suppliers]);
    const handleBookSelection = (book) => {
        book.quantity = 0;
        book.supplyPrice = 0;
        setBookList((prev) => [...prev, book]);
        setBookName(''); // Clear input after selection
        setSuggestions([]); // Clear suggestions after selection
    };

    const handleRemoveBook = (bookId) => {
        debugger;
        setBookList((prev) => prev.filter((book) => book.bookId !== bookId));
    };

    const handleQuantityChange = (bookId, value) => {
        setBookList((prev) => prev.map((book) => (book.bookId === bookId ? { ...book, quantity: value } : book)));
    };

    const handlePriceChange = (bookId, value) => {
        setBookList((prev) => prev.map((book) => (book.bookId === bookId ? { ...book, supplyPrice: value } : book)));
    };

    useEffect(() => {
        const calculateTotal = (bookList) => {
            const totalWithoutVat = bookList.reduce((total, book) => {
                const price = parseFloat(book.supplyPrice);
                const quantity = parseInt(book.quantity, 10);

                return total + price * quantity;
            }, 0);

            SetVat(totalWithoutVat * 0.1);

            setTotalPeice(totalWithoutVat); // Return total including VAT
        };
        if (bookList) calculateTotal(bookList);
    }, [bookList, reCal]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        debugger;
        var isValid = true;
        if (supplierId == '') {
            setNccErr('Nhà cung cấp không được để trống');
            isValid = false;
        } else {
            setNccErr('');
        }
        if (!supplyDate || supplyDate == '') {
            setDateErr('Ngày nhập không được để trống');
            isValid = false;
        } else {
            setDateErr('');
        }
        if (!bookList || bookList.length == 0) {
            setListBookErr('Danh sách trống');
            isValid = false;
        } else {
            let haserr = false;
            bookList.forEach((book) => {
                if (book.quantity < 1 || book.supplyPrice < 0) {
                    setListBookErr('Hãy kiểm tra lại số lượng và giá nhập');
                    isValid = false;
                    haserr = true;
                    return;
                }
            });
            if (haserr == false) {
                setListBookErr('');
            }
        }
        if (isValid == false) return;
        const user = JSON.parse(localStorage.getItem('user'));
        const supplierBooks = bookList.map((bookData) => ({
            bookId: bookData.bookId,
            supplyPrice: bookData.supplyPrice,
            quantity: bookData.quantity,
            supplyDate: supplyDate,
            supplierId: supplierId,
            title: bookData.title,
            createdBy: user.firstName + ' ' + user.lastName,
        }));
        const isSucces = await supplierBooksService.post(supplierBooks);
        if (isSucces) onAdd();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <button onClick={onClose} className={cx('close-button')}>
                    X
                </button>
                <h2>Thêm mới đơn nhập hàng</h2>
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Nhà cung cấp
                        <RequiredStar />
                        <Select
                            className={cx('select-react')}
                            options={formatSupplier}
                            placeholder="Chọn nhà cung cấp"
                            // value={formatSupplier.find((option) => option.value === supplierId)}
                            onChange={(selected) => setSupplierId(selected ? selected.value : null)}
                        />
                        <div className={cx('error')}>{nccErr}</div>
                    </label>
                    <label className={cx('label')}>
                        Ngày nhập
                        <RequiredStar />
                        <input
                            type="date"
                            value={supplyDate}
                            onChange={(e) => setSupplyDate(e.target.value)}
                            className={cx('input')}
                            required
                        />
                        <div className={cx('error')}>{dateErr}</div>
                    </label>
                </div>

                {/* Book Search and Selection */}
                <div className={cx('row')}>
                    <label className={cx('label')}>
                        Tên sách muốn thêm
                        <Tippy
                            content={
                                suggestions.length > 0 && (
                                    <div className={cx('suggestions')}>
                                        {suggestions.map((book) => (
                                            <div
                                                key={book.bookId}
                                                onClick={() => handleBookSelection(book)}
                                                className={cx('suggestion-item')}
                                            >
                                                <div>
                                                    <img
                                                        style={{ width: '60px', marginRight: '8px' }}
                                                        src={book.mainImage}
                                                        alt={book.title}
                                                    />
                                                </div>
                                                <div>
                                                    <strong>{book.title}</strong>
                                                    <br />
                                                    <span>{book.author}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                            visible={!!suggestions.length} // Kiểm tra trước khi hiển thị
                            interactive
                            placement="top-start"
                            offset={[0, 10]}
                        >
                            <input
                                type="text"
                                value={bookName}
                                onChange={handleBookNameChange}
                                className={cx('input')}
                                required
                            />
                        </Tippy>
                    </label>
                </div>

                {/* Added Books */}
                <div className={cx('book-list')}>
                    {
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên</th>
                                    <th>Số lượng(quyển)</th>
                                    <th>Giá nhập(VND)</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookList.length > 0 &&
                                    bookList.map((book) => {
                                        return (
                                            <tr key={book.bookId}>
                                                <td>{book.bookId}</td>
                                                <td>
                                                    <img
                                                        style={{ width: '60px' }}
                                                        src={book.mainImage}
                                                        alt={book.title}
                                                    />
                                                </td>
                                                <td>{book.title}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        defaultValue={0}
                                                        value={book.quantity || ''}
                                                        onChange={(e) =>
                                                            handleQuantityChange(book.bookId, e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        value={book.supplyPrice || ''}
                                                        onChange={(e) => {
                                                            handlePriceChange(book.bookId, e.target.value);
                                                            setreCal((x) => x + 1);
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleRemoveBook(book.bookId)}
                                                        className={cx('remove-button')}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    }
                    <div className={cx('error')}>{listBookErr}</div>
                </div>
                <br />
                <div>
                    {/* <p>
                        <b>Thuế giá trị gia tăng:</b> {vat}
                    </p>{' '} */}
                    {/* Display VAT */}
                    <p>
                        <b>Tổng tiền hàng:</b> {totalPrice.toLocaleString()}
                        {' đ'}
                    </p>{' '}
                    {/* Display VAT */}
                    <p>
                        <b>Tổng phải trả:</b> {totalPrice.toLocaleString()}
                        {' đ'}
                    </p>{' '}
                    {/* Display VAT */}
                </div>

                <Button onClick={handleSubmit} className={cx('submit-button')}>
                    Tạo mới
                </Button>
            </div>
        </div>
    );
}

export default SupplierBookForm;
