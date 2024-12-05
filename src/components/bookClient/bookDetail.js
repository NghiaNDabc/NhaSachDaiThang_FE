// import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../breadCrum/Breadcrumb';
import { bookService } from '../../services/bookService/bookService';
import { useClientContext } from '../../contexts/CientContext';
import { findCategoryById } from '../../utils/breadCrumbHepler';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FaShoppingCart } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import style from './bookDetail.module.scss';
import { toast } from 'react-toastify';
import { CartContext } from '../../contexts/CartContext';
function BookDetail() {
    const { bookId } = useParams(); // Lấy ID từ URL
    const [book, setBook] = useState(null);
    const [price, setPrice] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const { categories } = useClientContext();
    const [breadcrumbCategories, setBreadcrumbCategories] = useState([]);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isPromotion, setIspromotion] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const { addToCart } = useContext(CartContext);
    useEffect(() => {
        const getBook = async () => {
            const { data } = await bookService.getBooks(bookId);
            setBook(data);
            setPrice(data.price);
            const isGiamGia =
                data.promotion &&
                data.promotionEndDate &&
                data.promotion > 0 &&
                new Date(data.promotionEndDate) > new Date();
            setIspromotion(isGiamGia);
            if (isGiamGia) {
                const discoontedPr = (parseInt(data.price) * (100 - parseInt(data.promotion))) / 100;
                setDiscountedPrice(discoontedPr);
            }
            if (data && data.categoryId && categories) {
                const breadcrumbs = [];
                let currentCategoryId = data.categoryId;

                // Truy tìm các danh mục cha
                while (currentCategoryId) {
                    const category = findCategoryById(categories, currentCategoryId);
                    if (category) {
                        breadcrumbs.unshift({
                            name: category.name,
                            link: `/category/${category.categoryId}`,
                        });
                        currentCategoryId = category.parentCategoryID;
                    } else {
                        break;
                    }
                }
                // Thêm danh mục sách vào cuối breadcrumb
                breadcrumbs.push({ name: data.title, link: `/book/${bookId}` });
                setBreadcrumbCategories(breadcrumbs);
            }
        };
        getBook();
    }, [bookId, categories]);

    const handleAddToCart = () => {
        if (quantity < 1 || quantity > book.quantity) {
            toast.error('Vui lòng chọn số lượng hợp lệ!');
        } else {
            addToCart(parseInt(bookId), quantity);
            toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
        }
    };
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) {
            setErrorMessage('Số lượng không thể nhỏ hơn 1');
            setQuantity(1); // Reset to 1
        } else if (newQuantity > book.quantity) {
            setErrorMessage(`Số lượng không thể vượt quá ${book.quantity}`);
            setQuantity(book.quantity); // Reset to the available stock
        } else {
            setErrorMessage('');
            setQuantity(newQuantity);
        }
    };
    return (
        book && (
            <div
                style={{
                    maxWidth: '1500px',
                }}
            >
                <Breadcrumb categories={breadcrumbCategories} />
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Section: Images */}
                    <div className="w-full lg:w-1/3">
                        {/* Main Image Swiper */}
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            className="mb-6"
                            spaceBetween={10}
                        >
                            {[book.mainImage, ...book.additionalImages?.split(';').filter((image) => image)].map(
                                (image, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={image}
                                            alt={`Book Image ${index}`}
                                            className="rounded-lg w-full h-96 object-contain"
                                            style={{
                                                height: '500px', // Điều chỉnh chiều cao ảnh
                                                objectFit: 'contain', // Giữ tỷ lệ ảnh mà không bị cắt
                                                maxWidth: '100%', // Đảm bảo ảnh chiếm toàn bộ chiều rộng của container
                                                margin: '0 auto', // Canh giữa ảnh
                                            }}
                                        />
                                    </SwiperSlide>
                                ),
                            )}
                        </Swiper>
                        {/* Related Images Swiper */}
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            onSwiper={setThumbsSwiper}
                            slidesPerView={4}
                            spaceBetween={0}
                            navigation
                            className="cursor-pointer"
                        >
                            {[book.mainImage, ...book.additionalImages?.split(';').filter((image) => image)].map(
                                (image, index) => (
                                    <SwiperSlide
                                        key={index}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <img
                                            style={{
                                                border: '1px solid grey',
                                                cursor: 'pointer',
                                            }}
                                            src={image}
                                            alt={`Thumbnail ${index}`}
                                            className="rounded-lg border border-gray-300 h-28 w-28 object-cover"
                                        />
                                    </SwiperSlide>
                                ),
                            )}
                        </Swiper>
                        <div className="mt-8 flex items-center gap-6">
                            {book.quantity > 0 ? (
                                <>
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="px-4 py-2 border rounded-md text-2xl"
                                    >
                                        -
                                    </button>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                            className="w-24 p-3 border rounded-md  text-center text-lg"
                                        />
                                        <p style={{ position: 'absolute', top: '40px', left: '-20px', width: '250px' }}>
                                            {errorMessage && (
                                                <div style={{ color: 'red', fontSize: '14px' }}>{errorMessage}</div>
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-4 py-2 border rounded-md text-2xl"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex items-center gap-3 text-white px-8 py-4 rounded-lg text-lg font-medium ${style.button}`}
                                    >
                                        <FaShoppingCart size={24} /> Thêm vào giỏ hàng
                                    </button>
                                </>
                            ) : (
                                <div className={style.hethang}>Hết hàng</div>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Details */}
                    <div className="w-full lg:w-2/3">
                        {/* Tiêu đề sách */}
                        <h1 className="text-5xl font-bold mb-6">{book.title}</h1>
                        <h3 className="text-3xl font-bold mb-6">
                            <i>Số lượng còn: {book.quantity ?? 0}</i>
                        </h3>
                        <div>
                            <span
                                style={{
                                    color: 'red',
                                    fontWeight: 'bold',
                                    marginRight: '5px',
                                    fontSize: '22px',
                                }}
                            >
                                {isPromotion ? discountedPrice : price} đ
                            </span>
                            <span
                                style={{
                                    color: 'grey',
                                    textDecoration: 'line-through',
                                    marginRight: '5px',
                                }}
                            >
                                {isPromotion ? price : ''}
                            </span>
                            <span
                                style={{
                                    display: 'inline-block',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    marginRight: '5px',
                                    backgroundColor: 'red',
                                    fontSize: '18px',
                                    borderRadius: '10px',
                                    padding: '2px',
                                }}
                            >
                                {isPromotion ? '-' + book.promotion + '%' : ''}
                            </span>
                        </div>
                        {/* Thông tin sách */}
                        <br />
                        <div className="overflow-x-auto">
                            <h3 className="text-2xl font-bold mb-6">Thông tin chi tiết</h3>
                            <table
                                style={{
                                    width: '400px',
                                }}
                                className="text-2xl text-left"
                            >
                                <tbody>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-4 font-medium">Mã hàng</th>
                                        <td className="px-6 py-4">{book.bookId}</td>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-2 font-medium">Tác giả</th>
                                        <td className="px-6 py-4">{book.author}</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-4 font-medium">NXB</th>
                                        <td className="px-6 py-4">{book.publisher}</td>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Năm XB</th>
                                        <td className="px-6 py-4">{book.publishYear}</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-4 font-medium">Ngôn ngữ</th>
                                        <td className="px-6 py-4">{book.languageName}</td>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Trọng lượng (gr)</th>
                                        <td className="px-6 py-4">{book.weight}</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-4 font-medium">Kích thước bao bì</th>
                                        <td className="px-6 py-4">{book.size}</td>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Số trang</th>
                                        <td className="px-6 py-4">{book.pageCount}</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-4 font-medium">Hình thức</th>
                                        <td className="px-6 py-4">{book.bookCoverTypeName}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Chọn số lượng và thêm vào giỏ hàng */}
                    </div>
                </div>
                <br />
                <hr />
                <div
                    style={{
                        maxWidth: '1500px',
                        textAlign: 'justify',
                    }}
                    dangerouslySetInnerHTML={{ __html: book.description }}
                />
            </div>
        )
    );
}

