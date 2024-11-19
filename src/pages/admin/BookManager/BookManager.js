import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/button/button';
import BookListAdmin from '../../../components/BookAdmin/BookListAdmin';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import classNames from 'classnames/bind';
import style from './BookManager.module.scss';
import BookForm2 from '../../../components/bookForm/BookForm2';
import ToastCustom from '../../../components/toast/toastComponent';
const cx = classNames.bind(style);
function BookManager() {
    const [isAdd, setIsAdd] = useState(false);

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
            {isAdd && <BookForm2 onClose={clickAdd} />}
            <BookListAdmin />
            <ToastCustom />
        </div>
    );
}

export default BookManager;
