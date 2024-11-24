import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BookListAdmin from '../../../components/BookAdmin/BookListAdmin';

import classNames from 'classnames/bind';
import style from './BookManager.module.scss';
import ToastCustom from '../../../components/toast/toastComponent';
const cx = classNames.bind(style);
function BookManager() {
   
    return (
        <div>
            
            <BookListAdmin />
            <ToastCustom />
        </div>
    );
}

export default BookManager;