export default BookDetail;

// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Breadcrumb from '../breadCrum/Breadcrumb';
// import { bookService } from '../../services/bookService/bookService';
// import { useClientContext } from '../../contexts/CientContext';
// import { findCategoryById } from '../../utils/breadCrumbHepler';

// function BookDetail() {
//     const { bookId } = useParams(); // Lấy ID từ URL
//     const [book, setBook] = useState(null);
//     const { categories } = useClientContext();
//     const [breadcrumbCategories, setBreadcrumbCategories] = useState([]);
//     useEffect(() => {
//         const getBook = async () => {
//             const { data } = await bookService.getBooks(bookId);
//             debugger;
//             setBook(data);

//             if (data && data.categoryId && categories) {
//                 const breadcrumbs = [];
//                 let currentCategoryId = data.categoryId;

//                 // Truy tìm các danh mục cha
//                 while (currentCategoryId) {
//                     const category = findCategoryById(categories, currentCategoryId);
//                     if (category) {
//                         breadcrumbs.unshift({
//                             name: category.name,
//                             link: `/category/${category.categoryId}`,
//                         });
//                         currentCategoryId = category.parentCategoryID;
//                     } else {
//                         break;
//                     }
//                 }
//                 // Thêm danh mục sách vào cuối breadcrumb
//                 breadcrumbs.push({ name: data.title, link: `/book/${bookId}` });
//                 setBreadcrumbCategories(breadcrumbs);
//             }
//         };
//         getBook();
//     }, [bookId]);
//     return (
//         book && (
//             <div>
//                 <Breadcrumb categories={breadcrumbCategories} />
//                 <h1>{book.title}</h1>
//                 <p>{book.description}</p>
//                 <img src={book.mainImage} alt={book.title} />
//             </div>
//         )
//     );
// }

// export default BookDetail;
