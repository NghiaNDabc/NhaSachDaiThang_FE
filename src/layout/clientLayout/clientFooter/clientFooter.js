import style from './clientFooter.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faYoutubeSquare, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(style);

function ClientFooter() {
    return (
        <div style={{ marginTop: '20px' }} className={cx('footer')}>
            <div className={cx('row')}>
                <div className={cx('footer-infomation')}>
                    <div className={cx('footer-menu')}>
                        <ul>
                            <li className={cx('caption-footer-menu')}>VỀ CHÚNG TÔI</li>
                            <li>
                                <a href="">Giới Thiệu Về Nhà Sách Đại Thắng</a>
                            </li>
                            <li>
                                <a href="">Điều Khoản Sử Dụng</a>
                            </li>
                            <li>
                                <a href="">Chính Sách Bảo Mật</a>
                            </li>
                            <li>
                                <a href="">Chính Sách Bán Hàng</a>
                            </li>
                            <li>
                                <a href="">Phương Thức Vận Chuyển</a>
                            </li>
                        </ul>
                    </div>

                    <div className={cx('footer-menu')}>
                        <ul>
                            <li className={cx('caption-footer-menu')}>TÀI KHOẢN CỦA TÔI</li>
                            <li>
                                <a href="">Đăng nhập</a>
                            </li>
                            <li>
                                <a href="">Tạo Tài Khoản</a>
                            </li>
                            <li>
                                <a href="">Danh Sách Yêu Thích</a>
                            </li>
                            <li>
                                <a href="">Danh Sách So Sánh</a>
                            </li>
                        </ul>
                    </div>

                    <div className={cx('footer-menu')}>
                        <ul>
                            <li className={cx('caption-footer-menu')}>HỖ TRỢ KHÁCH HÀNG</li>
                            <li>
                                <a href="">Các Câu Hỏi Thường Gặp</a>
                            </li>
                            <li>
                                <a href="">Chính Sách Đổi/Trả Hàng</a>
                            </li>
                            <li>
                                <a href="">Quy Định Viết Bình Luận</a>
                            </li>
                        </ul>
                    </div>

                    <div className={cx('footer-menu')}>
                        <ul>
                            <li className={cx('caption-footer-menu')}>LIÊN HỆ VỚI CHÚNG TÔI</li>
                            <li>
                                <a href="">Hotline: 0923718318</a>
                            </li>
                            <li>
                                <a href="">Email: nhasachdaithang@gmail.com</a>
                            </li>
                            <li className={cx('social-media')}>
                                <a href="https://www.facebook.com/nghiaph03">
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a href="">
                                    <FontAwesomeIcon icon={faYoutubeSquare} />
                                </a>
                                <a href="">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                                <a href="">
                                    <FontAwesomeIcon icon={faLinkedinIn} />
                                </a>
                            </li>

                            <li className={cx('verify-bocongthuong')}>
                                <a href="">
                                    <img src="./img/trangchu/bo-cong-thuong.png" alt="" />
                                </a>
                                <a href="">
                                    <img src="./img/trangchu/canh-bo-cong-thuong.png" alt="" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={cx('footer-copyright')}>
                    <p className={cx('footer-coppyright-text')}>
                        © 2023 - Bản quyền của Công Ty Cổ Phần Văn Hóa Đại Thắng
                    </p>
                    <p className={cx('footer-coppyright-text')}>
                        Giấy chứng nhận Đăng ký Kinh doanh số 0301860552 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh
                        cấp ngày 15/08/2022
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ClientFooter;
