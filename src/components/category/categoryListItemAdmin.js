import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services/bookService/bookService';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';
import style from './CategoryList.module.scss';
import React, { memo } from 'react';
import Swal from 'sweetalert2';
import { categoryService } from '../../services/categoryService';
import CategoryItem from './categoryItem';
import CategoryFormEdit from './CategoryEditForm';

const cx = classNames.bind(style);

function CategoryListAdmin({ refreshTrigger }) {
    const [categories, setCategories] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [countCategories, setCountCategories] = useState();
    const fetchCategories = async () => {
        try {
            const data = await categoryService.get(null, null, null, pageNumber, pageSize);
            console.log(data);
            setCategories(data);
        } catch (error) {
            toast.error(error);
        }
    };
    useEffect(() => {
        const getCount = async () => {
            const response = await categoryService.getCount();
            console.log(response);
            let count = response.activeBook + response.deactiveBook;

            setCountCategories(count);
        };
        getCount();
    }, []);
    useEffect(() => {
        fetchCategories();
    }, [pageNumber, pageSize, refreshTrigger]);
    const totalPages = Math.ceil(countCategories / pageSize);
    const handlePagenumberChange = (page) => {
        setPageNumber(page);
    };
    const handlePagesizeChange = (page) => {
        const x = Math.ceil(countCategories / page);
        if (x < pageNumber) {
            setPageNumber(x);
        }
        setPageSize(page);
    };
    const handleDelete = useCallback(async (categoriedItem) => {
        const result = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa danh mục: ${categoriedItem.name} (Mã: ${categoriedItem.categoryId})`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            cancelButtonText: 'Hủy',
        });

        if (result.isConfirmed) {
            debugger;
            await categoryService.delete(categoriedItem.categoryId); // Gọi hàm xóa
            //Swal.fire('Đã xóa!', 'Sách đã được xóa.', 'success');
            fetchCategories();
        }
    }, []);

    const [editId, setEitId] = useState();
    const onClose = async () => {
        setEitId();
        fetchCategories();
    };
    const renderCategories = (categories, level = 0) => {
        if (categories && categories.length > 0) {
            return (
                <>
                    {categories.map((category) => (
                        <div key={category.categoryId} className={cx('category-item' + level)}>
                            <CategoryItem
                                key={category.categoryId + '-' + category.name}
                                level={level}
                                category={category}
                                onEdit={setEitId}
                                
                                onDelete={() => handleDelete(category)}
                            />
                            {editId === category.categoryId && (
                                <CategoryFormEdit onClose={onClose} category={category} />
                            )}
                            {category.subCategories && renderCategories(category.subCategories, level + 1)}
                        </div>
                    ))}
                </>
            );
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('list-category')}>
                <div className={cx('category-grid')}>{renderCategories(categories)}</div>
                {/* <div className={cx('pagination')}>
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
                </div> */}
            </div>
        </div>
    );
}

export default CategoryListAdmin;
