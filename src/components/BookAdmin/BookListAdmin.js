import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import BookItemAdmin from './BookItemAdmin';
import classNames from 'classnames/bind';
import style from './BookList.module.scss';
import React, { memo } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import './BookList.module.scss';
import { useCategories } from '../../contexts/CategoryContext';
import Button from '../button/button';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fomatListToSelection } from '../../utils/fomatListToSelect';
import BookForm2 from '../bookForm/BookForm2';
import BookForm from '../bookForm/BookForm';

const cx = classNames.bind(style);

function BookListAdmin() {
    const { categories, languages, bookCoverTypes } = useCategories();
    const [fomatCategories, setFomatCategories] = useState();
    const [books, setBooks] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [countBook, setCountBook] = useState();
    const [totalPages, settotalPages] = useState();
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [isAdd, setIsAdd] = useState(false);

    const clickAdd = () => {
        setIsAdd(!isAdd);
    };
    // const [id, setId] = useState(null);
    // const [bookName, setBookname] = useState(null);
    // const [categoryId, setcategoryId] = useState(null);
    // const [categoryName, setcategoryName] = useState(null);
    // const [minPrice, setminPrice] = useState(null);
    // const [maxPrice, setmaxprice] = useState(null);
    // const [minQuantity, setminQuantity] = useState(null);
    // const [maxQuantity, setmaxQuantity] = useState(null);
    // const [isPromotion, setisPromotion] = useState(false);
    // const [languageId, setlanguageId] = useState(null);
    // const [bookCoverTypeId, setbookCoverTypeId] = useState(null);
    // const [active, setactive] = useState(false);

    const [searchParams, setSearchParams] = useState({
        id: null,
        bookName: null,
        categoryId: null,
        categoryName: null,
        minPrice: null,
        maxPrice: null,
        minQuantity: null,
        maxQuantity: null,
        isPromotion: false,
        languageId: null,
        bookCoverTypeId: null,
        active: false,
    });
    const [query, setQuery] = useState(searchParams);
    const fetchBoooks = async (query, pageNumber, pageSize) => {
        try {
            const {
                id,
                categoryId,
                bookName,
                active,
                categoryName,
                minPrice,
                maxPrice,
                minQuantity,
                maxQuantity,
                isPromotion,
                languageId,
                bookCoverTypeId,
            } = query;

            const { data, count } = await bookService.getBooks(
                id,
                categoryId,
                bookName,
                pageNumber,
                pageSize,
                active,
                categoryName,
                minPrice,
                maxPrice,
                minQuantity,
                maxQuantity,
                isPromotion,
                languageId,
                bookCoverTypeId,
            );
            let bookArr = Array.isArray(data) ? data : [data];
            if (data == null) bookArr = null;
            setBooks(bookArr);
            debugger;
            setCountBook(count);
            settotalPages(Math.ceil(count / pageSize));
        } catch (error) {
            toast.error(error);
        }
    };
    const handleSearch = () => {
        setIsSearchClicked(true);
        setQuery(searchParams); // Cập nhật truy vấn tìm kiếm
        setPageNumber(1); // Reset về trang đầu tiên
    };
    useEffect(() => {
        const x = fomatListToSelection(categories);
        debugger;
        setFomatCategories(x);
    }, [categories]);
    // const fetchBoooks = async (
    //     id = null,
    //     categoryId = null,
    //     bookName = null,
    //     pageNumber = null,
    //     pageSize = null,
    //     active = false,
    //     categoryName = null,
    //     minPrice = null,
    //     maxprice = null,
    //     minQuatity = null,
    //     maxQuantity = null,
    //     isPromotion = null,
    //     languageId = null,
    //     bookCoverTypeId = null,
    // ) => {
    //     try {
    //         const { data, count } = await bookService.getBooks(
    //             id,
    //             categoryId,
    //             bookName,
    //             pageNumber,
    //             pageSize,
    //             (active = false),
    //             categoryName,
    //             minPrice,
    //             maxprice,
    //             minQuatity,
    //             maxQuantity,
    //             isPromotion,
    //             languageId,
    //             bookCoverTypeId,
    //         );
    //         console.log(data);
    //         setBooks(data);
    //         alert(count);
    //         setCountBook(count);
    //         settotalPages(Math.ceil(count / pageSize));
    //     } catch (error) {
    //         toast.error(error);
    //     }
    // };
    // useEffect(() => {
    //     const getCount = async () => {
    //         const response = await bookService.getCount();
    //         console.log(response);
    //         let count = response.activeBook + response.deactiveBook;
    //         console.log('count' + response.activeBook + ' ' + response.deactiveBook);
    //         setCountBook(count);
    //     };
    //     getCount();
    // }, []);
    const loadBook = () => {
        debugger;
        fetchBoooks(query, pageNumber, pageSize);
    };
    useEffect(() => {
        fetchBoooks(query, pageNumber, pageSize);
    }, [query, pageNumber, pageSize]);

    const handleInputChange = (key, value) => {
        setSearchParams((prev) => ({ ...prev, [key]: value }));
    };

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
            loadBook();
            // fetchBoooks();
        }
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('filters')}>
                <div className={cx('row')}>
                    <input
                        className={cx('input')}
                        type="text"
                        placeholder="ID"
                        value={searchParams.id || ''}
                        onChange={(e) => handleInputChange('id', e.target.value)}
                    />
                    <input
                        className={cx('input')}
                        type="text"
                        placeholder="Tên sách"
                        value={searchParams.bookName || ''}
                        onChange={(e) => handleInputChange('bookName', e.target.value)}
                    />
                    <Select
                        isClearable
                        className={cx('select')}
                        options={fomatCategories}
                        placeholder="Danh mục"
                        onChange={(option) => handleInputChange('categoryId', option?.value || null)}
                    />
                    <Select
                        isClearable
                        className={cx('select')}
                        options={languages.map((lang) => ({ value: lang.languageId, label: lang.name }))}
                        placeholder="Ngôn ngữ"
                        onChange={(option) => handleInputChange('languageId', option?.value || null)}
                    />
                    <Select
                        isClearable
                        className={cx('select')}
                        options={bookCoverTypes.map((type) => ({ value: type.bookCoverTypeId, label: type.name }))}
                        placeholder="Loại bìa"
                        onChange={(option) => handleInputChange('bookCoverTypeId', option?.value || null)}
                    />
                    <Select
                        isClearable
                        options={[
                            { value: true, label: 'Active' },
                            { value: false, label: 'Inactive' },
                        ]}
                        placeholder="Active"
                        onChange={(option) => handleInputChange('active', option?.value || null)}
                    />
                </div>
                <div className={cx('row')}>
                    <input
                        className={cx('input')}
                        type="number"
                        placeholder="giá thấp nhất"
                        value={searchParams.minPrice || ''}
                        onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    />
                    <input
                        className={cx('input')}
                        type="number"
                        placeholder="Giá cao nhất"
                        value={searchParams.maxPrice || ''}
                        onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    />
                    <input
                        className={cx('input')}
                        type="number"
                        placeholder="Số lượng tối thiểu"
                        value={searchParams.minQuantity || ''}
                        onChange={(e) => handleInputChange('minQuantity', e.target.value)}
                    />
                    <input
                        className={cx('input')}
                        type="number"
                        placeholder="Số lượng tối đa"
                        value={searchParams.maxQuantity || ''}
                        onChange={(e) => handleInputChange('maxQuantity', e.target.value)}
                    />
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={searchParams.isPromotion}
                                onChange={(e) => handleInputChange('isPromotion', e.target.checked)}
                            />
                            Khuyến mãi
                        </label>
                    </div>
                    <div>
                        <Button onClick={handleSearch} leftIcon={<FontAwesomeIcon icon={faSearch} />}>
                            Tìm kiếm
                        </Button>
                    </div>
                    <div>
                        <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                            Thêm mới
                        </Button>
                    </div>
                </div>
            </div>
            {/* <div className={cx('list-book')}>
                {books.map((book) => (
                    <div key={book.id}>{book.name}</div>
                ))}
            </div> */}

            {/*  */}
            {isAdd && <BookForm onClose={clickAdd} />}
            <div className={cx('list-book')}>
                {books && books.length > 0
                    ? books.map((book) => {
                          let id = book.bookId;
                          return (
                              <BookItemAdmin
                                  key={book.bookId}
                                  book={book}
                                  onRestock={() => toast.success(`Restock book with ID: ${id}`)}
                                  onDelete={() => handleDelete(book)}
                              />
                          );
                      })
                    : isSearchClicked && (
                          // Hiển thị thông báo nếu không có sách
                          <div className={cx('not-found')}>
                              <h2>Không tìm thấy sách nào</h2>
                          </div>
                      )}
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
