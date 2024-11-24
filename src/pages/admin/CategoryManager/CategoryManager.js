import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/button/button';
import BookListAdmin from '../../../components/BookAdmin/BookListAdmin';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import classNames from 'classnames/bind';
import style from './CategoryManager.module.scss';
import CategoryFormAdd from '../../../components/category/CategoryAddForm';
import CategoryListItemAdmin from '../../../components/category/categoryListItemAdmin';
const cx = classNames.bind(style);
function CategoryManager() {
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isAdd, setIsAdd] = useState(false);

    const handleRefresh = () => {
        setRefreshTrigger(!refreshTrigger); // Kích hoạt load lại danh sách
    };

    const clickAdd = () => {
        setIsAdd(!isAdd);
    };
    return (
        <div>
            <div>
                <Button variant="add" onClick={clickAdd} leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                    Thêm mới
                </Button>
            </div>
            {isAdd && <CategoryFormAdd onClose={clickAdd} onSuccess={handleRefresh} />}
            <CategoryListItemAdmin refreshTrigger={refreshTrigger} />
          
        </div>
    );
}

export default CategoryManager;
