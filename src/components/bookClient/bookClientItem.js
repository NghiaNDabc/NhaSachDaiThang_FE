import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'; // Import Link
import classNames from 'classnames/bind';
import style from './bookCLientItem.module.scss';
import { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { toast } from 'react-toastify';

const cx = classNames.bind(style);

function BookClientItem({ book }) {
    const { addToCart } = useContext(CartContext);
    const [isPromotion, setIspromotion] = useState(
        book.promotion && book.promotionEndDate && book.promotion > 0 && new Date(book.promotionEndDate) > new Date(),
    );
    const [price, setPrice] = useState(book.price);
    const [discountedPrice, setDiscountedPrice] = useState(null);
    useState(() => {
        if (isPromotion) {
            const discoontedPr = (parseInt(book.price) * (100 - parseInt(book.promotion))) / 100;
            setDiscountedPrice(discoontedPr);
        }
    }, []);
    return (
        <div className={cx('nd')}>
            {isPromotion && <div className={cx('giamgia')}>-{book.promotion}%</div>}
            <div>
                {/* Chuyển sang Link và thêm ID */}
                <Link to={`/book/${book.bookId}`}>
                    <img className={cx('img')} src={book.mainImage} alt={book.title} />
                </Link>
            </div>
            <div className={cx('gia')}>
                <h2>
                    {/* Sử dụng Link cho tiêu đề */}
                    <Link to={`/book/${book.bookId}`} title={book.title} className={cx('title')}>
                        {book.title.length > 40 ? `${book.title.slice(0, 50)}...` : book.title}
                    </Link>
                </h2>
                <div className={cx('giaban')}>
                    <div
                        className={cx('giasau')}
                        style={{
                            color: '#ff0000',
                        }}
                    >
                        {isPromotion ? discountedPrice : price}đ
                    </div>
                    <div className={cx('giatruoc')}>
                        {isPromotion ? price : ''} {isPromotion ? 'đ' : ''}
                    </div>
                </div>
            </div>
            <div className={cx('chonmua')}>
                {book.quantity > 0 ? (
                    <button
                        onClick={() => {
                            addToCart(book.bookId, 1);
                            toast.success(`Đã thêm ${book.title} sản phẩm vào giỏ hàng!`);
                        }}
                        className={cx('button')}
                    >
                        <FontAwesomeIcon icon={faCartShopping} />
                        Thêm vào giỏ hàng
                    </button>
                ) : (
                    <div className={cx('hethang')}>Hết hàng</div>
                )}
            </div>
        </div>
    );
}

export default BookClientItem;
